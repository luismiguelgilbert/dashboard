export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      acc_accounts: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name_es: string
          parent: string | null
          sys_company_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_es: string
          parent?: string | null
          sys_company_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name_es?: string
          parent?: string | null
          sys_company_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'acc_accounts_sys_company_id_fkey'
            columns: ['sys_company_id']
            isOneToOne: false
            referencedRelation: 'sys_companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'acc_accounts_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
      ens_books: {
        Row: {
          comment_es: string
          created_at: string
          fts: unknown | null
          id: string
          is_active: boolean
          name_es: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          comment_es?: string
          created_at?: string
          fts?: unknown | null
          id?: string
          is_active?: boolean
          name_es: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          comment_es?: string
          created_at?: string
          fts?: unknown | null
          id?: string
          is_active?: boolean
          name_es?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ens_books_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
      ens_members: {
        Row: {
          created_at: string
          es_consiliario: boolean
          fecha_matrimonio: string | null
          fecha_nacimiento: string | null
          id: string
          is_active: boolean
          old_persona_id: number | null
          old_related_id: string | null
          old_sys_user_code: number | null
          partner_id: string | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          es_consiliario?: boolean
          fecha_matrimonio?: string | null
          fecha_nacimiento?: string | null
          id: string
          is_active?: boolean
          old_persona_id?: number | null
          old_related_id?: string | null
          old_sys_user_code?: number | null
          partner_id?: string | null
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          es_consiliario?: boolean
          fecha_matrimonio?: string | null
          fecha_nacimiento?: string | null
          id?: string
          is_active?: boolean
          old_persona_id?: number | null
          old_related_id?: string | null
          old_sys_user_code?: number | null
          partner_id?: string | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_ens_members_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_ens_members_partner_id_fkey'
            columns: ['partner_id']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
      ens_members_phones: {
        Row: {
          created_at: string
          id: string
          phone_number: string
          phone_type: number
          updated_by: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          phone_number: string
          phone_type: number
          updated_by: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          phone_number?: string
          phone_type?: number
          updated_by?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ens_members_phones_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ens_members_phones_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
      ens_members_services: {
        Row: {
          date_start: string | null
          date_stop: string | null
          id: string
          service_id: string
          user_id: string
        }
        Insert: {
          date_start?: string | null
          date_stop?: string | null
          id?: string
          service_id: string
          user_id: string
        }
        Update: {
          date_start?: string | null
          date_stop?: string | null
          id?: string
          service_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ens_members_services_service_id_fkey'
            columns: ['service_id']
            isOneToOne: false
            referencedRelation: 'ens_services'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ens_members_services_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'ens_members'
            referencedColumns: ['id']
          },
        ]
      }
      ens_members_teams: {
        Row: {
          fecha_alianza: string | null
          fecha_pilotaje: string | null
          fecha_salida: string | null
          id: string
          team_id: string
          user_id: string
        }
        Insert: {
          fecha_alianza?: string | null
          fecha_pilotaje?: string | null
          fecha_salida?: string | null
          id?: string
          team_id: string
          user_id: string
        }
        Update: {
          fecha_alianza?: string | null
          fecha_pilotaje?: string | null
          fecha_salida?: string | null
          id?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ens_members_teams_team_id_fkey'
            columns: ['team_id']
            isOneToOne: false
            referencedRelation: 'ens_teams'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ens_members_teams_team_id_fkey1'
            columns: ['team_id']
            isOneToOne: false
            referencedRelation: 'ens_teams'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ens_members_teams_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ens_members_teams_user_id_fkey1'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'ens_members'
            referencedColumns: ['id']
          },
        ]
      }
      ens_services: {
        Row: {
          created_at: string
          fts: unknown | null
          id: string
          is_active: boolean
          name_es: string
        }
        Insert: {
          created_at?: string
          fts?: unknown | null
          id?: string
          is_active?: boolean
          name_es: string
        }
        Update: {
          created_at?: string
          fts?: unknown | null
          id?: string
          is_active?: boolean
          name_es?: string
        }
        Relationships: []
      }
      ens_teams: {
        Row: {
          created_at: string
          fts: unknown | null
          id: string
          is_active: boolean
          name_es: string
          nivel_0: string | null
          nivel_1: string | null
          nivel_2: string | null
          nivel_3: string | null
          nivel_4: string | null
          nivel_5: string | null
          nivel_6: string | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          fts?: unknown | null
          id?: string
          is_active?: boolean
          name_es: string
          nivel_0?: string | null
          nivel_1?: string | null
          nivel_2?: string | null
          nivel_3?: string | null
          nivel_4?: string | null
          nivel_5?: string | null
          nivel_6?: string | null
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          fts?: unknown | null
          id?: string
          is_active?: boolean
          name_es?: string
          nivel_0?: string | null
          nivel_1?: string | null
          nivel_2?: string | null
          nivel_3?: string | null
          nivel_4?: string | null
          nivel_5?: string | null
          nivel_6?: string | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_ens_teams_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
      ens_temp_data: {
        Row: {
          birthday: string | null
          es_consiliario: string | null
          estado: number | null
          fecha_matrimonio: string | null
          id_or_email: string | null
          old_persona_id: string | null
          related_persona_id: string | null
          sexo: number | null
          sys_profile_id: number | null
          sys_profile_id_new_system: number | null
          sys_profile_name: string | null
          sys_user_code: number | null
          sys_user_id_new: string | null
          user_lastname: string | null
          user_name: string | null
        }
        Insert: {
          birthday?: string | null
          es_consiliario?: string | null
          estado?: number | null
          fecha_matrimonio?: string | null
          id_or_email?: string | null
          old_persona_id?: string | null
          related_persona_id?: string | null
          sexo?: number | null
          sys_profile_id?: number | null
          sys_profile_id_new_system?: number | null
          sys_profile_name?: string | null
          sys_user_code?: number | null
          sys_user_id_new?: string | null
          user_lastname?: string | null
          user_name?: string | null
        }
        Update: {
          birthday?: string | null
          es_consiliario?: string | null
          estado?: number | null
          fecha_matrimonio?: string | null
          id_or_email?: string | null
          old_persona_id?: string | null
          related_persona_id?: string | null
          sexo?: number | null
          sys_profile_id?: number | null
          sys_profile_id_new_system?: number | null
          sys_profile_name?: string | null
          sys_user_code?: number | null
          sys_user_id_new?: string | null
          user_lastname?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      inv_brands: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name_es: string
          sys_company_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_es: string
          sys_company_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_es?: string
          sys_company_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inv_brands_sys_company_id_fkey'
            columns: ['sys_company_id']
            isOneToOne: false
            referencedRelation: 'sys_companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inv_brands_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
      inv_groups: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name_es: string
          sys_company_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_es: string
          sys_company_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_es?: string
          sys_company_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inv_groups_sys_company_id_fkey'
            columns: ['sys_company_id']
            isOneToOne: false
            referencedRelation: 'sys_companies'
            referencedColumns: ['id']
          },
        ]
      }
      inv_master: {
        Row: {
          created_at: string
          id: string
          internal_code: string | null
          inv_brand_id: string
          inv_group_id: string
          inv_type_id: string
          inv_uom_id: string
          is_active: boolean
          is_purchase: boolean
          is_sale: boolean
          name_es: string
          sys_company_id: string
          sys_inv_type_id: number
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          internal_code?: string | null
          inv_brand_id: string
          inv_group_id: string
          inv_type_id: string
          inv_uom_id: string
          is_active?: boolean
          is_purchase?: boolean
          is_sale?: boolean
          name_es: string
          sys_company_id: string
          sys_inv_type_id: number
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          id?: string
          internal_code?: string | null
          inv_brand_id?: string
          inv_group_id?: string
          inv_type_id?: string
          inv_uom_id?: string
          is_active?: boolean
          is_purchase?: boolean
          is_sale?: boolean
          name_es?: string
          sys_company_id?: string
          sys_inv_type_id?: number
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inv_master_inv_brand_id_fkey'
            columns: ['inv_brand_id']
            isOneToOne: false
            referencedRelation: 'inv_brands'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inv_master_inv_group_id_fkey'
            columns: ['inv_group_id']
            isOneToOne: false
            referencedRelation: 'inv_groups'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inv_master_inv_type_id_fkey'
            columns: ['inv_type_id']
            isOneToOne: false
            referencedRelation: 'inv_types'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inv_master_inv_uom_id_fkey'
            columns: ['inv_uom_id']
            isOneToOne: false
            referencedRelation: 'inv_uom'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inv_master_sys_company_id_fkey'
            columns: ['sys_company_id']
            isOneToOne: false
            referencedRelation: 'sys_companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inv_master_sys_inv_type_id_fkey'
            columns: ['sys_inv_type_id']
            isOneToOne: false
            referencedRelation: 'sys_inv_types'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inv_master_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
      inv_types: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name_es: string
          parent: string | null
          sys_company_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_es: string
          parent?: string | null
          sys_company_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_es?: string
          parent?: string | null
          sys_company_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inv_types_sys_company_id_fkey'
            columns: ['sys_company_id']
            isOneToOne: false
            referencedRelation: 'sys_companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inv_types_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
      inv_uom: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name_es: string
          name_es_short: string
          sys_company_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_es: string
          name_es_short: string
          sys_company_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_es?: string
          name_es_short?: string
          sys_company_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inv_uom_sys_company_id_fkey'
            columns: ['sys_company_id']
            isOneToOne: false
            referencedRelation: 'sys_companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'inv_uom_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
      sys_companies: {
        Row: {
          avatar_url: string | null
          billing_address: string | null
          billing_phone: string | null
          company_number: string
          created_at: string
          fts: unknown | null
          id: string
          is_active: boolean
          name_es: string
          name_es_short: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: string | null
          billing_phone?: string | null
          company_number: string
          created_at?: string
          fts?: unknown | null
          id?: string
          is_active?: boolean
          name_es: string
          name_es_short: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          avatar_url?: string | null
          billing_address?: string | null
          billing_phone?: string | null
          company_number?: string
          created_at?: string
          fts?: unknown | null
          id?: string
          is_active?: boolean
          name_es?: string
          name_es_short?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      sys_companies_users: {
        Row: {
          created_at: string
          is_default: boolean
          sys_company_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          is_default?: boolean
          sys_company_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          is_default?: boolean
          sys_company_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'sys_companies_users_sys_company_id_fkey'
            columns: ['sys_company_id']
            isOneToOne: false
            referencedRelation: 'sys_companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sys_companies_users_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
      sys_inv_types: {
        Row: {
          id: number
          name_es: string
        }
        Insert: {
          id: number
          name_es: string
        }
        Update: {
          id?: number
          name_es?: string
        }
        Relationships: []
      }
      sys_links: {
        Row: {
          comment_es: string | null
          created_at: string
          icon: string
          id: string
          link: string
          name_es: string
          parent: string | null
          position: number
          requires_company: boolean
          row_level: number | null
          updated_at: string
        }
        Insert: {
          comment_es?: string | null
          created_at?: string
          icon: string
          id: string
          link: string
          name_es: string
          parent?: string | null
          position: number
          requires_company?: boolean
          row_level?: number | null
          updated_at?: string
        }
        Update: {
          comment_es?: string | null
          created_at?: string
          icon?: string
          id?: string
          link?: string
          name_es?: string
          parent?: string | null
          position?: number
          requires_company?: boolean
          row_level?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      sys_profiles: {
        Row: {
          created_at: string
          fts: unknown | null
          id: number
          is_active: boolean
          name_es: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          fts?: unknown | null
          id?: number
          is_active?: boolean
          name_es: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          fts?: unknown | null
          id?: number
          is_active?: boolean
          name_es?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: 'sys_profiles_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
      sys_profiles_links: {
        Row: {
          created_at: string | null
          sys_link_id: string
          sys_profile_id: number
        }
        Insert: {
          created_at?: string | null
          sys_link_id: string
          sys_profile_id: number
        }
        Update: {
          created_at?: string | null
          sys_link_id?: string
          sys_profile_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'public_sys_profiles_links_sys_link_id_fkey'
            columns: ['sys_link_id']
            isOneToOne: false
            referencedRelation: 'sys_links'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_sys_profiles_links_sys_profile_id_fkey'
            columns: ['sys_profile_id']
            isOneToOne: false
            referencedRelation: 'sys_profiles'
            referencedColumns: ['id']
          },
        ]
      }
      sys_users: {
        Row: {
          avatar_url: string | null
          dark_enabled: boolean | null
          default_color: string | null
          default_dark_color: string | null
          fts: unknown | null
          id: string
          sys_profile_id: number
          updated_at: string | null
          updated_by: string
          user_lastname: string
          user_name: string
          user_sex: boolean
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          dark_enabled?: boolean | null
          default_color?: string | null
          default_dark_color?: string | null
          fts?: unknown | null
          id: string
          sys_profile_id: number
          updated_at?: string | null
          updated_by: string
          user_lastname: string
          user_name: string
          user_sex?: boolean
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          dark_enabled?: boolean | null
          default_color?: string | null
          default_dark_color?: string | null
          fts?: unknown | null
          id?: string
          sys_profile_id?: number
          updated_at?: string | null
          updated_by?: string
          user_lastname?: string
          user_name?: string
          user_sex?: boolean
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'sys_users_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sys_users_sys_profile_id_fkey'
            columns: ['sys_profile_id']
            isOneToOne: false
            referencedRelation: 'sys_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sys_users_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'sys_users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
