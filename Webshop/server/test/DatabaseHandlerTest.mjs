import assert from "assert";
import MongoMemoryServerM from "mongodb-memory-server";
import mongoose from "mongoose";
import DatabaseHandler from "../data/DatabaseHandler.mjs";
import Stock from "../factory/Stock.mjs";
import OrderStatus from "../constants.mjs";

var cut, mongoServer, OrderModel, callTracker;
beforeEach(async () => {
  callTracker = new assert.CallTracker();
  const { MongoMemoryServer } = MongoMemoryServerM;
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  cut = new DatabaseHandler();
  OrderModel = cut.getModel("Order");
});

afterEach(async () => {
  callTracker.verify();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("DatabaseHandler", function () {
  describe("isMaterialAvailable", function () {
    it("calls stock.containsMaterial() with the correct arguments", async function () {
      var order = new OrderModel();
      order.leftStack[0] = {
        height: 15,
        color: { name: "silber" },
      };
      order.leftStack[1] = {
        height: 15,
        color: { name: "silber" },
      };
      order.rightStack[0] = {
        height: 15,
        color: { name: "silber" },
      };
      order.rightStack[1] = {
        height: 18,
        color: { name: "blau" },
      };

      var stock = new Stock({});
      stock.containsMaterial = callTracker.calls((requirements) => {
        assert.strictEqual(
          JSON.stringify(requirements),
          JSON.stringify({
            "15mmSilver": 3,
            "18mmBlue": 1,
          })
        );
      }, 1);

      cut.isMaterialAvailable(order, stock);
    });

    it("returns correctly when stock is not available", async function () {
      var order = new OrderModel();
      order.leftStack[0] = {
        position: 0,
        height: 15,
        color: { r: 0, g: 0, b: 0, name: "silber" },
      };
      var actual = cut.isMaterialAvailable(
        order,
        Stock.fromDictionary({ productionStock15mmBlue: 1 })
      );
      assert.strictEqual(actual, false);
    });
  });

  describe("prepareNextOrder", function () {
    it("returns correctly with the next order", async function () {
      //setup database
      var order = new OrderModel();
      order.status = OrderStatus.PENDING;
      order.orderName = "order1";
      order.leftStack[0] = {
        height: 15,
        color: { name: "silber" },
      };
      await order.save();

      //execute
      var actual = await cut.getNextOrderFromStock(
        new Stock({ immediateStock15mmSilver: 1 })
      );
      assert.strictEqual(actual.orderName, order.orderName);
    });

    it("returns null when no next order is available", async function () {
      var actual = await cut.getNextOrderFromStock(
        new Stock({ immediateStock15mmSilver: 1 })
      );
      assert.strictEqual(actual, null);
    });
  });

  describe("setProducedOrderFinished", function () {
    it("changes OrderStatus to finished and calls provided callback once", async function () {
      //setup database
      var order = new OrderModel();
      order.status = OrderStatus.IN_PRODUCTION;
      order.orderName = "order1";
      await order.save();

      var actual = await cut.setProducedOrderFinished();

      assert.strictEqual(actual.orderName, order.orderName);
      assert.strictEqual(actual.status, OrderStatus.FINISHED);
    });

    it("calls provided callback", async function () {});
  });
});
