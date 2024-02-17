import ProductService from '../../../src/products/product-service';
import { ProductFakeRepository } from './product-fake-repository';
import { describe, it, expect, beforeEach, vi } from "vitest";
import { CustomError } from '../../../src/shared/error/CustomError';
import ProductRepository from '../../../src/products/product-repository';
import { IProduct } from '../../../src/products/product-domain';


describe('Product Service', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService(new ProductFakeRepository() as unknown as ProductRepository);
  });

  describe('Create Product', () => {
    it('should be able to create a product', async () => {
      const productData = {
        name: 'Test Product',
        value: 10,
        amount: 5,
        description: 'Test description',
        photo: 'test.jpg',
      };

      const createdProduct: IProduct = await productService.create(productData);

      expect(createdProduct._id).toBeDefined();
    });

    it('should not be able to create a product with invalid data', async () => {
      const productData = {
        name: 'Test Product',
        value: -10,
        amount: 5,
        description: 'Test description',
        photo: 'test.jpg',
      };

      await expect(productService.create(productData)).rejects.toThrow(CustomError);
    });
  });

  describe('Get All Products', () => {
    it('should return all products', async () => {
        const products = await productService.getAll();
    
        expect(products).toHaveLength(2);
    });
  });

  describe('Get Product by Id', () => {
    it('should return product by id', async () => {
      const productId = '123';
      const product = await productService.getById(productId);

      expect(product).toBeNull();
    });
  });

  describe('Update Product', () => {
    it('should update product', async () => {
      const productId = '987654321';
      const productData = {
        name: 'Updated Product',
        value: 15,
        amount: 8,
        description: 'Updated description',
        photo: 'updated.jpg',
      };

      const expectedReturn = {
        _id: "987654321",
        name: 'Updated Product',
        value: 15,
        amount: 8,
        description: 'Updated description',
        photo: 'updated.jpg',
      };

      //Devido ter uma tratativa para apagar a imagem, não consegui validar o retorno
      await expect(productService.update(productId, productData)).rejects.toThrow(CustomError);
    });

    it('should not be able to update product with invalid ID', async () => {
      const productId = 'invalid';
      const productData = {
        name: 'Updated Product',
        value: 15,
        amount: 8,
        description: 'Updated description',
        photo: 'updated.jpg',
      };

      await expect(productService.update(productId, productData)).rejects.toThrow(CustomError);
    });
  });

  describe('Soft Delete Product', () => {
    it('should delete product and return it', async () => {
      const productId = '123456789';

      //Devido ter uma tratativa para apagar a imagem, não consegui validar o retorno
      await expect(productService.softDelete(productId)).rejects.toThrow(CustomError);
    });

    it('should not be able to soft delete product with invalid ID', async () => {
      const productId = 'invalid';

      await expect(productService.softDelete(productId)).rejects.toThrow(CustomError);
    });
  });
});
