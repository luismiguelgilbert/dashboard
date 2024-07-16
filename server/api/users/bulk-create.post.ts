import serverDB from '@/server/utils/db';
// import { serverSupabaseServiceRole } from '#supabase/server';
import { array, object, string } from 'yup';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { bulkUsersUpload, type type_userValidationSchema } from '@/types/server/sys_users';

const emails = array(object({
  email: string().email(),
}));

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    const payload = await readValidatedBody(event, body => array(bulkUsersUpload).cast(body));
    await hasUserPermission(userSessionId, PermissionsList.USERS_CREATE);
    const validUsers: type_userValidationSchema[] = [];
    const invalidUsers: type_userValidationSchema[] = [];

    //Get existing emails
    const { rows } = await serverDB.query('select lower(email) as email from auth.users order by email');
    const existingMails = await emails.cast(rows);

    payload?.forEach((newRow) => {
      //1) Validate Duplicated
      if (payload?.some((item) => item.email === newRow.email)) {
        invalidUsers.push(newRow);
      } 
      //2) Validate Existing Email on database
      if (existingMails?.some((mail) => mail.email === newRow.email)) {
        invalidUsers.push(newRow);
      }
    });

    //Create User on Supabase
    // const supabaseService = await serverSupabaseServiceRole(event);
    // payload?.forEach(async (row) => {
    //   const { data, error } = await supabaseService.auth.signUp({
    //     email: row.email!.replaceAll('\'', ''),
    //     password: process.env.NEWUSERSDEFAULTPWD!,
    //     options: {
    //       data: {
    //         user_name: row.user_name,
    //         user_lastname: row.user_lastname,
    //         avatar_url: ''
    //       }
    //     }
    //   });
    //   if (error) {
    //     invalidUsers.push(row);
    //   } else {
    //     validUsers.push(row);
        
    //     //Insert user data
    //     data.user?.id;
    //     const sqlInsertUserData = `insert into public.sys_users 
    //     (id, user_name, user_lastname, user_sex, avatar_url, dark_enabled, default_color, default_dark_color, updated_by)
    //     values 
    //     ('${data.user?.id}', '${row.user_name}', '${row.user_lastname}', ${row.user_sex}, '', false, 'indigo', 'slate', '${userSessionId}');`;
    //     await serverDB.query(sqlInsertUserData);

    //     //Insert user profile
    //     const sqlProfileInsert = `insert into sys_profiles_users (sys_profile_id, user_id) values (${row.sys_profile_id}, '${data.user?.id}');`;
    //     await serverDB.query(sqlProfileInsert);

    //     //Insert user company
    //     const sqlCompaniesInsert = `insert into sys_companies_users (sys_company_id, user_id, is_default) values ('${row.prefered_company_id}', '${data.user?.id}', true)`;
    //     await serverDB.query(sqlCompaniesInsert);
    //   }
    // });

    return {
      validUsers,
      invalidUsers
    };
  } catch(err) {
    console.error(`Error at ${event.path}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});