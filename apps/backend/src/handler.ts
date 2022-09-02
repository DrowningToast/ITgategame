import serverless from "serverless-http";
import express from "express";
import validateAuth from "./middlewares/validateAuth";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import Cors from "cors";
import useMongoose from "./middlewares/connectMongoose";
import userRouter from "../routes/User";

const app = express();

declare global {
  namespace Express {
    interface Request {
      currentUser?: DecodedIdToken;
    }
  }
}

app.use(express.json());
app.use(validateAuth);
app.use(
  Cors({
    methods: ["*"],
    origin: ["*"],
    optionsSuccessStatus: 200,
  })
);
app.use(useMongoose);

app.use("/user", userRouter);

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello world from root!!!!!!",
  });
});

app.get("/hello", (req, res, next) => {
  console.log("hello world");

  return res.status(200).json({
    message: `Hello from path! bruh ${req?.currentUser?.email}`,
  });
});

module.exports.handler = serverless(app);
