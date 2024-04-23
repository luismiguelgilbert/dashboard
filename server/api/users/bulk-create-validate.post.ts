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

    //Get existing emails
    const { rows } = await serverDB.query('select email from auth.users order by email')
    
    //Validations
    let rowWithErros: any[] = [];
    const userValidationSchema = z.object({
      email: z.coerce.string().email({ message: 'Correo Electrónico no es válido.' }),
      user_name: z.coerce.string().min(3, { message: 'Nombre debe incluir 3 o más caracteres.' }),
      user_lastname: z.coerce.string().min(3, { message: 'Apellido debe incluir 3 o más caracteres.' }),
      user_sex: z.coerce.boolean(),
    });
    payload.users.forEach((row: any, index) => {
      let errors = [];

      //1) Validate if data has the correct schema
      const validationError = userValidationSchema.safeParse({
        email: row[email_field],
        user_name: row[user_name_field],
        user_lastname: row[user_lastname_field],
        user_sex: row[user_sex_field],
      });
      if (!validationError.success) {
        errors.push(...validationError.error.issues);
      };
      //2) Check if email is duplicated on same file (compares if mail is the same in a different row)
      const currentRowEmail = row[email_field].toLowerCase();
      const isDuplicate = payload.users.some((item: any, idx) => item[email_field].toLowerCase() === currentRowEmail && index !== idx);
      if (isDuplicate) {
        errors.push({
          code: "duplicated_email",
          message: "Correo Electrónico duplicado.",
        });
      }
      //3) Check if email already created in the Users table
      const isUser = rows.some((item: any) => item.email === currentRowEmail);
      if (isUser) {
        errors.push({
          code: "existing_user",
          message: "Correo Electrónico ya existe.",
        });
      }

      rowWithErros.push({...row, errors});
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