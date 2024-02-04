import * as yup from "yup";

export interface ICreateProduct {
  name: string;
  value: number;
  amount: number;
  description: string;
  photo: string;
}

export interface IUpdateProduct {
  productId: string,
}



export const createProductValidate: yup.Schema<ICreateProduct> = yup.object().shape({
  name: yup.string().required().min(3),
  value: yup.number().required(),
  amount: yup.number().required(),
  description: yup.string().required(),
  photo: yup.string().required(),
})

export const updateProductValidate: yup.Schema<IUpdateProduct> = yup.object().shape({
  productId: yup.string().required(),
})