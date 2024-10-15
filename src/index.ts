import { config } from "./config";
import { Server } from "./server";
import { WhatsappService } from "./services/whatsapp.service";
import { AppRoutes } from "./routes/server.routes";

async function main() {
  const server = new Server({ port: config.PORT, router: AppRoutes.routes });

  await server.start().catch((error) => {
    console.log("Error al iniciar el servidor", error);
  });

  const whatsappService = new WhatsappService(server.io);
  await whatsappService.connect().catch((error) => {
    console.log("Error en la conexión con whatsapp", error);
  });
}

main();
