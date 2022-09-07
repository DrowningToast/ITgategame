import express from "express";
import { Schema, Types } from "mongoose";
import validateRole from "../helper/validateRole";
import Transaction from "../models/Transaction";

const transactionRouter = express.Router();

transactionRouter.get("/", async (req, res) => {
  try {
    const user = await validateRole(req.currentUser);

    const transactions = await Transaction.find({
      target: user._id,
    });
    res.status(200).send(transactions);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

export default transactionRouter;
