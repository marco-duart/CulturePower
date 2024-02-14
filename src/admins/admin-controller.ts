import { Request, Response } from "express";
import AdminService from "./admin-service";
import { UpdateAdminDTO, CreateAdminDTO } from "./admin-dto";
import { CustomError } from "../shared/errors/CustomError";
import { StatusCode } from "../utils/enums/statusCode";

class AdminController {
  constructor(private service: AdminService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateAdminDTO = req.body;
      const createdAdmin = await this.service.create(data);
      res.status(201).json(createdAdmin);
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: "Internal server error",
        code: StatusCode.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const admin = await this.service.getById(id);

      if (admin) {
        res.status(200).json(admin);
      } else {
        throw new CustomError("Admin not found", StatusCode.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error fetching admin by ID:", error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: "Internal server error",
          code: StatusCode.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const adminArray = await this.service.getAll();
      res.status(200).json(adminArray);
    } catch (error) {
      console.error("Error fetching all admins:", error);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: "Internal server error",
        code: StatusCode.INTERNAL_SERVER_ERROR
      });
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
        throw new CustomError("Admin not found", StatusCode.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: "Internal server error",
          code: StatusCode.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const deletedAdmin = await this.service.softDelete(id);

      if (deletedAdmin) {
        res.status(200).json(deletedAdmin);
      } else {
        throw new CustomError("Admin not found", StatusCode.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: "Internal server error",
          code: StatusCode.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async updateUserJewels(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.userId;
      const jewelsToAdd: number = req.body.jewels;

      const success = await this.service.updateUserJewels(userId, jewelsToAdd);

      if (success) {
        res.status(200).json({
          message: "User jewels quantity updated successfully.",
        });
      } else {
        throw new CustomError("User not found", StatusCode.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error updating user jewels:", error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: "Internal server error",
          code: StatusCode.INTERNAL_SERVER_ERROR
        });
      }
    }
  }
}

export default AdminController;
