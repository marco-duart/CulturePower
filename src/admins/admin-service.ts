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
    try {
      const adminAlreadyExists = await this.adminRepository.findByEmail(data.email);
      if (adminAlreadyExists) {
        console.log(ERROR_LOG.ADM_EXISTS);
        throw new CustomError(ERROR_LOG.ADM_EXISTS, STATUS_CODE.BAD_REQUEST);
      }

      const payload = {
        ...data,
        password: await hash(data.password, 8),
      };

      const result = await this.adminRepository.create(payload);

      return result;
    } catch (error) {
      console.error(ERROR_LOG.CREATE_ADM, error);
      throw new CustomError(ERROR_LOG.CREATE_ADM, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async getAll(): Promise<IAdmin[]> {
    try {
      return await this.adminRepository.findAll();
    } catch (error) {
      console.error(ERROR_LOG.FETCH_ADMS, error);
      throw new CustomError(ERROR_LOG.FETCH_ADMS, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async getById(id: string): Promise<IAdmin | null> {
    try {
      return await this.adminRepository.findById(id);
    } catch (error) {
      console.error(ERROR_LOG.FETCH_ADM, error);
      throw new CustomError(ERROR_LOG.FETCH_ADM, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, data: UpdateAdminDTO): Promise<IAdmin | null> {
    try {
      return await this.adminRepository.update(id, data);
    } catch (error) {
      console.error(ERROR_LOG.UPDATE_ADM, error);
      throw new CustomError(ERROR_LOG.UPDATE_ADM, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async softDelete(id: string): Promise<IAdmin | null> {
    try {
      return await this.adminRepository.softDelete(id);
    } catch (error) {
      console.error(ERROR_LOG.DELETE_ADM, error);
      throw new CustomError(ERROR_LOG.DELETE_ADM, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserJewels(
    userId: string,
    jewelsAmount: number
  ): Promise<boolean> {
    try {
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
    } catch (error) {
      console.error(ERROR_LOG.UPDATE_JEWELS, error);
      throw new CustomError(ERROR_LOG.UPDATE_JEWELS, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }
}

export default AdminService;
