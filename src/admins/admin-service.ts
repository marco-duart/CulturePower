import { hash } from 'bcrypt';
import { IAdmin } from "./admin-domain";
import { CreateAdminDTO, UpdateAdminDTO } from "./admin-dto";
import AdminRepository from "./admin-repository";
import UserRepository from "../users/user-repository";

class AdminService {
    constructor(
        private adminRepository: AdminRepository,
        private userRepository: UserRepository
    ) {}

    async create(data: CreateAdminDTO): Promise<IAdmin> {
        const adminAlreadyExists = await this.adminRepository.findByEmail(data.email);
        if (adminAlreadyExists) {
            console.log("Tratar Erro");
        }

        const payload = {
            ...data,
            password: await hash(data.password, 8)
        };

        const result = await this.adminRepository.create(payload);

        return result;
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

    async updateUserJewels(userId: string, jewelsAmount: number): Promise<boolean> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            console.log("Usuário não encontrado");
            return false;
        }

        user.jewelsAmount += jewelsAmount;

        await this.userRepository.update(userId, { jewelsAmount: user.jewelsAmount });

        return true;
    }
}

export default AdminService;
