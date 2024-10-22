import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

export class ProductRoutes {
  static router = Router();

  static get routes(): Router {
    const controller = new ProductController();

    this.router.post("/", controller.create.bind(controller));

    this.router.get("/", controller.get.bind(controller));

    this.router.get("/:id", controller.getById.bind(controller));

    this.router.delete("/:id", controller.delete.bind(controller));

    return this.router;
  }
}
