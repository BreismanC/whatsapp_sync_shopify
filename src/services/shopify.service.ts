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
