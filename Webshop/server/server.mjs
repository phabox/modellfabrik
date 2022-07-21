import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ApolloServerM from "apollo-server-express";
const { ApolloServer } = ApolloServerM;

// Own classes
import resolvers from "./graphql/resolvers.mjs";
import schema from "./graphql/schema.mjs";
import OrderManager from "./OrderManager.mjs";

// Load config from .env file
const result = dotenv.config();
if (result.error) {
  throw result.error;
}

// Connect to db
const uri = process.env.DB_URL;
mongoose
  .connect(uri, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    authSource: "admin",
    autoIndex: true,
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000,
    useFindAndModify: false,
  })
  .catch((error) => console.log(error));
const connection = mongoose.connection;

connection.on("error", (err) => {
  console.log(err);
});
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

// Create express app
const app = express();

app.use(cors());

// Install GraphQL middleware
const server = new ApolloServer({ typeDefs: schema, resolvers: resolvers, playground: true, introspection: true});
server.applyMiddleware({
  app,
});
var port = process.env.PORT || 3000;
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// Start the server
httpServer.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
  console.log(
    `Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
  );
});

// Start business logic
var orderManager = new OrderManager();
export default orderManager;