export interface GetProductDTO {}

export interface CreateProductDTO {
  name: string;
  value: number;
  amount: number;
  description: string;
  photo: string;
}

export interface UpdateProductDTO {
  name: string;
  value: number;
  amount: number;
  description: string;
  photo: string;
}

export interface IProduct {
  _id: string;
  name: string;
  value: number;
  amount: number;
  description: string;
  photo: string;
}

export interface ICreateProduct {
  name: string;
  value: string;
  amount: string;
  description: string;
}

export interface IUpdateProduct {
  productId: string;
}