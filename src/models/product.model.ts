export interface ProductCreate {
  shopifyId: string;
  name: string;
  sku: string;
}

export interface Product extends ProductCreate {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
  status?: string;
}
