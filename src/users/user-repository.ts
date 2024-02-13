import { User, IUser } from "./user-domain";
import { CreateUserDTO, UpdateUserDTO } from "./user-dto";

class UserRepository {
  constructor(private model: typeof User) {}

  async create(data: CreateUserDTO): Promise<IUser> {
    return await this.model.create(data);
  }

  async findById(_id: string): Promise<IUser | null> {
    return await this.model.findOne({ _id, deletedAt: null }).exec();
  }

  async findAll(): Promise<IUser[]> {
    return await this.model.find({ deletedAt: null }).exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ deletedAt: null, email }).exec();
  }

  async update(
    _id: string,
    data: Partial<UpdateUserDTO>
  ): Promise<IUser | null> {
    return await this.model
      .findByIdAndUpdate({ _id, deletedAt: null }, data, { new: true })
      .exec();
  }

  async softDelete(_id: string): Promise<IUser | null> {
    return await this.model
      .findByIdAndUpdate(
        _id,
        { deletedAt: new Date(), photo: null },
        { new: true }
      )
      .exec();
  }
}

export default UserRepository;
