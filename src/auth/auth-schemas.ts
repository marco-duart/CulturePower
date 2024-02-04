import * as yup from "yup";

export interface IUserLogin {
  email: string;
  password: string;
}

export const userLoginValidate: yup.Schema<IUserLogin> = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
})