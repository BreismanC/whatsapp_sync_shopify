import { WhatsappService } from "./services/whatsapp.service";

function main() {
  new WhatsappService().connect().catch((error) => {
    console.log("Error en la conexión con whatsapp", error);
  });
}

main();
