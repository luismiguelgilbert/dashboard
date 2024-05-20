import serverDB from '@/server/utils/db';
import { array, object, string, ValidationError } from 'yup';
import { hasUserPermission } from '~/server/utils/hasUserPermission';
import { PermissionsList } from '@/types/client/permissionsEnum';
import { bulkMapping, userValidationSchema } from '@/types/server/sys_users';

import { bulkUsers } from '@/types/server/sys_users';
const emails = array(object({
  email: string().email(),
}));

export default defineEventHandler( async (event) => {
  try{
    const userSessionId = event.context.user.id;
    const payload = await readValidatedBody(event, body => bulkUsers.cast(body));
    await hasUserPermission(userSessionId, PermissionsList.USERS_CREATE);
    
    //Bulild mapping
    await bulkMapping.validate(payload.mapping, { strict: true, abortEarly: true });
    const mapping = await bulkMapping.cast(payload.mapping);

    //Get existing emails
    const { rows } = await serverDB.query('select lower(email) as email from auth.users order by email');
    const existingMails = await emails.cast(rows);

    //Build New Data, Validate Schema, Validate Duplicated
    const newUsers = array(userValidationSchema).cast([]);
    payload.users?.forEach((row: any) => {
      const newRow = userValidationSchema.cast({
        email: row[mapping.email].trim().toLowerCase(),
        user_name: row[mapping.user_name].trim().toLowerCase(),
        user_lastname: row[mapping.user_lastname].trim().toLowerCase(),
        user_sex: row[mapping.user_sex].trim().toLowerCase(),
        errors: [],
      });
      //1) Validate Schema
      try {
        userValidationSchema.validateSync(newRow, { strict: true, abortEarly: false });
      } catch (err) {
        if (err instanceof ValidationError) {
          newRow.errors = err.errors;
        }
      }
      //2) Validate Duplicated
      if (newUsers?.some((item) => item.email === newRow.email)) {
        newRow.errors?.push('Correo Electrónico duplicado.');
      } 
      //3) Validate Existing Email on database
      if (existingMails?.some((mail) => mail.email === newRow.email)) {
        newRow.errors?.push('Correo Electrónico ya registrado.');
      }
      
      //Add record
      newUsers?.push(newRow);
    });
    
    return newUsers;
  } catch(err) {
    console.error(`Error at ${event.path}`);
    await serverDB.query('ROLLBACK');
    throw createError({ statusCode: 500, statusMessage: String(err) ?? 'Unhandled exception' });
  }
});