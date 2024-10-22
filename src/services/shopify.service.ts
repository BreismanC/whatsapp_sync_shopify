import Shopify from "shopify-api-node";
import { config } from "../config";
import { BodyToHtmlShopify, ProductToShopify } from "../interfaces";

export class ShopifyService {
  private shopify = new Shopify({
    shopName: config.SHOPIFY_SHOP_NAME as string,
    apiKey: config.SHOPIFY_API_KEY as string,
    password: config.SHOPIFY_PASSWROD as string,
  });

  async createProduct(product: ProductToShopify) {
    const {
      title,
      description,
      options,
      variants,
      tags,
      sku,
      price,
      images,
      additionalPrices,
      groupInfo,
    } = product;

    const body_html = this.generateBody({
      description,
      currency: price.currency,
      additionalPrices,
      groupInfo,
    });

    try {
      const productData = {
        title,
        price: price.value,
        body_html,
        status: "active",
        sku,
        options,
        variants,
        tags,
        images,
      };
      const productCreated = await this.shopify.product.create(productData);
      return productCreated;
    } catch (error) {
      console.log(
        "Ha ocurrido un error al crear el producto en shopify",
        error
      );
      return;
    }
  }

  async updateProduct(shopifyId: number, status: String) {
    try {
      return await this.shopify.product.update(shopifyId, { status });
    } catch (error) {
      throw new Error(
        `Erro al intentar actualizar el producto en Shopify con Id: ${shopifyId}`
      );
    }
  }

  private generateBody(body: BodyToHtmlShopify) {
    const { description, currency, additionalPrices, groupInfo } = body;

    const additionalPricesList = additionalPrices
      .map((item) => `<li>$${item.price} ${currency} (${item.condition})</li>`)
      .toString()
      .replaceAll("</li>,", "</li>");
    return `
    <h4>${description}</h4>
    <ul>${additionalPricesList}</ul>
    ${
      groupInfo
        ? `    <p>
      <strong>${groupInfo.name}</strong><br/>
      <a href="${groupInfo.link}" target="_blank">Más información aquí</a>
    </p>`
        : ``
    }

    `;
  }
}
