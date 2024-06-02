import serverDB from '@/server/utils/db';
import { filter_search } from '@/types/server/filter_search';
import { filter_queries } from '@/types/server/filter_search_queries';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const filter = await readValidatedBody(event, body => filter_search.cast(body));
    const queryObject = filter_queries.find(x => x.key === filter.key);
    if (queryObject) {
      const data = await serverDB.query(queryObject.query);
      return data.rows;
    }
  } catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});