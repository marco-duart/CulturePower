import { hash } from 'bcrypt';
import { IUser } from "./user-domain";
import { CreateUserDTO, UpdateUserDTO } from "./user-dto";
import UserRepository from "./user-repository";


class UserService {
    constructor(private repository: UserRepository) {}
  
    async create(data: CreateUserDTO): Promise<IUser> {
      const userAlreadyExists = await this.repository.findByEmail(data.email)
      if(userAlreadyExists) {
        console.log("Tratar Erro")
      }
  
      const payload = {
        ...data,
        password: await hash(data.password, 8)
      }
  
      const result = await this.repository.create(payload);
  
      return result
    }
  
    async getAll(): Promise<IUser[]> {
      return await this.repository.findAll()
    }
  
    async getById(id: string): Promise<IUser | null> {
      return await this.repository.findById(id);
    }
  
    async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
      return await this.repository.update(id, data)
    }
  
    async softDelete(id: string): Promise<IUser | null> {
      return await this.repository.softDelete(id)
    }
  
  }
  
  export default UserService;
  