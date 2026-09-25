export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  description: string;
  details?: string;
  available?: boolean;
};

export type Fulfillment = 'delivery' | 'pickup';
export type OrderStatus = 'Pending' | 'Verified' | 'Accepted' | 'Paid' | 'Shipped' | 'Delivered';
export type Order = {
  id?: number;
  order_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: string;
  fulfillment: Fulfillment;
  delivery_charge: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  payment_status: string;
  shipping_info?: string;
  created_at?: string;
};

export type CartLine = { product: Product; quantity: number };
