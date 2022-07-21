import assert from "assert";
import SPSHandler from "../factory/SPSHandler.mjs";
import OrderSchema from "../data/OrderSchema.mjs";
import mongoose from "mongoose";
import { READ_VARIABLES_PRODUCTION } from "../factory/DatablockProductionSPS.mjs";
import { READ_VARIABLES_STORAGE } from "../factory/DatablockStorageSPS.mjs";

describe("SPSHandler", function () {
  const productionData = {
    orderCompleted: false,
    productionStock15mmSilver: 1,
    productionStock15mmBlue: 2,
    productionStock18mmSilver: 3,
    productionStock18mmBlue: 4,
    productionStock22mmSilver: 5,
    productionStock22mmBlue: 6,
  };

  const storageData = {
    storageStock15mmSilver: 7,
    storageStock15mmBlue: 8,
    storageStock18mmSilver: 9,
    storageStock18mmBlue: 10,
    storageStock22mmSilver: 11,
    storageStock22mmBlue: 12,
  };

  const OrderModel = mongoose.model("Order", OrderSchema, "orders");

  var cut;

  beforeEach(function () {
    //set internal instance to undefined to circumvent singleton pattern
    SPSHandler._instance = undefined;
    cut = new SPSHandler();
  });

  describe("readAllSPS", function () {
    it("returns the expected values", async function () {
      cut.productionSPS.readAllItems = () => {
        return productionData;
      };

      cut.storageSPS.readAllItems = () => {
        return storageData;
      };

      var actual = await cut.readAllSPS();
      var expected = Object.assign({}, productionData, storageData);
      assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected));
    });

    it("works when promises are rejected", async function () {
      cut.productionSPS.readAllItems = () => {
        return Promise.reject();
      };

      cut.storageSPS.readAllItems = () => {
        return Promise.reject();
      };

      var actual = await cut.readAllSPS();

      var expected = {};
      for (const key of READ_VARIABLES_PRODUCTION) {
        expected[key] = 0;
      }
      for (const key of READ_VARIABLES_STORAGE) {
        expected[key] = 0;
      }

      assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected));
    });

    it("reads 2nd sps even if reading first sps failed", async function () {
      var i = 5;
      cut.productionSPS.readAllItems = () => {
        return Promise.reject();
      };

      cut.storageSPS.readAllItems = () => {
        return Promise.resolve({ productionStock15mmSilver: i });
      };

      var actual = await cut.readAllSPS();

      var expected = {};
      for (const key of READ_VARIABLES_PRODUCTION) {
        expected[key] = 0;
      }
      for (const key of READ_VARIABLES_STORAGE) {
        expected[key] = 0;
      }
      expected["productionStock15mmSilver"] = i;

      assert.strictEqual(JSON.stringify(actual), JSON.stringify(expected));
    });
  });

  describe("submitOrder", function () {
    it("calls SPSCommunicator with the expected values", function () {
      cut.productionSPS.writeItems = () => {};
      var order = new OrderModel();
      order.orderName = "TestOrderName";
      order.leftStack[0] = {
        position: 0,
        height: 15,
        color: { r: 0, g: 0, b: 0, name: "silber" },
      };
      order.leftStack[1] = {
        position: 0,
        height: 18,
        color: { r: 0, g: 0, b: 0, name: "blau" },
      };
      order.rightStack[0] = {
        position: 0,
        height: 22,
        color: { r: 0, g: 0, b: 0, name: "silber" },
      };
      cut.submitOrder(order);
    });
  });
});
