import { config } from "./config";
import { Server } from "./server";
import { WhatsappService } from "./services/whatsapp.service";
import { AppRoutes } from "./routes/server.routes";
import { CronjobService } from "./services/cronjob.service";

async function main() {
  const server = new Server({ port: config.PORT, router: AppRoutes.routes });

  await server.start().catch((error) => {
    console.log("Error al iniciar el servidor", error);
  });

  const whatsappService = new WhatsappService(server.io);

  await whatsappService.connect().catch((error) => {
    console.log("Error en la conexión con whatsapp", error);
  });

  // Manejar conexiones de Socket.IO
  server.io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    // Emitir el estado actual al cliente que se conecta
    if (whatsappService.getConnectionStatus()) {
      socket.emit("authenticated", "Autenticado en WhatsApp");
    } else {
      socket.emit("qr", {
        qr: whatsappService.qrCodeDataURL,
        message: "Escanea el código QR con tu teléfono",
      });
    }
  });

  // Tarea programada con CronJob
  const cronjob = new CronjobService();
  cronjob.run();
}

main();
