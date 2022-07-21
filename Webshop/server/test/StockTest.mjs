import assert from "assert";
import Stock from "../factory/Stock.mjs";

describe("Stock", function () {
  describe("containsMaterial", function () {
    it("returns true when requirements are immediately available", async function () {
      var stock = Stock.fromDictionary({ productionStock15mmSilver: 1 });
      var requirements = { "15mmSilver": 1 };
      var actual = stock.containsMaterial(requirements);
      assert.strictEqual(actual, true);
    });

    it("returns false when stock is empty", async function () {
      var stock = new Stock();
      var requirements = { "15mmSilver": 1 };
      var actual = stock.containsMaterial(requirements);
      assert.strictEqual(actual, false);
    });

    it("returns true when requirements are intermediately available", async function () {
      var stock = Stock.fromDictionary({ storageStock15mmSilver: 1 });
      var requirements = { "15mmSilver": 1 };
      var actual = stock.containsMaterial(requirements);
      assert.strictEqual(actual, true);
    });

    it("returns true when requirements are available when combining immediate and intermediate stocks", async function () {
      var stock = Stock.fromDictionary({
        productionStock15mmSilver: 1,
        storageStock15mmSilver: 1,
      });
      var requirements = { "15mmSilver": 2 };
      var actual = stock.containsMaterial(requirements);
      assert.strictEqual(actual, true);
    });

    it("returns false when only wrong color is in stock", async function () {
      var stock = Stock.fromDictionary({
        productionStock15mmBlue: 1,
      });
      var requirements = { "15mmSilver": 1 };
      var actual = stock.containsMaterial(requirements);
      assert.strictEqual(actual, false);
    });

    it("returns false when only wrong height is in stock", async function () {
      var stock = Stock.fromDictionary({
        productionStock18mmSilver: 1,
      });
      var requirements = { "15mmSilver": 1 };
      var actual = stock.containsMaterial(requirements);
      assert.strictEqual(actual, false);
    });
  });

  describe("constructor", function () {
    it("named parameters work when giving the individual params", async function () {
      var stock = new Stock(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
      assert.strictEqual(stock.immediateStock15mmSilver, 1);
      assert.strictEqual(stock.immediateStock15mmBlue, 2);
    });

    it("named parameters work when giving only a single param", async function () {
      var stock = Stock.fromDictionary({ productionStock15mmBlue: 1 });
      assert.strictEqual(stock.immediateStock15mmBlue, 1);
    });
  });
});
