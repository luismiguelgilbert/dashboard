export const sanitizeSQL = (sql: string): string => {
  const hasTruncate = sql.toLocaleLowerCase().includes('truncate')
  const hasDrop = sql.toLocaleLowerCase().includes('drop')
  const hasDelete = sql.toLocaleLowerCase().includes('delete')
  const hasSelect = sql.toLocaleLowerCase().includes('select')
  const hasInsert = sql.toLocaleLowerCase().includes('insert')
  const hasUpdate = sql.toLocaleLowerCase().includes('update')
  const hasFrom = sql.toLocaleLowerCase().includes('from')
  const isInvalid = hasTruncate || hasDrop || hasDelete || hasSelect || hasInsert || hasUpdate || hasFrom
  if ( isInvalid ) { return '' }

  return sql.trim()
}