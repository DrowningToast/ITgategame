import mongoose from "mongoose";
import dotenv from "dotenv";
import { Express } from "express-serve-static-core/index";

dotenv.config();

const useMongoose = async (req, res, next) => {
  if (mongoose.connections[0].readyState) {
    return next();
  }
  try {
    console.log("Connecting to the database");
    await mongoose.connect(
      `mongodb+srv://${process.env.db_username}:${process.env.db_password}@itggmongodb.ppba9ee.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Database connected");
    next();
  } catch (e) {
    console.log("The database is failed to connect");
    console.log(e);
  }
};

let connection;

const connectDB = async (App: Express) => {
  console.log("conecting");
  try {
    console.log(mongoose.connection[0]);
    connection = await mongoose.connect(
      `mongodb+srv://${process.env.db_username}:${process.env.db_password}@itggmongodb.ppba9ee.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("Connected to the server");
    return App;
  } catch (e) {
    console.error("Could not connect to MongoDB...");
    throw e;
  }
};

function getDBConnection() {
  return connection;
}

export default useMongoose;
export { connectDB, getDBConnection };
