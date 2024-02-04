import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

import UserRepository from "../users/user-repository";
import AdminRepository from "../admins/admin-repository";
import { Admin } from "../admins/admin-domain";
import { AuthDTO } from "./auth-dto";
import { env } from "../configs/env";


export class AuthService {
    constructor(private userRepository: UserRepository | AdminRepository) {}

    async login(data: AuthDTO) {
        const user = await this.userRepository.findByEmail(data.email)
        if(!user) {
            console.log("Tratar erro")
            return
        }
        const password = data.password ?? ""
        const passwordIsValid = await compare(password, user.password)
        if(!passwordIsValid) {
            console.log("Tratar erro")
            return
        }

        const payload = { id: user.id, email: user.email, role: user instanceof Admin ? "admin" : "user" }
        const secretKey = env.JWT_SECRET_KEY;
        const options = { expiresIn: "5h" }

        const token = sign(payload, secretKey, options)

        return { token }
    }
}