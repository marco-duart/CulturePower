import { User, IUser } from './user-domain';
import { CreateUserDTO, UpdateUserDTO } from './user-dto';

class UserRepository {
  constructor(private model: typeof User) {}

  async create(data: CreateUserDTO): Promise<IUser> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<IUser | null> {
    return await this.model.findById(id).exec();
  }

  async findAll(): Promise<IUser[]> {
    return await this.model.find({ deletedAt: null }).exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).exec();
  }

  async update(id: string, data: Partial<UpdateUserDTO>): Promise<IUser | null> {
    return await this.model.findByIdAndUpdate(id, { ...data }, { new: true }).exec();
  }

  async softDelete(id: string): Promise<IUser | null> {
    return await this.model.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true }).exec();
  }
}

export default UserRepository;