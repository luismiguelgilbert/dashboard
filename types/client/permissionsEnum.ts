// FROM [dbo].[sys_links]
export enum PermissionsList {
  USERS_CREATE = '010101',
  USERS_EDIT = '010102',
  USERS_EXPORT = '010103',
  ROLES_CREATE = '010201',
  ROLES_EDIT = '010202',
  ROLES_EXPORT = '010203',  
  COMPANIES_CREATE = '010301',
  COMPANIES_EDIT = '010302',
  COMPANIES_EXPORT = '010303',
  UOM_CREATE = '020401',
  UOM_EDIT = '020402',
  UOM_EXPORT = '020403',
  BRANDS_CREATE = '020501',
  BRANDS_EDIT = '020502',
  BRANDS_EXPORT = '020503',
  INVTYPES_CREATE = '020601',
  INVTYPES_EDIT = '020602',
  INVTYPES_EXPORT = '020603',
  ENSMEMBERS_CREATE = '110101',
  ENSMEMBERS_EDIT = '110102',
  ENSMEMBERS_EXPORT = '110103',
}