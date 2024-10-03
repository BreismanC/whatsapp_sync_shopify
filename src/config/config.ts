process.loadEnvFile();

export const config = {
  SHOPIFY_SHOP_NAME: process.env.SHOPIFY_SHOP_NAME,
  SHOPIFY_PASSWROD: process.env.SHOPIFY_PASSWROD,
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY,
  GROUP_ID: process.env.GROUP_ID,
};
