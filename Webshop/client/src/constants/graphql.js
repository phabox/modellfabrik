import gql from "graphql-tag";
/**
 * @module GraphQL
 * @category Constants
 */

/**
 * Query to fetch the cylinder-settings. The settings include information such as heights and colors of the cylinders.
 * @const {Object}
 */
export const GET_SETTINGS = gql`
  query settings {
    settings {
      cylinders {
        height
        colors {
          r
          g
          b
          name
        }
      }
      maxHeight
      maxCylinders
    }
  }
`;

/**
 * Query to fetch the amount of cylinders in the immediate and intermediate stock.
 * @const {Object}
 */
export const GET_STOCK = gql`
  query stock {
    stock {
      immediateStock {
        height
        color
        available
      }
      intermediateStock {
        height
        color
        available
      }
    }
  }
`;

/**
 * Query to fetch the previously placed orders. The papge and the number are orders are variable in order to fetch a certain subset of orders.
 * @const {Object}
 */
export const GET_ORDERS = gql`
  query orders($page: Int, $limit: Int) {
    orders(page: $page, limit: $limit) {
      _id
      leftStack {
        position
        height
        color {
          r
          g
          b
          name
        }
      }
      rightStack {
        position
        height
        color {
          r
          g
          b
          name
        }
      }
      orderName
      status
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mutation to produce a new item. The configured product is transmitted while return code and return message are fetched as a result.
 * @const {Object}
 */
export const PRODUCE_ITEM = gql`
  mutation produceItem($order: ProductionOrder!) {
    produce(order: $order) {
      code
      msg
    }
  }
`;

/**
 * Subscription that listens to newly created orders. When a new order was created, the subscription will listen for that new order.
 * @const {Object}
 */
export const ORDER_CREATED = gql`
  subscription orderCreated {
    orderCreated {
      _id
      leftStack {
        position
        height
        color {
          r
          g
          b
          name
        }
      }
      rightStack {
        position
        height
        color {
          r
          g
          b
          name
        }
      }
      orderName
      status
      createdAt
      updatedAt
    }
  }
`;

/**
 * Subscription that listens to changed orders. When a new order was changed, the subscription will listen for that changed order.
 * @const {Object}
 */
export const ORDER_CHANGED = gql`
  subscription orderChanged {
    orderChanged {
      _id
      leftStack {
        position
        height
        color {
          r
          g
          b
          name
        }
      }
      rightStack {
        position
        height
        color {
          r
          g
          b
          name
        }
      }
      orderName
      status
      createdAt
      updatedAt
    }
  }
`;

/**
 * Subscription that listens to changes at the stock. If cylinders are added or removed from the stock, the subscription will be notified about the stock changes and receive the new stock.
 * @const {Object}
 */
export const STOCK_CHANGED = gql`
  subscription stockChanged {
    stockChanged {
      immediateStock {
        height
        color
        available
      }
      intermediateStock {
        height
        color
        available
      }
    }
  }
`;
