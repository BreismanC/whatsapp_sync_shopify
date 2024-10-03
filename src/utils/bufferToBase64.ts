export function bufferToBase64(buffer: Buffer) {
  const data64 = buffer.toString("base64");
  return data64;
}
