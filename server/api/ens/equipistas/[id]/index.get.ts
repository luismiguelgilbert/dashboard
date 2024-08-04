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
      ,to_char (a.fecha_matrimonio::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as fecha_matrimonio
      ,to_char (a.fecha_nacimiento::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as fecha_nacimiento
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
                  'birthday', to_char (int1.birthday::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
                ) ORDER BY int1.child_name desc)
            FROM ens_members_children int1
            WHERE int1.user_id = a.id
        ), '[]'::json) children

      ,COALESCE((
            SELECT json_agg(
                json_build_object(
                  'team_id', int1.team_id,
                  'fecha_pilotaje', to_char (int1.fecha_pilotaje::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
                  'fecha_alianza', to_char (int1.fecha_alianza::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
                  'fecha_salida', to_char (int1.fecha_salida::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
                  'is_active', int1.is_active
                ) ORDER BY int1.is_active desc, int1.fecha_alianza desc)
            FROM ens_members_teams int1
            WHERE int1.user_id = a.id
        ), '[]'::json) teams

      ,COALESCE((
            SELECT json_agg(
                json_build_object(
                  'id', int1.id,
                  'service_id', int1.service_id,
                  'date_start', to_char (int1.date_start::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
                  'date_stop', to_char (int1.date_stop::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
                  'is_active', int1.is_active
                ) ORDER BY int1.is_active desc, int1.date_start desc)
            FROM ens_members_services int1
            WHERE int1.user_id = a.id
        ), '[]'::json) services

      ,COALESCE((
            SELECT json_agg(
                json_build_object(
                  'id', int1.id,
                  'company_name', int1.company_name,
                  'position_name', int1.position_name,
                  'date_start', to_char (int1.date_start::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
                  'date_stop', to_char (int1.date_stop::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
                  'skills', int1.skills,
                  'places', int1.places
                ) ORDER BY int1.date_start desc)
            FROM ens_members_jobs int1
            WHERE int1.user_id = a.id
        ), '[]'::json) jobs
      from ens_members a
      inner join sys_users b on a.id = b.id
      inner join auth.users c on b.id = c.id
      inner join sys_users d on a.partner_id = d.id
      WHERE a.id = '${id}'
      `;
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