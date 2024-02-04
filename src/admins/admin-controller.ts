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
      console.error(error);
      res
        .status(500)
        .json({ error: "Erro interno do servidor ao criar administrador." });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const admin = await this.service.getById(id);

      if (admin) {
        res.status(200).json(admin);
      } else {
        res.status(404).json({ error: "Administrador não encontrado." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erro interno do servidor ao obter administrador." });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const adminArray = await this.service.getAll();

      if (adminArray) {
        res.status(200).json(adminArray);
      } else {
        res.status(404).json({ error: "Nenhum administrador encontrado." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erro interno do servidor ao obter administradores." });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const data: UpdateAdminDTO = req.body;
      const updatedAdmin = await this.service.update(id, data);

      if (updatedAdmin) {
        res.status(200).json(updatedAdmin);
      } else {
        res.status(404).json({ error: "Administrador não encontrado." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          error: "Erro interno do servidor ao atualizar administrador.",
        });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const deletedAdmin = await this.service.softDelete(id);

      if (deletedAdmin) {
        res.status(200).json(deletedAdmin);
      } else {
        res.status(404).json({ error: "Administrador não encontrado." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erro interno do servidor ao excluir administrador." });
    }
  }

  async updateUserJewels(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.userId;
      const jewelsToAdd: number = req.body.jewels;

      const success = await this.service.updateUserJewels(userId, jewelsToAdd);

      if (success) {
        res
          .status(200)
          .json({
            message: "Quantidade de jewels do usuário atualizada com sucesso.",
          });
      } else {
        res.status(404).json({ error: "Usuário não encontrado." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          error:
            "Erro interno do servidor ao atualizar a quantidade de jewels do usuário.",
        });
    }
  }
}

export default AdminController;
