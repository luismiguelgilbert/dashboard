export type rowAction = {
  key: number,
  label?: string,
  variant?: string,
  color: string,
  icon?: string,
  click: (row: string|number) => void,
};