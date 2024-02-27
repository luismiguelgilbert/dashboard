import { z } from 'zod'

export enum filter_keys_enum {
  DEFAULT = 'isDefault',
  STATUS = 'status',
  SORT = 'sortBy',
  SEARCH = 'searchString',
  PAGE = 'page',
  ROWS = 'rowsPerPage',
  ID = 'id',
}

export type filter_payload = Partial<Record<filter_keys_enum, string>>;

export const filter_payload_object = z.object({
  //Required
  [filter_keys_enum.STATUS]: z.coerce.string().default('1'),
  [filter_keys_enum.SORT]: z.coerce.string().default('1'),
  [filter_keys_enum.SEARCH]: z.coerce.string().default(''),
  //Optional
  [filter_keys_enum.DEFAULT]: z.coerce.string().default('1'),
  [filter_keys_enum.ID]: z.coerce.string(),
  //Temporary
  [filter_keys_enum.PAGE] : z.coerce.string().default('1'),
  [filter_keys_enum.ROWS]: z.coerce.string().default('20'),
})