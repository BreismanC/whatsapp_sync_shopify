import makeWASocket, {
  ConnectionState,
  DisconnectReason,
  downloadMediaMessage,
  MessageUpsertType,
  useMultiFileAuthState,
  WAMessage,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import QRCode from "qrcode";

import { ShopifyService } from "./shopify.service";
import { config } from "../config";

import {
  bufferToBase64,
  extractProductInfo,
  generateRecord,
  isProductMessage,
} from "../utils";

import { ProductImage, ProductToShopify, Record } from "../interfaces";
import { Server } from "socket.io";
import { ProductService } from "./product.service";

export class WhatsappService {
  private io: Server;
  private sock: any;
  private productComposition: Array<{ info: any; media: Buffer }> = [];
  private shopifyService: ShopifyService;
  private productService: ProductService;
  private isAuthenticated: boolean = false;
  public qrCodeDataURL: string | undefined;

  constructor(io: Server) {
    this.io = io;
    this.shopifyService = new ShopifyService();
    this.productService = new ProductService();
  }

  async connect() {
    const { state, saveCreds } = await useMultiFileAuthState(
      "./persistent_volume/auth"
    );
    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
    });

    this.sock.ev.on("creds.update", saveCreds);
    this.sock.ev.on(
      "connection.update",
      this.handleConnectionUpdate.bind(this)
    );
    this.sock.ev.on("messages.upsert", this.handleMessages.bind(this));
  }

  private async handleConnectionUpdate(update: ConnectionState) {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      try {
        //Generate the QR as Data URL and send it to the frontend
        this.qrCodeDataURL = await QRCode.toDataURL(qr);
        this.io.emit("qr", {
          qr: this.qrCodeDataURL,
          message: "Escanea el código QR con tu teléfono",
        });
        console.log("QR emitido al frontend");
      } catch (error) {
        throw new Error("Error al enviar el código QR al front");
      }
    }

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect
      );
      this.isAuthenticated = false;

      this.io.emit("disconnected", "Desconectado de whatsapp");

      // reconnect if not logged out
      if (shouldReconnect) {
        this.connect();
      }
    } else if (connection === "open") {
      this.isAuthenticated = true;
      this.io.emit("authenticated", "Autenticado en Whatsapp");
      console.log("Conexión a WhatsApp abierta");
    } else if (connection === "connecting") {
      this.io.emit("connecting", "Realizando conexión");
      console.log("Conectando con whatsapp");
    }
  }

  private async handleMessages({
    messages,
    type,
  }: {
    messages: WAMessage[];
    type: MessageUpsertType;
  }) {
    if (type !== "notify") {
      console.log("No es una notificación de mensaje");
      this.productComposition = [];
      return;
    }

    for (let msg of messages) {
      if (msg.key.remoteJid !== config.GROUP_ID) {
        console.log("El mensaje no pertenece al grupo de interés");
        continue;
      }

      if (!msg.key.fromMe) {
        console.log("Mensaje no es de la persona de interés");
        continue;
      }

      if (msg.message?.imageMessage) {
        await this.handleImageMessage(msg);
      } else {
        await this.handleTextMessage(msg);
      }
    }
  }

  private async handleImageMessage(msg: WAMessage) {
    try {
      const media = await downloadMediaMessage(msg, "buffer", {});
      if (!media) {
        console.log("No hay datos de la imagen");
        return;
      }
      this.productComposition.push({ info: msg.message?.imageMessage, media });
    } catch (error) {
      console.log("Sucedió un error al intentar recuperar la imagen: ", error);
    }
  }

  private async handleTextMessage(msg: WAMessage) {
    const messageConversation = msg.message?.conversation;
    if (!messageConversation) {
      console.log("No hay conversación en este mensaje");
      this.productComposition = [];
      return;
    }

    console.log("Mensaje en grupo de interés");

    if (!isProductMessage(messageConversation)) {
      console.log("Mensaje no contiene la estructura de un producto");
      this.productComposition = [];
      return;
    }

    const productInfo = await extractProductInfo(messageConversation);
    if (!productInfo) {
      console.log(
        "Ha ocurrido un error extrayendo la información del producto"
      );
      return;
    }
    const images: ProductImage[] = this.productComposition.map(({ media }) => ({
      attachment: bufferToBase64(media),
    }));

    const productData: ProductToShopify = { ...productInfo, images };
    const productCreated = await this.shopifyService.createProduct(productData);

    let record: Record = {};
    if (!productCreated) {
      record.error = true;
      record.data = "Error al crear el producto en Shopify";
    } else {
      try {
        const productSaved = await this.productService.create({
          shopifyId: productCreated.id.toString(),
          name: productCreated.title,
          sku: productInfo.sku,
        });
        console.log(`Producto guardado en la base de datos: ${productSaved}`);
        record.data = JSON.stringify(productSaved);
      } catch (error) {
        if (error instanceof Error) {
          record.error = true;
          record.data = error.message;
        }
      }
    }

    generateRecord(record);
    this.productComposition = [];
  }

  public isConnected() {
    return this.sock.user ? true : false;
  }

  public getConnectionStatus(): boolean {
    return this.isAuthenticated;
  }
}
