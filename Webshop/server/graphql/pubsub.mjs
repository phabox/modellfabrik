import PubSubM from "apollo-server-express";
//need to assign to variable because es6 is not supported by this module
const { PubSub } = PubSubM;

const pubsub = new PubSub();
const ORDER_CREATED = "ORDER_CREATED";
const ORDER_CHANGED = "ORDER_CHANGED";
const STOCK_CHANGED = "STOCK_CHANGED";

export { pubsub, ORDER_CREATED, ORDER_CHANGED, STOCK_CHANGED };
