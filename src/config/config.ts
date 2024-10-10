process.loadEnvFile();
import { Config } from "../interfaces";

export const config: Config = {
  PORT: process.env.PORT as unknown as number,
  SHOPIFY_SHOP_NAME: process.env.SHOPIFY_SHOP_NAME as string,
  SHOPIFY_PASSWROD: process.env.SHOPIFY_PASSWROD as string,
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY as string,
  SHOPIFY_API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY as string,
  GROUP_ID: process.env.GROUP_ID as string,
};
