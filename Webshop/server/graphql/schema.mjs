import gqlm from "apollo-server-express";
//need to assign to variable because es6 is not supported by this module
const { gql } = gqlm;

export default gql`
  input CylinderInput {
    position: Int
    height: Int
    color: ColorInput
  }

  input ColorInput {
    r: Float
    g: Float
    b: Float
    name: String
  }

  input ProductionOrder {
    orderName: String
    leftStack: [CylinderInput]
    rightStack: [CylinderInput]
  }

  type ProduceCylinderOutput {
    code: Int
    msg: String
  }

  type Mutation {
    produce(order: ProductionOrder): ProduceCylinderOutput
  }

  type Color {
    r: Float
    g: Float
    b: Float
    name: String
  }

  type CylinderOptions {
    height: Int
    colors: [Color]
  }

  type Settings {
    cylinders: [CylinderOptions]
    maxHeight: Int
    maxCylinders: Int
  }

  type Cylinder {
    position: Int
    height: Int
    color: Color
  }

  type Order {
    _id: ID
    leftStack: [Cylinder]
    rightStack: [Cylinder]
    status: String
    createdAt: String
    updatedAt: String
    orderName: String
  }

  type StockItem {
    height: Int
    color: String
    available: Int
  }

  type Stock {
    immediateStock: [StockItem]
    intermediateStock: [StockItem]
  }

  type Query {
    settings: Settings
    orders(page: Int, limit: Int): [Order]
    stock: Stock
  }

  type Subscription {
    orderCreated: Order
    orderChanged: Order
    stockChanged: Stock
  }
`;
