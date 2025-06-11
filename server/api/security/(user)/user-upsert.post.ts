// import { hasPermission, useSanitizeParams } from '@@/server/utils/handler';
import { supabase } from '@@/server/utils/supabase';
import { base64toBlob } from '~~/app/utils/index';

export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event);
  const serverDB = useDatabase();
  try {
    // event.context.params = useSanitizeParams(event.context.params);
    // const { user } = await getUserSession(event);
    // if (!user) {
    //   throw createError({ statusCode: 401, statusMessage: 'User not found' });
    // }
    const { data: payload, error } = await readValidatedBody(event, sys_users_schema.safeParse);
    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Invalid request: ${error.issues.map(e => e.message).join(';')}`,
      });
    }
    // payload.is_new
    //   ? await hasPermission(event, PermissionsList.COMPANIES_CREATE)
    //   : await hasPermission(event, PermissionsList.COMPANIES_EDIT);

    await serverDB.exec('BEGIN');

    // Upsert data
    await serverDB.sql`insert into sys_users 
      (id, user_name, user_lastname, email, user_sex, sys_profile_id, is_active, updated_by)
      values (
        ${payload.id},
        ${payload.user_name},
        ${payload.user_lastname},
        ${payload.email},
        ${payload.user_sex},
        ${payload.sys_profile_id},
        ${payload.is_active},
        ${user?.userId}
      )
      ON CONFLICT(id) DO UPDATE SET
        user_name = ${payload.user_name},
        user_lastname = ${payload.user_lastname},
        email = ${payload.email},
        user_sex = ${payload.user_sex},
        sys_profile_id = ${payload.sys_profile_id},
        is_active = ${payload.is_active},
        updated_by = ${user?.userId}
    `;

    // Delete user companies and Insert new ones
    await serverDB.sql`delete from sys_companies_users where user_id = ${payload.id}`;

    let multipleRowsInsert = 'insert into sys_companies_users (user_id, sys_company_id) values ';
    payload.sys_companies_users.forEach(async (company) => {
      multipleRowsInsert += `('${payload.id}', '${company}'),`;
    });
    multipleRowsInsert = multipleRowsInsert.slice(0, -1); // Remove the last comma
    await serverDB.exec(multipleRowsInsert);

    // payload.sys_companies_users.forEach(async (companyId) => {
    //   await serverDB.sql`insert into sys_companies_users (sys_company_id, user_id) values (${companyId}, ${payload.id})`;
    // });

    // Update user password if marked for change
    if (payload.change_password) {
      await serverDB.sql`UPDATE sys_users SET user_hash = crypt(${payload.new_password}, gen_salt('md5')) where id = ${payload.id}`;
    }

    // Upload and Upsert avatar URL if file is provided
    if (payload.avatar_file) {
      const fileExt = payload.avatar_file.split('/')[1]?.split(';')[0];
      const filename = `sys-users/${payload.id}.${fileExt}`;
      const blob = base64toBlob(payload.avatar_file, `image/${fileExt}`);
      if (blob) {
        const { error: fileError } = await supabase.storage.from('avatars')
          .upload(filename, blob, {
            cacheControl: '0',
            upsert: true,
          });
        if (fileError) {
          throw createError({
            statusCode: 500,
            statusMessage: `Error uploading file: ${fileError.message}`,
          });
        }
        const { data: fileURL } = supabase.storage.from('avatars').getPublicUrl(filename);
        await serverDB.sql`update sys_users set
          avatar_url = COALESCE(${fileURL.publicUrl}, avatar_url)
          WHERE id = ${payload.id}`;
      }
    }

    await serverDB.exec('COMMIT');
    return new Response('Record saved', { status: 200 });
  } catch (err) {
    console.error(`Error at ${event.method} ${event.path}.`, err);
    await serverDB.exec('ROLLBACK');
    throw createError({
      statusCode: 500,
      statusMessage: typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message?: string }).message ?? `Unhandled exception`
        : `Unhandled exception`,
    });
  }
});
