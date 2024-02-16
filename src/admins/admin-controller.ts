import { Request, Response } from "express";
import AdminService from "./admin-service";
import { UpdateAdminDTO, CreateAdminDTO } from "./admin-dto";
import { CustomError } from "../shared/error/CustomError";
import { STATUS_CODE } from "../utils/enums/statusCode";
import { ERROR_LOG } from "../utils/enums/errorMessage";

class AdminController {
  constructor(private service: AdminService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateAdminDTO = req.body;
      const createdAdmin = await this.service.create(data);
      res.status(STATUS_CODE.CREATED).json(createdAdmin);
    } catch (error) {
      console.error(ERROR_LOG.CREATE_ADM, error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const admin = await this.service.getById(id);

      if (admin) {
        res.status(STATUS_CODE.OK).json(admin);
      } else {
        console.log(ERROR_LOG.ADM_NOT_FOUND);
        throw new CustomError(ERROR_LOG.ADM_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
    } catch (error) {
      console.error(ERROR_LOG.FETCH_ADM, error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const adminArray = await this.service.getAll();
      res.status(STATUS_CODE.OK).json(adminArray);
    } catch (error) {
      console.error(ERROR_LOG.FETCH_ADMS, error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const data: UpdateAdminDTO = req.body;
      const updatedAdmin = await this.service.update(id, data);

      if (updatedAdmin) {
        res.status(STATUS_CODE.OK).json(updatedAdmin);
      } else {
        console.log(ERROR_LOG.ADM_NOT_FOUND);
        throw new CustomError(ERROR_LOG.ADM_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
    } catch (error) {
      console.error(ERROR_LOG.UPDATE_ADM, error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const deletedAdmin = await this.service.softDelete(id);

      if (deletedAdmin) {
        res.status(STATUS_CODE.OK).json(deletedAdmin);
      } else {
        console.log(ERROR_LOG.ADM_NOT_FOUND);
        throw new CustomError(ERROR_LOG.ADM_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
    } catch (error) {
      console.error(ERROR_LOG.DELETE_ADM, error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
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
        res.status(STATUS_CODE.OK).json({
          message: "User jewels quantity updated successfully.",
        });
      } else {
        console.log(ERROR_LOG.USER_NOT_FOUND);
        throw new CustomError(ERROR_LOG.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
    } catch (error) {
      console.error(ERROR_LOG.UPDATE_JEWELS, error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.INTERNAL_SERVER_ERROR,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }
}

export default AdminController;
