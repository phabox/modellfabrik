import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

/**
 * The schema of an order. This schema simplifies inserting, deleting and modifying documents in the database
 */
var orderSchema = new mongoose.Schema(
  {
    leftStack: [
      {
        position: Number,
        height: Number,
        color: {
          r: Number,
          g: Number,
          b: Number,
          name: String,
        },
      },
    ],
    rightStack: [
      {
        position: Number,
        height: Number,
        color: {
          r: Number,
          g: Number,
          b: Number,
          name: String,
        },
      },
    ],
    status: String,
    orderName: String,
  },
  { timestamps: true }
);
orderSchema.plugin(aggregatePaginate);
export default orderSchema;
