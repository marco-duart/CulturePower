import { Request, Response } from "express";
import ProductService from "./product-service";
import { UpdateProductDTO, CreateProductDTO } from "./product-dto";

class ProductController {
  constructor(private service: ProductService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateProductDTO = req.body;
      const photoPath = req.file?.path;

      if (photoPath) {
        const fileName = photoPath.split("\\").pop();
        data.photo = `${req.protocol}://${req.get("host")}/${fileName}`;
      }

      const createdProduct = await this.service.create(data);
      res.status(201).json(createdProduct);
    } catch (error) {
      console.log("Tratar Erro");
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const product = await this.service.getById(id);

      if (product) {
        res.status(201).json(product);
      } else {
        console.log("Tratar Erro");
      }
    } catch (error) {
      console.log("Tratar Erro");
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const productArray = await this.service.getAll();

      if (productArray) {
        res.status(201).json(productArray);
      } else {
        console.log("Tratar Erro");
      }
    } catch (error) {
      console.log("Tratar Erro");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const data: UpdateProductDTO = req.body;
      const photoPath = req.file?.path;

      if (photoPath) {
        const fileName = photoPath.split("\\").pop();
        data.photo = `${req.protocol}://${req.get("host")}/${fileName}`;
      }

      const updatedProduct = await this.service.update(id, data);

      if (updatedProduct) {
        res.status(201).json(updatedProduct);
      } else {
        console.log("Tratar Erro");
      }
    } catch (error) {
      console.log("Tratar Erro");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const deletedProduct = await this.service.softDelete(id);

      if (deletedProduct) {
        res.status(200).json(deletedProduct);
      } else {
        console.log("Tratar Erro");
      }
    } catch (error) {
      console.log(error);
      console.log("Tratar Erro");
    }
  }
}

export default ProductController;
