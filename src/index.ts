import { config } from "./config";
import { Server } from "./server";
import { WhatsappService } from "./services/whatsapp.service";
import { AppRoutes } from "./routes/server.routes";

function main() {
  new Server({ port: config.PORT, router: AppRoutes.routes })
    .start()
    .catch((error) => {
      console.log("Error al iniciar el servidor", error);
    });

  new WhatsappService().connect().catch((error) => {
    console.log("Error en la conexión con whatsapp", error);
  });
}

main();
