import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const useMongoose = async (req, res, next) => {
  if (mongoose.connections[0].readyState) {
    return next();
  }
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.db_username}:${process.env.db_password}@itggmongodb.ppba9ee.mongodb.net/?retryWrites=true&w=majority`
    );
    next();
  } catch (e) {
    console.log(e);
  }
};

export default useMongoose;
