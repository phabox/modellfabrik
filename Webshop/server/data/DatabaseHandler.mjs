import OrderStatus from "../constants.mjs";
import OrderSchema from "./OrderSchema.mjs";
import mongoose from "mongoose";

export default class DatabaseHandler {
  constructor() {
    //singleton pattern so we only have one instance of this class during runtime
    if (DatabaseHandler._instance) {
      return DatabaseHandler._instance;
    }
    DatabaseHandler._instance = this;

    this.createModels();
  }

  /**
   * Creates all necessary database models
   * The connection to the mongodb should exist before executing this function
   */
  createModels() {
    this.models = {};
    this.models["Order"] = mongoose.model("Order", OrderSchema, "orders");
  }

  /**
   * Returns a mongoose model with a given name to interact with the database
   * @param name The model name
   */
  getModel(name) {
    return this.models[name];
  }

  /**
   * Transform the order of the GraphQL query and checks if all necessary cylinders are available in the stock
   * @param order The placed order containing the necessary cylinders
   * @param stock The stock containing the available cylinders
   * 
   * @returns true, if the stock contains enough cylinders for the order, false otherwise
   */
  isMaterialAvailable(order, stock) {
    var materialRequirements = {};
    order.leftStack.concat(order.rightStack).forEach((cylinder) => {
      switch (cylinder.height) {
        case 15:
          if (cylinder.color.name == "silber") {
            materialRequirements["15mmSilver"] =
              ~~materialRequirements["15mmSilver"] + 1;
          } else {
            materialRequirements["15mmBlue"] =
              ~~materialRequirements["15mmBlue"] + 1;
          }
          break;
        case 18:
          if (cylinder.color.name == "silber") {
            materialRequirements["18mmSilver"] =
              ~~materialRequirements["18mmSilver"] + 1;
          } else {
            materialRequirements["18mmBlue"] =
              ~~materialRequirements["18mmBlue"] + 1;
          }
          break;
        case 22:
          if (cylinder.color.name == "silber") {
            materialRequirements["22mmSilver"] =
              ~~materialRequirements["22mmSilver"] + 1;
          } else {
            materialRequirements["22mmBlue"] =
              ~~materialRequirements["22mmBlue"] + 1;
          }
          break;
        default:
          throw "Unknown height";
      }
    });

    return stock.containsMaterial(materialRequirements);
  }

  /**
   * Gets the first order that can be produced
   * @param stock The stock containing the available cylinders
   * 
   * @returns The first stock that can be produced with the current cylinders in the stock
   */
  async getNextOrderFromStock(stock) {
    var pendingOrders = await this.models["Order"]
      .find({ status: OrderStatus.PENDING })
      .sort({ createdAt: "asc" })
      .exec();

    for (var i = 0; i < pendingOrders.length; i++) {
      if (this.isMaterialAvailable(pendingOrders[i], stock)) {
        return pendingOrders[i];
      }
    }

    return null;
  }

  /**
   * Changes the status of the order indicating that is is currently beeing produced.
   * @param order The order that is beeing produced
   */
  setOrderStateProduction(order) {
    order.status = OrderStatus.IN_PRODUCTION;
    return order.save();
  }

  /**
   * Checks if there is any order that is beeing produced at the moment
   */
  async orderIsInProduction() {
    return await this.models["Order"].exists({
      status: OrderStatus.IN_PRODUCTION,
    });
  }

  /**
   * Sets the currently produced order to a finished status.
   */
  async setProducedOrderFinished() {
    var doc = await this.models["Order"].findOneAndUpdate(
      { status: OrderStatus.IN_PRODUCTION },
      { status: OrderStatus.FINISHED },
      { new: true }
    );
    return doc;
  }
}
