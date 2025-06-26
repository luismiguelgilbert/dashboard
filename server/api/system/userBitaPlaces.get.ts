import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);
    const bitaPlacesCookie = getCookie(event, 'nuxt-session-bitaplaces');
    const { userPlaces } = session_bitaplaces_schema.parse(jwt.verify(bitaPlacesCookie ?? '', process.env.NUXT_SESSION_PASSWORD!));

    if (!user || !bitaPlacesCookie || !userPlaces) {
      return bitacora_places_schema.array().parse([]);
    }

    const serverDB = useDatabase();
    const query = await serverDB.sql`
      select
      b.*
      , NOT(b.is_active) as disabled
      from bita_places_users a
      inner join bita_places b on a.place_id = b.id
      where a.user_id = ${user.userId}
    `;

    const queryResult = bitacora_places_schema.array().parse(query.rows);
    const allowedPlaces: bitacora_places[] = [];
    if (query.rows) {
      queryResult?.forEach((row: bitacora_places) => {
        if (userPlaces.includes(row.id)) {
          allowedPlaces.push(row);
        }
      });
    }

    return bitacora_places_schema.array().parse(allowedPlaces);
  } catch (err) {
    console.error(`Error at ${event.method} ${event.path}.`, err);
    throw createError({
      statusCode: 500,
      statusMessage: typeof err === 'object' && err !== null && 'message' in err
        ? (err as { message?: string }).message ?? `Unhandled exception getting companies`
        : `Unhandled exception getting companies`,
    });
  }
});
