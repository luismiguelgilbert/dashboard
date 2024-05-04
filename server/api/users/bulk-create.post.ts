import serverDB from '@/server/utils/db';
import { serverSupabaseServiceRole } from '#supabase/server';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import type { NuxtError } from '#app';

import { bulkUsers } from "@/types/server/sys_users";

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    const payload = await readValidatedBody(event, body => bulkUsers.cast(body))
    await hasUserPermission(userSessionId, PermissionsList.USERS_CREATE);

    const email_field = payload.mapping.email;
    const user_name_field = payload.mapping.user_name;
    const user_lastname_field = payload.mapping.user_lastname;
    const user_sex_field = payload.mapping.user_sex;
    const sys_profile_id = payload.mapping.sys_profile_id;
    const prefered_company_id = payload.mapping.prefered_company_id;
    let validUsers: unknown[] = [];
    let invalidUsers: unknown[] = [];

    //Create User on Supabase
    const supabaseService = await serverSupabaseServiceRole(event);
    
    //Validations
    for (const row of payload.users?) {
      const { data, error } = await supabaseService.auth.signUp({
        email: row[email_field].replaceAll("'", ''),
        password: process.env.NEWUSERSDEFAULTPWD!,
        options: {
          data: {
            user_name: row[user_name_field],
            user_lastname: row[user_lastname_field],
            avatar_url: ''
          }
        }
      });
      if (error) {
        invalidUsers.push(row);
      } else {
        validUsers.push(row);
        
        //Insert user data
        data.user?.id
        const sqlInsertUserData = `insert into public.sys_users 
        (id, user_name, user_lastname, user_sex, avatar_url, dark_enabled, default_color, default_dark_color, updated_by)
        values 
        ('${data.user?.id}', '${row[user_name_field]}', '${row[user_lastname_field]}', ${row[user_sex_field]}, '', false, 'indigo', 'slate', '${userSessionId}');`;
        await serverDB.query(sqlInsertUserData);

        //Insert user profile
        let sqlProfileInsert = `insert into sys_profiles_users (sys_profile_id, user_id) values (${sys_profile_id}, '${data.user?.id}');`;
        await serverDB.query(sqlProfileInsert);

        //Insert user company
        let sqlCompaniesInsert = `insert into sys_companies_users (sys_company_id, user_id, is_default) values ('${prefered_company_id}', '${data.user?.id}', true)`;
        await serverDB.query(sqlCompaniesInsert);
      }
    }

    return {
      validUsers,
      invalidUsers
    };
  } catch(err: NuxtError | any) {
    await serverDB.query('ROLLBACK');
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: err.statusCode ?? 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  };
});