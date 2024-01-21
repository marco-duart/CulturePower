import { User, IUser } from './user-domain';
import { CreateUserDTO, UpdateUserDTO } from './user-dto';

class UserRepository {
  constructor(private model: typeof User) {}

  async create(data: CreateUserDTO): Promise<IUser> {
    const createdUser = await this.model.create(data);
    if (!createdUser) {
      console.log("Tratar Erro")
    }
    return createdUser;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await this.model.findById(id).exec();
    if (!user) {
      console.log("Tratar Erro")
    }
    return user;
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.model.find({ deletedAt: null }).exec();
    if (!users || users.length === 0) {
      console.log("Tratar Erro")
    }
    return users;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.model.findOne({ email }).exec();
    if (!user) {
      console.log("Tratar Erro")
    }
    return user;
  }

  async update(id: string, data: Partial<UpdateUserDTO>): Promise<IUser | null> {
    const updatedUser = await this.model.findByIdAndUpdate(id, { ...data }, { new: true }).exec();
    if (!updatedUser) {
      console.log("Tratar Erro")
    }
    return updatedUser;
  }

  async softDelete(id: string): Promise<IUser | null> {
    const deletedUser = await this.model.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true }).exec();
    if (!deletedUser) {
      console.log("Tratar Erro")
    }
    return deletedUser
  }
}

export default UserRepository;