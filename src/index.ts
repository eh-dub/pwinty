import Orders from "./orders";

export default function Pwinty(
  merchantId: string,
  restApiKey: string,
  host: Host = "https://sandbox.pwinty.com"
) {
  return { ...Orders(merchantId, restApiKey, host) };
}
