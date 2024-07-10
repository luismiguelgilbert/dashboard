import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { ens_libros } from '@/types/server/ens/ens_libros';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = (event.context.params?.id);
    const text = `SELECT 
       a.id
      ,a.name_es
      ,a.is_active
      ,a.comment_es
      from ens_books a
      WHERE a.id = '${id}'
      `;
    const data = await serverDB.query(text);
    return array(ens_libros).cast(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});