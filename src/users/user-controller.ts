import { Request, Response } from "express";
import UserService from "./user-service";
import { UpdateUserDTO, CreateUserDTO } from "./user-dto";
import { CustomError } from "../shared/error/CustomError";
import { STATUS_CODE } from "../utils/enums/statusCode";
import { ERROR_LOG } from "../utils/enums/errorMessage";
import { decodeJwt } from "../utils/jwt-utils";

class UserController {
  constructor(private service: UserService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateUserDTO = req.body;
      const photoPath = req.file?.path;

      if (photoPath) {
        const fileName = photoPath.split("\\").pop();
        data.photo = `${req.protocol}://${req.get("host")}/${fileName}`;
      }

      const createdUser = await this.service.create(data);
      res.status(STATUS_CODE.CREATED).json(createdUser);
    } catch (error) {
      console.error(ERROR_LOG.CREATE_USER, error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: ERROR_LOG.INTERNAL_SERVER_ERROR,
        code: STATUS_CODE.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const user = await this.service.getById(id);

      if (user) {
        res.status(STATUS_CODE.OK).json(user);
      } else {
        console.log(ERROR_LOG.USER_NOT_FOUND)
        throw new CustomError(ERROR_LOG.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
    } catch (error) {
      console.error(ERROR_LOG.FETCH_USERS, error);
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
      const userArray = await this.service.getAll();
      res.status(STATUS_CODE.OK).json(userArray);
    } catch (error) {
      console.error(ERROR_LOG.FETCH_USERS, error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: ERROR_LOG.INTERNAL_SERVER_ERROR,
        code: STATUS_CODE.INTERNAL_SERVER_ERROR
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const data: UpdateUserDTO = req.body;
      const photoPath = req.file?.path;

      if (photoPath) {
        data.photo = photoPath;
      }

      const updatedUser = await this.service.update(id, data);

      if (updatedUser) {
        res.status(STATUS_CODE.OK).json(updatedUser);
      } else {
        console.log(ERROR_LOG.USER_NOT_FOUND)
        throw new CustomError(ERROR_LOG.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
    } catch (error) {
      console.error(ERROR_LOG.UPDATE_USER, error);
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
      const deletedUser = await this.service.softDelete(id);

      if (deletedUser) {
        res.status(STATUS_CODE.OK).json(deletedUser);
      } else {
        console.log(ERROR_LOG.USER_NOT_FOUND)
        throw new CustomError(ERROR_LOG.USER_NOT_FOUND, STATUS_CODE.NOT_FOUND);
      }
    } catch (error) {
      console.error(ERROR_LOG.DELETE_USER, error);
      if (error instanceof CustomError) {
        res.status(error.code).json({
          error: true,
          message: error.message,
          code: error.code
        });
      } else {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: true,
          message: ERROR_LOG.USER_NOT_FOUND,
          code: STATUS_CODE.INTERNAL_SERVER_ERROR
        });
      }
    }
  }

  async buyProduct(req: Request, res: Response): Promise<void | Response> {
    const token = req.headers["authorization"];

    if (!token) {
      console.log( ERROR_LOG.MISSING_TOKEN)
      return res.status(STATUS_CODE.FORBIDDEN).json({
        error: true,
        message: ERROR_LOG.MISSING_TOKEN,
        code: STATUS_CODE.INTERNAL_SERVER_ERROR
      });
    }

    try {
      const userPayload = decodeJwt(token);

      if (!userPayload || !userPayload.id) {
        console.log(ERROR_LOG.INVALID_TOKEN)
        throw new Error(ERROR_LOG.INVALID_TOKEN);
      }

      const productId = req.params.productId;

      const result = await this.service.buyProduct(userPayload.id, productId);

      if (result) {
        res.status(STATUS_CODE.OK).json(result);
      } else {
        console.log(ERROR_LOG.BUY_PRODUCT)
        res.status(STATUS_CODE.BAD_REQUEST).json({ error: ERROR_LOG.BUY_PRODUCT });
      }
    } catch (error) {
      console.error(ERROR_LOG.BUY_PRODUCT, error);
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ error: ERROR_LOG.INVALID_TOKEN });
    }
  }

  async addToFavorites(req: Request, res: Response): Promise<void | Response> {
    const token = req.headers["authorization"];

    if (!token) {
      console.log( ERROR_LOG.MISSING_TOKEN)
      return res.status(STATUS_CODE.FORBIDDEN).json({
        error: true,
        message: ERROR_LOG.MISSING_TOKEN,
        code: STATUS_CODE.INTERNAL_SERVER_ERROR
      });
    }

    try {
      const userPayload = decodeJwt(token);

      if (!userPayload || !userPayload.id) {
        console.log(ERROR_LOG.INVALID_TOKEN)
        throw new Error(ERROR_LOG.INVALID_TOKEN);
      }

      const productId = req.params.productId;

      const result = await this.service.addToFavorites(
        userPayload.id,
        productId
      );

      if (result) {
        res.status(STATUS_CODE.OK).json(result);
      } else {
        console.log(ERROR_LOG.FAVORITE_PRODUCT)
        res.status(STATUS_CODE.BAD_REQUEST).json({ error: ERROR_LOG.FAVORITE_PRODUCT });
      }
    } catch (error) {
      console.error(ERROR_LOG.FAVORITE_PRODUCT, error);
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ error: ERROR_LOG.INVALID_TOKEN });
    }
  }

  async removeFromFavorites(
    req: Request,
    res: Response
  ): Promise<void | Response> {
    const token = req.headers["authorization"];

    if (!token) {
      console.log(ERROR_LOG.MISSING_TOKEN)
      return res.status(STATUS_CODE.FORBIDDEN).json({
        error: true,
        message: ERROR_LOG.MISSING_TOKEN,
        code: STATUS_CODE.INTERNAL_SERVER_ERROR
      });
    }

    try {
      const userPayload = decodeJwt(token);

      if (!userPayload || !userPayload.id) {
        console.log(ERROR_LOG.INVALID_TOKEN)
        throw new Error(ERROR_LOG.INVALID_TOKEN);
      }

      const productId = req.params.productId;

      const result = await this.service.removeFromFavorites(
        userPayload.id,
        productId
      );

      if (result) {
        res.status(STATUS_CODE.OK).json(result);
      } else {
        console.log(ERROR_LOG.UNFAVORITE_PRODUCT)
        res.status(STATUS_CODE.BAD_REQUEST).json({ error: ERROR_LOG.UNFAVORITE_PRODUCT });
      }
    } catch (error) {
      console.error(ERROR_LOG.UNFAVORITE_PRODUCT, error);
      res
        .status(STATUS_CODE.UNAUTHORIZED)
        .json({ error: ERROR_LOG.INVALID_TOKEN });
    }
  }
}

export default UserController;
