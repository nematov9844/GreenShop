export interface CategoryType {
  count: number;
  title: string;
  route_path: string;
}

export interface ProductType {
  _id: string;
  title: string;
  main_image: string;
  price: number;
  discount: boolean;
  discount_price: string | number;
} 