import { z } from 'zod'

export const traselec = z.object({
  id: z.coerce.string(),
  name: z.string(),
  internal_code: z.string(),
  is_active: z.boolean().default(true),
  row_count: z.coerce.number().optional().nullable().default(0),
});
export type type_traselec = z.infer<typeof traselec>;

export const traselec_prj_master = z.object({
  project_id: z.coerce.number(),
  project_name: z.string(),
  partner_name: z.string(),
  code: z.string().optional().nullable(),
  comments: z.string().optional().nullable(),
})
export type type_traselec_prj_master = z.infer<typeof traselec_prj_master>

export const traselec_prj_master_budgets = z.object({
  project_id: z.coerce.number(),
  code: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  path: z.string().optional().nullable(),
})
export type type_traselec_prj_master_budgets = z.infer<typeof traselec_prj_master_budgets>

export const traselec_prj_master_budget_inv = z.object({
  inv_id: z.coerce.number(),
  inv_code: z.string().nullable().optional(),
  inv_name: z.string().nullable().optional(),
  inv_budget_qty: z.coerce.number(),
  inv_uom_name: z.string().optional().nullable(),
  inv_real_qty: z.coerce.number(),
})
export type type_traselec_prj_master_budget_inv = z.infer<typeof traselec_prj_master_budget_inv>

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