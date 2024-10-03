export interface ProductInfo {
  title: string;
  price: ProductPrice;
  sku: string;
  options: ProductOption[];
  variants: ProductVariant[];
  description: string;
  additionalPrices: ProductAdditionalPrice[];
  groupInfo: ProductGroupInfo | null;
}

export interface ProductPrice {
  value: number;
  currency: string;
}

export interface ProductOption {
  name: string;
  values: string;
}

export interface ProductVariant {
  option1: string;
  price: number;
}

export interface ProductAdditionalPrice {
  price: number | null;
  condition: string | null;
}

export interface ProductGroupInfo {
  name: string;
  link: string;
}

export interface ProductImage {
  attachment: string;
}

export interface ProductToShopify extends ProductInfo {
  images: ProductImage[];
}

export interface BodyToHtmlShopify {
  description: string;
  currency: string;
  additionalPrices: ProductAdditionalPrice[];
  groupInfo?: ProductGroupInfo | null;
}
