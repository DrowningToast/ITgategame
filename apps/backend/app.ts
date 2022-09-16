import express from "express";
import validateAuth from "./middlewares/validateAuth";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import Cors from "cors";
import userRouter from "./routes/Users";
import pointRouter from "./routes/Point";
import useMongoose from "./middlewares/connectMongoose";
import Gate from "./models/Gate";
import transactionRouter from "./routes/Transactions";
import discordRouter from "./routes/Discord";
import casinoRouter from "./routes/Casino";

const app = express();

app.use(useMongoose);

declare global {
  namespace Express {
    interface Request {
      currentUser?: DecodedIdToken;
    }
  }
}

app.use(express.json());
app.use(validateAuth);
app.use(Cors());
// app.use(morgan("dev"));

app.use("/users", userRouter);
app.use("/point", pointRouter);
app.use("/transactions", transactionRouter);
app.use("/discord", discordRouter);
app.use("/casino", casinoRouter);

app.get("/", (req, res, next) => {
  try {
    return res.status(200).json({
      message: "Hello world from root!!!!!!",
    });
  } catch (e) {
    return res.status(500).send(e);
  }
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: `Hello from path! bruh ${req?.currentUser?.email}`,
  });
});

export default app;
