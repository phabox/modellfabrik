import OrderManager from "../OrderManager.mjs";
import assert from "assert";
import { pubsub, STOCK_CHANGED } from "../graphql/pubsub.mjs";
import Stock from "../factory/Stock.mjs";

describe("OrderManager", function () {
  var cut, input, callTracker;

  beforeEach(function () {
    callTracker = new assert.CallTracker();
    cut = new OrderManager();
    cut.stopAll();

    input = {
      orderCompleted: false,
      productionStock15mmBlue: 1,
      productionStock15mmSilver: 2,
      productionStock18mmBlue: 3,
      productionStock18mmSilver: 4,
      productionStock22mmBlue: 5,
      productionStock22mmSilver: 6,
      storageStock15mmBlue: 7,
      storageStock15mmSilver: 8,
      storageStock18mmBlue: 9,
      storageStock18mmSilver: 10,
      storageStock22mmBlue: 11,
      storageStock22mmSilver: 12,
    };
  });

  afterEach(function () {
    callTracker.verify();
  });

  describe("doneReadingAllItemsCallback", function () {
    it("should publish new stack values", function () {
      //mock
      var callback = (event, values) => {
        assert.strictEqual(event, STOCK_CHANGED);
        assert.strictEqual(
          JSON.stringify(values.stockChanged),
          JSON.stringify(Stock.fromDictionary(input))
        );
      };
      pubsub.publish = callTracker.calls(callback, 1);
      cut.tryProduceOrder = () => {};

      cut.handleStock(input);
    });

    it("should publish when an order was completed", function () {
      //mock
      cut.databaseHandler.setProducedOrderFinished = callTracker.calls(1);
      cut.databaseHandler.orderIsInProduction = () => {
        return true;
      };
      cut.tryProduceOrder = () => {};

      cut.handleStock(input);
      var copy = {};
      Object.assign(copy, input);
      copy["orderCompleted"] = true;
      cut.handleStock(copy);
    });

    it("should detect when an order was not completed yet", function () {
      //mock
      cut.databaseHandler.setProducedOrderFinished = () => {
        assert.fail(
          "This function must not be called because order was not completed yet."
        );
      };
      cut.tryProduceOrder = () => {};

      cut.handleStock(input);
      cut.handleStock(input);
    });
  });
});
