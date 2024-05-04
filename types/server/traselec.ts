import { object, string, boolean, number, date, type InferType } from 'yup';

export const traselec = object({
  id: string(),
  name: string(),
  internal_code: string(),
  is_active: boolean().default(true),
  row_count: number().optional().nullable().default(0),
});
export type type_traselec = InferType<typeof traselec>;

export const traselec_prj_master = object({
  project_id: number(),
  project_name: string(),
  partner_name: string(),
  code: string().optional().nullable(),
  comments: string().optional().nullable(),
})
export type type_traselec_prj_master = InferType<typeof traselec_prj_master>

export const traselec_prj_master_budgets = object({
  project_id: number(),
  code: string().nullable().optional(),
  name: string().nullable().optional(),
  path: string().optional().nullable(),
})
export type type_traselec_prj_master_budgets = InferType<typeof traselec_prj_master_budgets>

export const traselec_prj_master_budget_inv = object({
  inv_id: number(),
  inv_code: string().nullable().optional(),
  inv_name: string().nullable().optional(),
  inv_budget_qty: number(),
  inv_uom_name: string().optional().nullable(),
  inv_real_qty: number(),
})
export type type_traselec_prj_master_budget_inv = InferType<typeof traselec_prj_master_budget_inv>

export const status_options = [
  { label: 'Items Activos', value: 1, sqlValue: 1, icon: 'i-heroicons-funnel' },
  { label: 'Items Inactivos', value: 2, sqlValue: 0, icon: 'i-heroicons-funnel' },
  { label: 'Todos los Items', value: 3, sqlValue: 'a.estado', icon: 'i-heroicons-funnel' },
]

export const sort_options = [
  { label: 'Ordenar por Nombre', value: 1, sqlValue: 'b.name', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Ordenar por Cod int', value: 2, sqlValue: 'a.internal_code', icon: 'i-heroicons-bars-arrow-down' },
  { label: 'Ordenar por Código', value: 3, sqlValue: 'a.Inventory_ID', icon: 'i-heroicons-bars-arrow-down' }
]