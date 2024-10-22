import { PrismaClient } from "@prisma/client";
import { Product, ProductCreate } from "../models";

export class ProductRepository {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(product: ProductCreate): Promise<Product> {
    try {
      const productCreated: Product = await this.prisma.product.create({
        data: product,
      });
      return productCreated;
    } catch (error) {
      throw new Error("Error al crear el producto en la base de datos");
    }
  }

  async get(): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany();
    } catch (error) {
      throw new Error("Error al obtener los productos de la base de datos");
    }
  }

  async getByStatusActive(): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany({
        where: {
          status: "active",
        },
      });
    } catch (error) {
      throw new Error("Error al botener los productos de la base de datos");
    }
  }

  async getById(id: number): Promise<Product | null> {
    try {
      return await this.prisma.product.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(
        `Error al obtener el producto con id ${id} de la base de datos`
      );
    }
  }

  async update(id: number, data: Partial<Product>): Promise<void> {
    try {
      await this.prisma.product.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      throw new Error("Error al obtener los productos de la base de datos");
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.product.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error("Error al obtener los productos de la base de datos");
    }
  }
}
