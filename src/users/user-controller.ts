import { Request, Response } from "express";
import UserService from "./user-service";
import { UpdateUserDTO, CreateUserDTO } from "./user-dto";
import { decodeJwt } from "../utils/jwt-utils";

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

  async buyProduct(req: Request, res: Response): Promise<void | Response>  {
    const token = req.headers["authorization"];
    
    if (!token) {
      return res.status(403).json({ error: 'Middleware já confirmou a existência de um token antes de chegar aqui!' });
    }
  
    try {
      const userPayload = decodeJwt(token);
      
      if (!userPayload || !userPayload.id) {
        throw new Error('Token inválido!');
      }
  
      const productId = req.params.productId;
  
      const result = await this.service.buyProduct(userPayload.id, productId);
  
      if (result) {
        res.json(result);
      } else {
        res.status(400).json({ error: 'Falha ao comprar o produto.' });
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: 'Token expirado ou inválido. Faça login novamente.' });
    }
  }

  async addToFavorites(req: Request, res: Response): Promise<void | Response> {
    const token = req.headers["authorization"];
    
    if (!token) {
      return res.status(403).json({ error: 'Middleware já confirmou a existência de um token antes de chegar aqui!' });
    }
  
    try {
      const userPayload = decodeJwt(token);
      
      if (!userPayload || !userPayload.id) {
        throw new Error('Token inválido!');
      }
  
      const productId = req.params.productId;
  
      const result = await this.service.addToFavorites(userPayload.id, productId);
  
      if (result) {
        res.json(result);
      } else {
        res.status(400).json({ error: 'Falha ao favoritar o produto.' });
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: 'Token expirado ou inválido. Faça login novamente.' });
    }
  }
}

export default UserController;
