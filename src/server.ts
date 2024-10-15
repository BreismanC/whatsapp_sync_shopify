import express, { Router, urlencoded } from "express";
import { Server as HTTPServer } from "node:http";
import { Server as IOServer } from "socket.io";
import { Options } from "./interfaces";

export class Server {
  public readonly app = express();
  private readonly port: number;
  private readonly router: Router;
  private httpServer: HTTPServer;
  public io: IOServer;

  constructor(options: Options) {
    const { port = 3100, router } = options;
    this.port = port;
    this.router = router;
    this.httpServer = new HTTPServer(this.app);
    this.io = new IOServer(this.httpServer);
  }

  async start() {
    //middlewares
    this.app.use(express.json());
    this.app.use(urlencoded({ extended: true }));

    //Routes
    this.app.use("api/v1", this.router);

    // Serve static files
    this.app.use(express.static("public"));

    this.httpServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
