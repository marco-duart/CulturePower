export interface GetUserDTO {
  
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  photo: string
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
