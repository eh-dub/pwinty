type Host = "https://sandbox.pwinty.com" | "https://api.pwinty.com";
type Pwinty = {
  createOrder: (params: CreateOrderParams) => Promise<import("./orders").Order>;
  getOrder: (orderId: number) => Promise<import("./orders").Order>;
  getOrders: (
    limit?: number,
    start?: number
  ) => Promise<import("./orders").Order[]>;
  updateOrder: (
    orderId: number,
    orderDetails: CreateOrderParams
  ) => Promise<any>;
};
