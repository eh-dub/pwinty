import Path from "path";
import { default as Dotenv } from "dotenv";
const __dirname = Path.resolve();
Dotenv.config({ path: Path.resolve(__dirname, "./process.env") });

import fetch from "node-fetch";

const SANDBOX = "https://sandbox.pwinty.com";
const PROD = "https://api.pwinty.com";
const DEFAULT_HEADERS = {
  "X-Pwinty-MerchantId": process.env.MERCHANT_ID as string,
  "X-Pwinty-REST-API-Key": process.env.REST_API_KEY as string,
  "Content-type": "application/json",
  Accept: "application/json"
};

interface CreateOrderParams {
  merchantOrderId?: string;
  recipientName: string;
  address1?: string;
  address2?: string;
  addressTownOrCity?: string;
  stateOrCounty?: string;
  postalOrZipCode?: string;
  countryCode: string;
  preferredShippingMethod: string;
  payment?: string;
  packingSlipUrl?: string;
  mobileTelephone?: string;
  telephone?: string;
  email?: string;
  invoiceAmountNet?: string;
  invoiceTax?: string;
  invoiceCurrency?: string;
}

function createOrder(params: CreateOrderParams) {
  fetch(`${SANDBOX}/v3.0/orders`, {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(params)
  })
    .then(res => {
      console.log(res.status);
      console.log(res.statusText);
      return res.json();
    })
    .then(json => console.log(json))
    .finally(() => {
      console.log("finally");
    });
}

function getOrder(orderId: number) {
  fetch(`${SANDBOX}/v3.0/orders/${orderId}`, {
    method: "GET",
    headers: DEFAULT_HEADERS
  })
    .then(res => {
      console.log(res.status);
      console.log(res.statusText);
      return res.json();
    })
    .then(json => console.log(json))
    .finally(() => {
      console.log("finally");
    });
}

// createOrder({
//   recipientName: "Bob",
//   countryCode: "GB",
//   preferredShippingMethod: "Express"
// });

getOrder(857232);

export default {
  createOrder,
  getOrder
};
