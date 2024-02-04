import * as yup from "yup";

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  photo: string
}

export interface IUpdateUserJewels {
  id: string,
  jewelsAmount: number;
}

export interface IUpdateUserProducts {
  productId: string,
}

export interface IUpdateUserFavoriteProducts {
  productId: string,
}



export const createUserValidate: yup.Schema<ICreateUser> = yup.object().shape({
  name: yup.string().required().min(3),
  email: yup.string().required().email(),
  password: yup.string().required(),
  photo: yup.string().required(),
})

export const updateUserJewelsValidate: yup.Schema<IUpdateUserJewels> = yup.object().shape({
  id: yup.string().required(),
  jewelsAmount: yup.number().required(),
})