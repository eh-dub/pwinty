import Nock from "nock";
import Pwinty from "../";

beforeAll(() => {
  Nock.disableNetConnect();
  pwinty = Pwinty("merchantId", "apiKey");
});

test("makes a GET request to /orders", async (done) => {
  const pwinty = Pwinty("merchantId", "apiKey");
  Nock("https://sandbox.pwinty.com")
    .get("/v2.1/Orders")
    .reply(200, [{ id: 9144 }, { id: 9145 }]);

  const orders = await pwinty.getOrders();
});
