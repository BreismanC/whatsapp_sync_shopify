import { ProductRepository } from "../repositories/product.repository";
import { Product, ProductCreate } from "../models";

export class ProductService {
  private readonly productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async create(productCreate: ProductCreate) {
    try {
      return await this.productRepository.create(productCreate);
    } catch (error) {
      throw error;
    }
  }

  async get() {
    try {
      return await this.productRepository.get();
    } catch (error) {
      throw error;
    }
  }

  async getByStatusActive() {
    try {
      return await this.productRepository.getByStatusActive();
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number) {
    try {
      const productFound = await this.productRepository.getById(id);
      if (!productFound) {
        throw new Error("Producto no encontrado en la base de datos");
      }
      return productFound;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, product: Partial<Product>) {
    try {
      await this.getById(id);
      await this.productRepository.update(id, product);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      await this.getById(id);
      await this.productRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
