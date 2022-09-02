import express, { Router } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import validateRole, { validateRoleError } from "../helper/validateRole";
import Transaction from "../models/Transaction";
import User from "../models/User";

const userRouter = express.Router();

/**
 * @path /user/all
 * @perm Agency
 * @description Get all users information
 */
userRouter.get("/all", async (req, res) => {
  try {
    await validateRole(req.currentUser, ["Agency"]);

    const users = await User.find({});

    return res.status(200).send(users);
  } catch (e) {
    res.status(401).send(e);
  }
});

/**
 * @path /user/:uid
 * @param Agency
 * @description Get user of specific uid
 * @param
 */
userRouter.get<{ uid: string }>("/:uid", async (req, res) => {
  try {
    await validateRole(req?.currentUser, ["Agency"]);

    const user = await User.find({
      uid: req.params.uid,
    });

    return res.status(200).send(user);
  } catch (e) {
    return res.status(e?.code).send(e.message);
  }
});

/**
 * @description Get information about self account
 * @path /user/
 */
userRouter.get("/", async (req, res) => {
  try {
    const user = await validateRole(req.currentUser);

    const _ = await User.findOne({
      uid: user.uid,
    });

    return res.status(200).send(_);
  } catch (e) {
    res.status(e.code ?? 500).send(e);
  }
});

/**
 * @description Create a user that never exists before
 * @path /user/
 */
userRouter.post("/", async (req, res) => {
  try {
    let user = (await validateRole(req.currentUser)) as DecodedIdToken;
    if (user?._id)
      return res.status(401).send("The user already exists in the database");

    const _ = new User({
      uid: user.uid,
      email: user.email,
      id: user.email?.split("@")[0],
      year:
        parseInt(
          `${user.email?.split("@")[0][0]}${user.email?.split("@")[0][1]}`
        ) - 45,
    });

    const response = await _.save();
    res.send(response);
  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * @description Verify the user gate
 */
userRouter.post<
  "/verify",
  {},
  any,
  {
    gate: "AND" | "OR" | "NOR" | "NOT";
    userName: string;
    firstName: string;
    lastName: string;
  }
>("/verify", async (req, res) => {
  try {
    const user = await validateRole(req.currentUser);

    if (!user.activated)
      return res.status(400).send("The user has already verify");

    const response = await User.findOneAndUpdate(
      { uid: user.uid },
      {
        // First starting income
        balance: 50,
        activated: true,
        gate: req.body.gate,
        username: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      }
    );

    // Save a new transaction

    const transaction = new Transaction({
      target: response?._id,
      value: 50,
      type: "New",
    });

    await transaction.save();

    res.send(response);
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
});

/**
 * @description Edit user data
 */
userRouter.patch<
  "/",
  {},
  {},
  {
    gate: "AND" | "OR" | "NOR" | "NOT";
    userName: string;
    firstName: string;
    lastName: string;
  }
>("/", async (req, res) => {
  try {
    const requester = await validateRole(req.currentUser);

    const response = await User.findOneAndUpdate(
      {
        uid: requester.uid,
        activated: true,
      },
      {
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      }
    );

    return res.status(200).send({ ...response });
  } catch (e) {
    res.status(500).send("Something went wrong");
  }
});

export default userRouter;
