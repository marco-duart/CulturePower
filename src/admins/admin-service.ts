import { hash } from 'bcrypt';
import { IAdmin } from "./admin-domain";
import { CreateAdminDTO, UpdateAdminDTO } from "./admin-dto";
import AdminRepository from "./admin-repository";


class AdminService {
    constructor(private repository: AdminRepository) {}
  
    async create(data: CreateAdminDTO): Promise<IAdmin> {
      const adminAlreadyExists = await this.repository.findByEmail(data.email)
      if(adminAlreadyExists) {
        console.log("Tratar Erro")
      }
  
      const payload = {
        ...data,
        password: await hash(data.password, 8)
      }
  
      const result = await this.repository.create(payload);
  
      return result
    }
  
    async getAll(): Promise<IAdmin[]> {
      return await this.repository.findAll()
    }
  
    async getById(id: string): Promise<IAdmin | null> {
      return await this.repository.findById(id);
    }
  
    async update(id: string, data: UpdateAdminDTO): Promise<IAdmin | null> {
      return await this.repository.update(id, data)
    }
  
    async softDelete(id: string): Promise<IAdmin | null> {
      return await this.repository.softDelete(id)
    }
  
  }
  
  export default AdminService;
  