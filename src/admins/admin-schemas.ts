import * as yup from "yup";

export interface ICreateAdmin {
  name: string;
  email: string;
  password: string;
}

export const createAdminValidate: yup.Schema<ICreateAdmin> = yup.object().shape({
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  password: yup.string().required(),
})