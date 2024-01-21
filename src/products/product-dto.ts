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
