import jwt from 'jsonwebtoken';
import type { H3Event } from 'h3';
import { session_companies_schema, session_permissions_schema } from '~~/shared/types/system';

export const hasPermissions = (event: H3Event, permissions: PermissionsList[]) => {
  const permissionCookie = getCookie(event, 'nuxt-session-permissions');
  if (!permissionCookie) {
    console.error('No permission cookie found');
    throw createError({ statusCode: 401, statusMessage: 'No permission cookie found' });
  }
  const { userPermissions } = session_permissions_schema.parse(jwt.verify(permissionCookie, process.env.NUXT_SESSION_PASSWORD!));
  const hasAllPermissions = permissions.every(p => userPermissions.includes(p));
  if (!hasAllPermissions) {
    console.error(`User does not have required permissions: ${permissions.join(', ')}`);
    throw createError({ statusCode: 401, statusMessage: `User does not have required permissions.` });
  }
}

export const hasCompanies = (event: H3Event, companies: string[]) => {
  const companiesCookie = getCookie(event, 'nuxt-session-companies');
  if (!companiesCookie) {
    console.error('No permission cookie found');
    throw createError({ statusCode: 401, statusMessage: 'No permission cookie found' });
  }
  const { userCompanies } = session_companies_schema.parse(jwt.verify(companiesCookie, process.env.NUXT_SESSION_PASSWORD!));
  const hasAllCompanies = companies.every(c => userCompanies.includes(c));
  if (!hasAllCompanies) {
    console.error(`User does not have required permissions: ${companies.join(', ')}`);
    throw createError({ statusCode: 401, statusMessage: `No company permission found.` });
  }
}
