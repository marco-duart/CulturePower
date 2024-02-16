import { hash } from "bcrypt";
import { IAdmin } from "./admin-domain";
import { CreateAdminDTO, UpdateAdminDTO } from "./admin-dto";
import AdminRepository from "./admin-repository";
import UserRepository from "../users/user-repository";
import { CustomError } from "../shared/error/CustomError";
import { ERROR_LOG } from "../utils/enums/errorMessage";
import { STATUS_CODE } from "../utils/enums/statusCode";

class AdminService {
  constructor(
    private adminRepository: AdminRepository,
    private userRepository: UserRepository
  ) {}

  async create(data: CreateAdminDTO): Promise<IAdmin> {
    const adminAlreadyExists = await this.adminRepository.findByEmail(data.email);
    if (adminAlreadyExists) {
      console.log(ERROR_LOG.ADM_EXISTS);
      throw new CustomError(ERROR_LOG.ADM_EXISTS, STATUS_CODE.BAD_REQUEST);
    }

    const payload = {
      ...data,
      password: await hash(data.password, 8),
    };

    return await this.adminRepository.create(payload);
  }

  async getAll(): Promise<IAdmin[]> {
    return await this.adminRepository.findAll();
  }

  async getById(id: string): Promise<IAdmin | null> {
    return await this.adminRepository.findById(id);
  }

  async update(id: string, data: UpdateAdminDTO): Promise<IAdmin | null> {
    return await this.adminRepository.update(id, data);
  }

  async softDelete(id: string): Promise<IAdmin | null> {
    return await this.adminRepository.softDelete(id);
  }

  async updateUserJewels(
    userId: string,
    jewelsAmount: number
  ): Promise<boolean> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      console.log(ERROR_LOG.USER_NOT_FOUND)
      throw new CustomError(ERROR_LOG.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    user.jewelsAmount += jewelsAmount;

    await this.userRepository.update(userId, {
      jewelsAmount: user.jewelsAmount,
    });

    return true;
  }
}

export default AdminService;
