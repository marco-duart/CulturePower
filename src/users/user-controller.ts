import { Request, Response } from "express";
import UserService from "./user-service";
import { UpdateUserDTO, CreateUserDTO } from "./user-dto";
import { CustomError } from "../shared/errors/CustomError";
import { StatusCode } from "../utils/enums/statusCode";
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
      res.status(201).json(createdUser);
    } catch (error) {
      console.error("Error creating user:", error);
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
      const user = await this.service.getById(id);

      if (user) {
        res.status(200).json(user);
      } else {
        throw new CustomError("User not found", StatusCode.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error fetching user by ID:", error);
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
      const userArray = await this.service.getAll();
      res.status(200).json(userArray);
    } catch (error) {
      console.error("Error fetching all users:", error);
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
      const data: UpdateUserDTO = req.body;
      const photoPath = req.file?.path;

      if (photoPath) {
        data.photo = photoPath;
      }

      const updatedUser = await this.service.update(id, data);

      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        throw new CustomError("User not found", StatusCode.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error updating user:", error);
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
      const deletedUser = await this.service.softDelete(id);

      if (deletedUser) {
        res.status(200).json(deletedUser);
      } else {
        throw new CustomError("User not found", StatusCode.NOT_FOUND);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
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

  async buyProduct(req: Request, res: Response): Promise<void | Response> {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(403).json({
        error: true,
        message: "Missing token or inválid token format",
        code: StatusCode.INTERNAL_SERVER_ERROR
      });
    }

    try {
      const userPayload = decodeJwt(token);

      if (!userPayload || !userPayload.id) {
        throw new Error("Invalid token!");
      }

      const productId = req.params.productId;

      const result = await this.service.buyProduct(userPayload.id, productId);

      if (result) {
        res.json(result);
      } else {
        res.status(400).json({ error: "Failed to buy the product." });
      }
    } catch (error) {
      console.error("Error buying product:", error);
      res
        .status(401)
        .json({ error: "Expired or invalid token. Please log in again." });
    }
  }

  async addToFavorites(req: Request, res: Response): Promise<void | Response> {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(403).json({
        error: true,
        message: "Missing token or inválid token format",
        code: StatusCode.INTERNAL_SERVER_ERROR
      });
    }

    try {
      const userPayload = decodeJwt(token);

      if (!userPayload || !userPayload.id) {
        throw new Error("Invalid token!");
      }

      const productId = req.params.productId;

      const result = await this.service.addToFavorites(
        userPayload.id,
        productId
      );

      if (result) {
        res.json(result);
      } else {
        res.status(400).json({ error: "Failed to add the product to favorites." });
      }
    } catch (error) {
      console.error("Error adding product to favorites:", error);
      res
        .status(401)
        .json({ error: "Expired or invalid token. Please log in again." });
    }
  }

  async removeFromFavorites(
    req: Request,
    res: Response
  ): Promise<void | Response> {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(403).json({
        error: true,
        message: "Missing token or inválid token format",
        code: StatusCode.INTERNAL_SERVER_ERROR
      });
    }

    try {
      const userPayload = decodeJwt(token);

      if (!userPayload || !userPayload.id) {
        throw new Error("Invalid token!");
      }

      const productId = req.params.productId;

      const result = await this.service.removeFromFavorites(
        userPayload.id,
        productId
      );

      if (result) {
        res.json(result);
      } else {
        res.status(400).json({ error: "Failed to remove the product from favorites." });
      }
    } catch (error) {
      console.error("Error removing product from favorites:", error);
      res
        .status(401)
        .json({ error: "Expired or invalid token. Please log in again." });
    }
  }
}

export default UserController;
