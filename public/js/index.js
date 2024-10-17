const HOST = "http://localhost:3000"; //^Cambiar el host cuando se despliegue

const socket = io.connect(HOST, {
  forceNew: true,
});

const qrcode = document.getElementById("qrcode");
const cardText = document.getElementById("card__text");

socket.on("authenticated", (message) => {
  qrcode.setAttribute("src", "../assets/check.svg");
  console.log("Mensaje en authenticated", message);
  cardText.textContent = message;
});

socket.on("qr", ({ qr, message }) => {
  qrcode.setAttribute("src", qr);
  cardText.textContent = message;
});

socket.on("disconnected", (message) => {
  qrcode.setAttribute("src", "../assets/cross.svg");
  cardText.textContent = message;
});

socket.on("connecting", (message) => {
  qrcode.setAttribute("src", "../assets/loader.gif");
  cardText.textContent = message;
});
