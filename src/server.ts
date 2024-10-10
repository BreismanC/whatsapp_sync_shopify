import express, { Router, urlencoded } from "express";
import { Options } from "./interfaces";

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly router: Router;

  constructor(options: Options) {
    const { port = 3100, router } = options;
    this.port = port;
    this.router = router;
  }

  async start() {
    //middlewares
    this.app.use(express.json());
    this.app.use(urlencoded({ extended: true }));

    //Routes
    this.app.use("api/v1", this.router);

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
