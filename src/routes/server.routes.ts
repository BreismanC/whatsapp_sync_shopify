import { Response, Router } from "express";
import { ProductRoutes } from "./product.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", (_req, res: Response) => {
      res.sendFile("index.html", { root: "public" });
    });

    router.use("/products", ProductRoutes.routes);

    return router;
  }
}
