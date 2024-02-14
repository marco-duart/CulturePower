import { hash } from "bcrypt";
import { IAdmin } from "./admin-domain";
import { CreateAdminDTO, UpdateAdminDTO } from "./admin-dto";
import AdminRepository from "./admin-repository";
import UserRepository from "../users/user-repository";
import { CustomError } from "../shared/errors/CustomError";

class AdminService {
  constructor(
    private adminRepository: AdminRepository,
    private userRepository: UserRepository
  ) {}

  async create(data: CreateAdminDTO): Promise<IAdmin> {
    try {
      const adminAlreadyExists = await this.adminRepository.findByEmail(data.email);
      if (adminAlreadyExists) {
        throw new CustomError("Admin with this email already exists.", 400);
      }

      const payload = {
        ...data,
        password: await hash(data.password, 8),
      };

      const result = await this.adminRepository.create(payload);

      return result;
    } catch (error) {
      console.error("Error creating admin:", error);
      throw new CustomError("Failed to create admin.", 500);
    }
  }

  async getAll(): Promise<IAdmin[]> {
    try {
      return await this.adminRepository.findAll();
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw new CustomError("Failed to fetch admins.", 500);
    }
  }

  async getById(id: string): Promise<IAdmin | null> {
    try {
      return await this.adminRepository.findById(id);
    } catch (error) {
      console.error("Error fetching admin:", error);
      throw new CustomError("Failed to fetch admin.", 500);
    }
  }

  async update(id: string, data: UpdateAdminDTO): Promise<IAdmin | null> {
    try {
      return await this.adminRepository.update(id, data);
    } catch (error) {
      console.error("Error updating admin:", error);
      throw new CustomError("Failed to update admin.", 500);
    }
  }

  async softDelete(id: string): Promise<IAdmin | null> {
    try {
      return await this.adminRepository.softDelete(id);
    } catch (error) {
      console.error("Error soft deleting admin:", error);
      throw new CustomError("Failed to soft delete admin.", 500);
    }
  }

  async updateUserJewels(
    userId: string,
    jewelsAmount: number
  ): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new CustomError("User not found.", 404);
      }

      user.jewelsAmount += jewelsAmount;

      await this.userRepository.update(userId, {
        jewelsAmount: user.jewelsAmount,
      });

      return true;
    } catch (error) {
      console.error("Error updating user jewels:", error);
      throw new CustomError("Failed to update user jewels.", 500);
    }
  }
}

export default AdminService;
