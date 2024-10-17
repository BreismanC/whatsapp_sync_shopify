process.loadEnvFile();
import { Config } from "../interfaces";

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV as string,
  HOST:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : (process.env.HOST as string),
  PORT: process.env.PORT as unknown as number,
  SHOPIFY_SHOP_NAME: process.env.SHOPIFY_SHOP_NAME as string,
  SHOPIFY_PASSWROD: process.env.SHOPIFY_PASSWROD as string,
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY as string,
  SHOPIFY_API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY as string,
  GROUP_ID: process.env.GROUP_ID as string,
};
