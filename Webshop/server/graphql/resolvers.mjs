import settings from "../config.mjs";
import OrderStatus, { Pagination } from "../constants.mjs";
import {
  pubsub,
  ORDER_CREATED,
  ORDER_CHANGED,
  STOCK_CHANGED,
} from "./pubsub.mjs";
import OrderManager from "../OrderManager.mjs";

var orderManager;
var orderModel;
export default {
  Query: {
    /**
     * GraphQL query that returns the possible cylinder heights and the allowed configurations
     * @returns {Object} - The possible cylinder configuration
     */
    settings: () => settings,

    /**
     * Returns a page of orders. The page and the limit can be customized.
     * @param {Object} args - The pagination option.
     * @returns {Object[]} - Array of orders specified in the page options
     */
    async orders(parent, args, context, info) {
      if (!orderManager) {
        orderManager = new OrderManager();
        orderModel = orderManager.databaseHandler.getModel("Order");
      }
      var orderAggregate = orderModel.aggregate();
      const options = {
        page: args.page || Pagination.page,
        limit: args.limit || Pagination.limit,
        sort: { createdAt: "desc" },
      };
      return await orderModel.aggregatePaginate(orderAggregate, options)
        .then(function (result) {
          return result.docs;
        })
        .catch(function (err) {
          console.log(err);
          return null;
        });
    },

    /**
     * GraphQL query that returns the current items in the stock
     * @returns {Object} - Currently available cylinders in the stock
     */
    stock: () => {
      if (!orderManager) {
        orderManager = new OrderManager();
        orderModel = orderManager.databaseHandler.getModel("Order");
      }
      return orderManager.stock.transformStock();
    },
  },

  Mutation: {
    /**
     * Accepts an order and writes it to the database. If the order was sucessfully saved,
     * an event will be triggered to notify all clients about the new order
     * @param {Object} order - The cylinder configuration to be produced 
     */
    produce: async (_, { order }) => {
      order.status = OrderStatus.PENDING;
      return await new orderModel(order)
        .save()
        .then((order) => {
          pubsub.publish(ORDER_CREATED, { orderCreated: order });
          return { code: 0, msg: "Auftrag erfolgreich angelegt" };
        })
        .catch((error) => {
          return {
            code: 500,
            msg: "Auftrag konnte nicht angelegt werden: " + error,
          };
        });
    },
  },

  Subscription: {
    /**
     * Event that will notify all subscribed clients about newly created orders
     */
    orderCreated: {
      subscribe: () => pubsub.asyncIterator([ORDER_CREATED]),
    },

    /**
     * Event that will notify all subscribed clients about status changes on an order
     */
    orderChanged: {
      subscribe: () => pubsub.asyncIterator([ORDER_CHANGED]),
    },

    /**
     * Event that will notify all subscribed clients about a change in the stock items
     */
    stockChanged: {
      subscribe: () => pubsub.asyncIterator([STOCK_CHANGED]),
    },
  },
};
