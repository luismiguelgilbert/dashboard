import serverDB from '@/server/utils/db';
import { array } from 'yup';
import { ens_members } from '@/types/server/ens/ens_members';

export default defineEventHandler( async (event) => {
  try{
    event.context.params = useSanitizeParams(event.context.params);
    const id = (event.context.params?.id);
    const text = `SELECT
        a.id
      ,b.user_name
      ,b.user_lastname
      ,c.email
      ,b.user_sex
      ,a.partner_id
      ,b.website
      ,b.avatar_url
      ,INITCAP(d.user_name || ' ' || d.user_lastname) as partner_full_name
      ,a.fecha_matrimonio
      ,a.fecha_nacimiento
      ,a.is_active
      ,a.es_consiliario
      ,COALESCE((
            SELECT json_agg(
                json_build_object(
                  'phone_type', int1.phone_type,
                  'phone_number', int1.phone_number
                ) ORDER BY int1.phone_type desc)
            FROM ens_members_phones int1
            WHERE int1.user_id = a.id
        ), '[]'::json) phones

      ,COALESCE((
            SELECT json_agg(
                json_build_object(
                  'email', int1.email
                ) ORDER BY int1.email desc)
            FROM ens_members_mails int1
            WHERE int1.user_id = a.id
        ), '[]'::json) emails
        
      ,COALESCE((
            SELECT json_agg(
                json_build_object(
                  'address_type', int1.address_type,
                  'address', int1.address
                ) ORDER BY int1.address_type desc)
            FROM ens_members_addresses int1
            WHERE int1.user_id = a.id
        ), '[]'::json) addresses

      ,COALESCE((
            SELECT json_agg(
                json_build_object(
                  'child_name', int1.child_name,
                  'child_sex', int1.child_sex,
                  'birthday', int1.birthday
                ) ORDER BY int1.child_name desc)
            FROM ens_members_children int1
            WHERE int1.user_id = a.id
        ), '[]'::json) children
      from ens_members a
      inner join sys_users b on a.id = b.id
      inner join auth.users c on b.id = c.id
      inner join sys_users d on a.partner_id = d.id
      WHERE a.id = '${id}'
      `;
    // ,to_char (a.created_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at
    // ,to_char (a.updated_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as updated_at
    const data = await serverDB.query(text);
    return array(ens_members).cast(data.rows);
  }catch(err) {
    console.error(`Error at ${event.path}. ${err}`);
    throw createError({
      statusCode: 500,
      statusMessage: 'Unhandled exception',
    });
  }
});