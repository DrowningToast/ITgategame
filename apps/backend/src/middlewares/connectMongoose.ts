import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const useMongoose = async (req, res, next) => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.db_admin}:${process.env.db_password}@itggmongodb.ppba9ee.mongodb.net/?retryWrites=true&w=majority`
    );
    next();
  } catch (e) {
    console.log(e);
  }
};

export default useMongoose;
