export interface GetUserDTO {}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  photo: string;
}

export interface UpdateUserDTO {
  name: string;
  email: string;
  password: string;
  jewelsAmount: number;
  products: string[];
  favoriteProducts: string[];
  photo: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export interface IUpdateUserJewels {
  id: string;
  jewelsAmount: number;
}

export interface IUpdateUserProducts {
  productId: string;
}

export interface IUpdateUserFavoriteProducts {
  productId: string;
}
