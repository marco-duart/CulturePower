import { Request, Response } from "express";
import { AuthService } from "./auth-service";
import { AuthDTO } from "./auth-dto";

export class AuthController {
  constructor(private service: AuthService) {}

  async login(req: Request, res: Response) {
    try {
      const data: AuthDTO = req.body;

      const result = await this.service.login(data);
      return res.status(200).json(result);
    } catch (error) {
        console.log("Tratar error")
        return
    }
  }
}
