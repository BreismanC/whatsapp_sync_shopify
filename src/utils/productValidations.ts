import { ProductInfo } from "../interfaces";

export function isProductMessage(msg: string) {
  const productPattern =
    /^NOMBRE:.*\n\nPRECIO:.*\n\nSKU:.*\n\nTALLAS:.*\n\nDESCRIPCIÓN:.*$/gm;
  return productPattern.test(msg);
}

export async function extractProductInfo(
  msg: string
): Promise<ProductInfo | undefined> {
  try {
    const nameMatch = msg.match(/NOMBRE:\s*(.*)/i);
    const priceMatch = msg.match(/PRECIO:\s*(.*)/i);
    const skuMatch = msg.match(/SKU:\s*(.*)/i);
    const sizesMatch = msg.match(/TALLAS:\s*(.*)/i);
    const descriptionMatch = msg.match(/DESCRIPCIÓN:\s*(.*)/i);
    const additionalPricesMatch = [
      ...msg.matchAll(/\* Precio \d+:\s*\$([\d,.]+) USD \(([^)]+)\)/g),
    ];
    const groupMatch = msg.match(/GRUPO\s*(.*)\n(https?:\/\/[^\s]+)/i);

    if (
      !nameMatch ||
      !priceMatch ||
      !skuMatch ||
      !sizesMatch ||
      !descriptionMatch ||
      additionalPricesMatch.length === 0 ||
      !groupMatch
    ) {
      throw new Error(
        "No se pudo extraer la información del mensaje con detalles del producto"
      );
    }

    const priceAndCurrency = priceMatch[1]
      .trim()
      .match(/([\d,.]+)\s*([A-Z]{3})/);

    if (!priceAndCurrency) {
      throw new Error("El campo de precio tiene un formato inválido");
    }

    const productData = {
      title: nameMatch[1].trim(),

      price: {
        value: parseFloat(priceAndCurrency[1].replace(",", ".")),
        currency: priceAndCurrency[2],
      },

      sku: skuMatch[1].trim(),

      options: [
        {
          name: "talla",
          values: sizesMatch[1].trim(),
        },
      ],

      variants: sizesMatch[1]
        .trim()
        .split("-")
        .map((value) => ({
          option1: value,
          price: parseFloat(priceAndCurrency[1].replace(",", ".")),
        })),

      description: descriptionMatch[1].trim(),

      additionalPrices: additionalPricesMatch.map((match) => ({
        price: parseFloat(match[1].replace(",", ".")),
        condition: match[2],
      })),

      groupInfo: groupMatch
        ? { name: groupMatch[1], link: groupMatch[2] }
        : null,
    };
    return productData;
  } catch (error: any) {
    console.log(
      "Problemas extrayendo la información del producto",
      error.message
    );
    return;
  }
}
