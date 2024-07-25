import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { sys_links } from '@/types/server/sys_links';

export default defineEventHandler( async (event) => {
  try{
    const text = `WITH RECURSIVE cte(id, parent, row_level, name_es, position, icon, link, comment_es, path, sort_path) AS (
          SELECT a.id, a.parent, a.row_level, a.name_es, a.position, a.icon, a.link, a.comment_es, a.name_es
          ,lpad(a.id, 4, '0')
          FROM sys_links a
          where a.parent is null
      UNION ALL
          SELECT b.id, b.parent, b.row_level, b.name_es, b.position, b.icon, b.link, b.comment_es
          ,concat(COALESCE(cte.path,'') ,' -> ', COALESCE(b.name_es,''))
          ,concat(COALESCE(cte.sort_path,'') , COALESCE(lpad(b.id, 4, '0'),''))
          from sys_links b
          inner join cte on cte.id = b.parent
      )
      select
       a.id
      ,a.parent
      ,INITCAP(a.name_es) as name_es
      ,a.row_level
      ,a.icon
      ,a.path
      ,a.comment_es
      from cte a
      order by a.id
    `;
    const data = await serverDB.query(text);
    return array(sys_links).cast(data.rows);
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});