import { Request, Response } from "express";
import UserService from "./user-service";
import { UpdateUserDTO, CreateUserDTO } from "./user-dto";

class UserController {
  constructor(private service: UserService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateUserDTO = req.body;
      const createdUser = await this.service.create(data);
      res.status(201).json(createdUser);
    } catch (error) {
      console.log("Tratar Erro")
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const user = await this.service.getById(id);

      if (user) {
        res.status(201).json(user);
      } else {
        console.log("Tratar Erro")
      }
    } catch (error) {
      console.log("Tratar Erro")
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userArray = await this.service.getAll();

      if (userArray) {
        res.status(201).json(userArray);
      } else {
        console.log("Tratar Erro")
      }
    } catch (error) {
      console.log("Tratar Erro")
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const data: UpdateUserDTO = req.body;
      const updatedUser = await this.service.update(id, data);

      if (updatedUser) {
        res.status(201).json(updatedUser);
      } else {
        console.log("Tratar Erro")
      }
    } catch (error) {
      console.log("Tratar Erro")
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const deletedUser = await this.service.softDelete(id);

      if (deletedUser) {
        res.status(200).json(deletedUser);
      } else {
        console.log("Tratar Erro")
      }
    } catch (error) {
      console.log(error);
      console.log("Tratar Erro")
    }
  }
}

export default UserController;
