import { object, string, type InferType } from 'yup';

export const login_credentials = object({
  email: string().email().required('Email es requerido.'),
  password: string().required('Clave es requerido.'),
});
export type type_login_credentials = InferType<typeof login_credentials>;