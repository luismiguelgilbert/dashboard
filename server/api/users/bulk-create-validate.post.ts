import serverDB from '@/server/utils/db';
import { z } from 'zod'
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import type { NuxtError } from '#app';

import { bulkUsers } from "@/types/server/sys_users";

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    const payload = await readValidatedBody(event, body => bulkUsers.parse(body))
    await hasUserPermission(userSessionId, PermissionsList.USERS_CREATE);

    const email_field = payload.mapping.email;
    const user_name_field = payload.mapping.user_name;
    const user_lastname_field = payload.mapping.user_lastname;
    const user_sex_field = payload.mapping.user_sex;
    const sys_profile_id_field = payload.mapping.sys_profile_id;
    const prefered_company_id_field = payload.mapping.prefered_company_id;
    //Check data is valid
    const userValidationSchema = z.object({
      email: z.coerce.string().email({ message: 'Correo Electrónico no es válido.' }),
      user_name: z.coerce.string().min(3, { message: 'Nombre debe incluir 3 o más caracteres.' }),
      user_lastname: z.coerce.string().min(3, { message: 'Apellido debe incluir 3 o más caracteres.' }),
      user_sex: z.coerce.boolean(),
    });

    //Validations
    //pending - check if mail is duplicated on same file
    //pending - check if mail exists in database (left join for simple pass)
    let rowWithErros: any[] = [];
    payload.users.forEach((row: any) => {
      const result = userValidationSchema.safeParse({
        email: row[email_field],
        user_name: row[user_name_field],
        user_lastname: row[user_lastname_field],
        user_sex: row[user_sex_field],
      });
      if (!result.success) {
        rowWithErros.push({...row, errors: result.error.issues});
      }
    });
    return rowWithErros;
  } catch(err: NuxtError | any) {
    await serverDB.query('ROLLBACK');
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: err.statusCode ?? 500,
      statusMessage: `${err ?? 'Unhandled exception'}`,
    });
  };
});