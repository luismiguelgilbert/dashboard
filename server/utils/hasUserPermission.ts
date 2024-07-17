import serverDB from '@/server/utils/db';

export async function hasUserPermission(userId: any, PermissionID: string) { 
  const isUserAllowedQuery = `select d.sys_link_id 
    from sys_users a
    inner join sys_profiles c on c.id = a.sys_profile_id
    inner join sys_profiles_links d on d.sys_profile_id = c.id
    where a.id = '${userId}'
    and d.sys_link_id = '${PermissionID}'`;
  const isUserAllowedResult = (await serverDB.query(isUserAllowedQuery)).rowCount;
  if (isUserAllowedResult === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: `Usuario ${userId} no tiene permiso (${PermissionID})`,
    });
  } else {
    return true;
  }
}