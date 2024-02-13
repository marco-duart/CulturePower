import { Admin, IAdmin } from "./admin-domain";
import { CreateAdminDTO, UpdateAdminDTO } from "./admin-dto";

class AdminRepository {
  constructor(private model: typeof Admin) {}

  async create(data: CreateAdminDTO): Promise<IAdmin> {
    return await this.model.create(data);
  }

  async findById(_id: string): Promise<IAdmin | null> {
    return await this.model.findOne({ _id, deletedAt: null }).exec();
  }

  async findAll(): Promise<IAdmin[]> {
    return await this.model.find({ deletedAt: null }).exec();
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return await this.model.findOne({ deletedAt: null, email }).exec();
  }

  async update(
    _id: string,
    data: Partial<UpdateAdminDTO>
  ): Promise<IAdmin | null> {
    return await this.model
      .findByIdAndUpdate({ _id, deletedAt: null }, { ...data }, { new: true })
      .exec();
  }

  async softDelete(_id: string): Promise<IAdmin | null> {
    return await this.model
      .findByIdAndUpdate(_id, { deletedAt: new Date() }, { new: true })
      .exec();
  }
}

export default AdminRepository;
