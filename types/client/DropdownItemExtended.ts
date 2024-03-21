import { type DropdownItem } from '#ui/types';

export interface DropdownItemExtended extends DropdownItem {
  id: string,
  disabled: boolean,
  isMainAction: boolean,
};