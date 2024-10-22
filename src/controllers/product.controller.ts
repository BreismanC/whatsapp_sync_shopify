import { Request, Response } from "express";
import { ProductService } from "../services";
import { ProductCreate } from "../models";

export class ProductController {
  private readonly productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async create(req: Request, res: Response) {
    try {
      const product: ProductCreate = req.body;
      const productCreated = await this.productService.create(product);
      res.status(201).json(productCreated);
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({
          error: error?.message,
          stack: error?.stack,
        });
      else {
        res.sendStatus(500);
      }
    }
  }

  async get(_req: Request, res: Response) {
    try {
      const products = await this.productService.get();
      res.status(200).json(products);
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({
          error: error?.message,
          stack: error?.stack,
        });
      else {
        res.sendStatus(500);
      }
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new Error("Id must be a number");

      const product = await this.productService.getById(id);
      res.status(200).json(product);
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({
          error: error.message,
          stack: error.stack,
        });
      else {
        res.status(500);
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new Error("Id must be a number");
      await this.productService.delete(id);
      res.sendStatus(200);
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({
          error: error.message,
          stack: error.stack,
        });
      else res.status(500);
    }
  }
}
