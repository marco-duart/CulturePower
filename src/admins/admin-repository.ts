import { Admin, IAdmin } from './admin-domain';
import { CreateAdminDTO, UpdateAdminDTO } from './admin-dto';

class AdminRepository {
  constructor(private model: typeof Admin) {}

  async create(data: CreateAdminDTO): Promise<IAdmin> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<IAdmin | null> {
    return await this.model.findById(id).exec();
  }

  async findAll(): Promise<IAdmin[]> {
    return await await this.model.find({ deletedAt: null }).exec();
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return await this.model.findOne({ email }).exec();
  }

  async update(id: string, data: Partial<UpdateAdminDTO>): Promise<IAdmin | null> {
    return await this.model.findByIdAndUpdate(id, { ...data }, { new: true }).exec();
  }

  async softDelete(id: string): Promise<IAdmin | null> {
    return await this.model.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true }).exec();
  }
}

export default AdminRepository;