import SPSCommunicator from "./SPSCommunicator.mjs";

import {
  DB_VARIABLES_PRODUCTION,
  READ_VARIABLES_PRODUCTION,
  WRITE_VARIABLES_PRODUCTION,
} from "./DatablockProductionSPS.mjs";
import {
  DB_VARIABLES_STORAGE,
  READ_VARIABLES_STORAGE,
} from "./DatablockStorageSPS.mjs";

export default class SPSHandler {
  constructor(
    productionSPS = new SPSCommunicator(
      process.env.SPS_IP_PRODUCTION,
      DB_VARIABLES_PRODUCTION,
      READ_VARIABLES_PRODUCTION
    ),
    storageSPS = new SPSCommunicator(
      process.env.SPS_IP_STORAGE,
      DB_VARIABLES_STORAGE,
      READ_VARIABLES_STORAGE
    )
  ) {
    //singleton pattern so we only have one instance of this class during runtime
    if (SPSHandler._instance) {
      return SPSHandler._instance;
    }
    SPSHandler._instance = this;

    this.productionSPS = productionSPS;
    this.storageSPS = storageSPS;
    this.id = 0;
    this.allReadItems = {};
    for (const key of READ_VARIABLES_PRODUCTION) {
      this.allReadItems[key] = 0;
    }
    for (const key of READ_VARIABLES_STORAGE) {
      this.allReadItems[key] = 0;
    }
  }

  /**
   * Transforms the stack of cylinders to an array suitable to be written into the sps
   * @param cylinderStack The cylinder stack
   * @returns Object[] - The transformed array of cylinder objects
   */
  stackToArray(cylinderStack) {
    var result = [];

    cylinderStack.forEach((cylinder) => {
      var heightWithColor = cylinder.height;
      //set highest height bit when cylinder blue
      if (cylinder.color.name == "blau") {
        heightWithColor += 128;
      }

      result.push(heightWithColor);
    });

    //the datablock in the sps expects 5 cylinders so the remaining entries are set to 0
    while (result.length < 5) {
      result.push(0);
    }
    return result;
  }

  /**
   * Writes an order into the sps.
   * @param order The order to be written
   */
  submitOrder(order) {
    this.id++;
    var left = this.stackToArray(order.leftStack);
    var right = this.stackToArray(order.rightStack);
    var values = [this.id, false, order.orderName].concat(left, right);
    this.productionSPS.writeItems(WRITE_VARIABLES_PRODUCTION, values);
  }

  /**
   * Reads all values from the production sps and the storage sps.
   * @returns {Object} - Object containing the production items and the current stock
   */
  async readAllSPS() {
    var productionItems, storageItems;

    try {
      productionItems = await this.productionSPS.readAllItems();
    } catch (e) {
      console.error(e);
      productionItems = {};
    }

    try {
      storageItems = await this.storageSPS.readAllItems();
    } catch (e) {
      console.error(e);
      storageItems = {};
    }

    for (const [key, value] of Object.entries(productionItems)) {
      this.allReadItems[key] = value;
    }

    for (const [key, value] of Object.entries(storageItems)) {
      this.allReadItems[key] = value;
    }

    return this.allReadItems;
  }
}
