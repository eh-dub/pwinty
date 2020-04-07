import Path from "path";
import { default as Dotenv } from "dotenv";
const __dirname = Path.resolve();
Dotenv.config({ path: Path.resolve(__dirname, "./process.env") });

import type { CountryCode } from "./CountryCodes";
import fetch from "node-fetch";

export type CreateOrderParams = {
  merchantOrderId?: string;
  recipientName: string;
  address1?: string;
  address2?: string;
  addressTownOrCity?: string;
  stateOrCounty?: string;
  postalOrZipCode?: string;
  countryCode: CountryCode;
  preferredShippingMethod: string;
  payment?: string;
  packingSlipUrl?: string;
  mobileTelephone?: string;
  telephone?: string;
  email?: string;
  invoiceAmountNet?: string;
  invoiceTax?: string;
  invoiceCurrency?: string;
};

export type ShippingInfo = {
  price: number;
  shipments: string;
};

export type Payment = "InvoiceMe" | "InvoiceRecipient";
const x = new Date();
export type Order = {
  id: number;
  canCancel: boolean;
  canHold: boolean;
  canUpdateShipping: boolean;
  canUpdateImages: boolean;
  recipientName: string;
  address1: string;
  address2: string;
  addressTownOrCity: string;
  stateOrCounty: string;
  postalOrZipCode: string;
  countryCode: CountryCode;
  mobileTelephone: string;
  price: number;
  status: string;
  shippingInfo: ShippingInfo;
  payment: Payment;
  paymentUrl: string;
  images: Image[];
  merchantOrderId: string;
  preferredShippingMethod: string;
  created: string;
  lastUpdated: string;
  errorMessage: string;
  invoiceAmountNet: number;
  invoiceTax: number;
  invoiceCurrency: string;
};

export type ImageStatus =
  | "AwaitingUrlOrData"
  | "NotYetDownloaded"
  | "Ok"
  | "FileNotFoundAtUrl"
  | "Invalid";

export type Image = {
  id: number;
  url: string;
  status: ImageStatus;
  copies: number;
  sizing: string;
  price: number;
  priceToUser: number;
  md5Hash: string;
  previewUrl: string;
  thumbnailUrl: string;
  sku: string;
  attributes: Object; // specific to the merchandise
  errorMessage: string;
};

const SANDBOX = "https://sandbox.pwinty.com";
const PROD = "https://api.pwinty.com";
const DEFAULT_HEADERS = {
  "X-Pwinty-MerchantId": process.env.MERCHANT_ID as string,
  "X-Pwinty-REST-API-Key": process.env.REST_API_KEY as string,
  "Content-type": "application/json",
  Accept: "application/json",
};

function createOrder(params: CreateOrderParams): Promise<Order> {
  return fetch(`${SANDBOX}/v3.0/orders`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(params),
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      return Promise.reject(new Error(res.statusText));
    }
  });
}

function getOrder(orderId: number): Promise<Order> {
  return fetch(`${SANDBOX}/v3.0/orders/${orderId}`, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      return Promise.reject(new Error(res.statusText));
    }
  });
}

function getOrders(limit: number = 100, start: number = 0): Promise<Order[]> {
  if (limit < 0 || limit > 250)
    return Promise.reject("Limit must be in range [0,250]");
  if (start < 0) return Promise.reject("Start must be a positive number");
  return fetch(`${SANDBOX}/v3.0/orders?limit=${limit}&start=${start}`, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      return Promise.reject(new Error(res.statusText));
    }
  });
}

function updateOrder(orderId: number, orderDetails: CreateOrderParams) {
  return fetch(`${SANDBOX}/v3.0/orders/${orderId}`, {
    method: "PUT",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(orderDetails),
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      return Promise.reject(new Error(res.statusText));
    }
  });
}

export type InvalidImage = {
  id: number;
  errors: ImageError[];
  warnings: ImageWarning[];
};

export type ImageError =
  | "FileCouldNotBeDownloaded"
  | "NoImageFile"
  | "InvalidImageFile"
  | "ZeroCopies";

export type ImageWarning =
  | "CroppingWillOccur"
  | "PictureSizeTooSmall"
  | "CouldNotValidateImageSize"
  | "CouldNotValidateAspectRatio"
  | "AttributeNotValid";

export type GeneralOrderErrors =
  | "AccountBalanceInsufficient"
  | "ItemsContainingErrors"
  | "NoItemsInOrder"
  | "PostalAddressNotSet";

export type SubmissionStatus = {
  id: number;
  isValid: boolean;
  photos: InvalidImage[];
  generalErrors: GeneralOrderErrors[];
};

function validateOrder(orderId: number): Promise<SubmissionStatus> {
  return fetch(`${SANDBOX}/v3.0/orders/${orderId}/SubmissionStatus`, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      return Promise.reject(new Error(res.statusText));
    }
  });
}

export type OrderStatus = "Cancelled" | "AwaitingPayment" | "Submitted";

function updateOrderStatus(orderId: number, orderStatus: OrderStatus) {
  return fetch(`${SANDBOX}/v3.0/orders/${orderId}/status`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ status: orderStatus }),
  }).then((res) => {
    if (res.status === 200) {
      return res.json();
    } else if (res.status === 402) {
      return Promise.reject(res.json());
    } else {
      return Promise.reject(new Error(res.statusText));
    }
  });
}

export default {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
};
