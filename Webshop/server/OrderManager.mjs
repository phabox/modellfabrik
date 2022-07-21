import SPSHandler from "./factory/SPSHandler.mjs";
import DatabaseHandler from "./data/DatabaseHandler.mjs";
import { pubsub, STOCK_CHANGED, ORDER_CHANGED } from "./graphql/pubsub.mjs";
import Stock from "./factory/Stock.mjs";

export default class OrderManager {
  constructor(
    spsHandler = new SPSHandler(),
    databaseHandler = new DatabaseHandler()
  ) {
    //singleton pattern so we only have one instance of this class during runtime
    if (OrderManager._instance) {
      return OrderManager._instance;
    }
    OrderManager._instance = this;

    this.spsHandler = spsHandler;
    this.databaseHandler = databaseHandler;

    var interval = process.env.SPS_POLLING_INTERVAL_MS
      ? process.env.SPS_POLLING_INTERVAL_MS
      : 10000;
    this.intervals = [];
    this.intervals.push(
      setInterval(async () => {
        var stock = await this.spsHandler.readAllSPS();
        this.handleStock(stock);
      }, interval)
    );
  }

  async handleStock(newValues) {
    //publish stock changes
    var newStock = Stock.fromDictionary(newValues);
    if (JSON.stringify(this.oldStock) != JSON.stringify(newStock)) {
      pubsub.publish(STOCK_CHANGED, { stockChanged: newStock });
    }

    //check if an order was completed
    if (
      (await this.databaseHandler.orderIsInProduction()) &&
      newValues.orderCompleted == true
    ) {
      var doc = await this.databaseHandler.setProducedOrderFinished();
      pubsub.publish(ORDER_CHANGED, { orderChanged: doc });
    }

    this.oldStock = newStock;
    this.oldValues = { ...newValues };
    //always try producing new order
    this.tryProduceOrder();
  }

  async tryProduceOrder() {
    //only one order can be produced at the same time
    if (await this.databaseHandler.orderIsInProduction()) return;

    //produce new order
    var nextOrder = await this.databaseHandler.getNextOrderFromStock(
      this.oldStock
    );
    if (nextOrder == null) return;
    this.spsHandler.submitOrder(nextOrder);
    this.databaseHandler.setOrderStateProduction(nextOrder).then((order) => {
      pubsub.publish(ORDER_CHANGED, { orderChanged: order });
    });
  }

  stopAll() {
    this.intervals.forEach((interval) => clearInterval(interval));
  }

  get stock() {
    return this.oldStock;
  }
}
