import { Response, Router } from "express";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.get("/", (_req, res: Response) => {
      res.sendFile("index.html", { root: "public" });
    });

    return router;
  }
}
