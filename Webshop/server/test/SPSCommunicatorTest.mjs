import SPSCommunicator from "../factory/SPSCommunicator.mjs";
import assert from "assert";

describe("SPSCommunicator", function () {
  describe("readValues", function () {
    const content = [1, 2, 3];
    const Nodes7Mock = class {
      constructor() {}
      initiateConnection(dict, connectedCallback) {}

      setTranslationCB(tranlationFunction) {}

      addItems(items) {}

      readAllItems(callback) {
        callback(null, content);
      }
    };
    const cut = new SPSCommunicator("0.0.0.0", {}, {}, new Nodes7Mock());
    cut.connectedCallback();

    it("should return the read items", async function () {
      var actual = await cut.readAllItems();
      assert.strictEqual(actual, content);
    });
  });
});
