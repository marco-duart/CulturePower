import { Request, Response } from "express";
import AdminService from "./admin-service";
import { UpdateAdminDTO, CreateAdminDTO } from "./admin-dto";

class AdminController {
  constructor(private service: AdminService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateAdminDTO = req.body;
      const createdAdmin = await this.service.create(data);
      res.status(201).json(createdAdmin);
    } catch (error) {
      console.log("Tratar Erro")
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const admin = await this.service.getById(id);

      if (admin) {
        res.status(201).json(admin);
      } else {
        console.log("Tratar Erro")
      }
    } catch (error) {
      console.log("Tratar Erro")
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const adminArray = await this.service.getAll();

      if (adminArray) {
        res.status(201).json(adminArray);
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
      const data: UpdateAdminDTO = req.body;
      const updatedAdmin = await this.service.update(id, data);

      if (updatedAdmin) {
        res.status(201).json(updatedAdmin);
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
      const deletedAdmin = await this.service.softDelete(id);

      if (deletedAdmin) {
        res.status(200).json(deletedAdmin);
      } else {
        console.log("Tratar Erro")
      }
    } catch (error) {
      console.log(error);
      console.log("Tratar Erro")
    }
  }
}

export default AdminController;
