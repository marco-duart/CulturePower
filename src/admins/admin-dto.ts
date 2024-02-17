export interface GetAdminDTO {}

export interface CreateAdminDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateAdminDTO {
  name: string;
  email: string;
  password: string;
}

export interface ICreateAdmin {
  name: string;
  email: string;
  password: string;
}
