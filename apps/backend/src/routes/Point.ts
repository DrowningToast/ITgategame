import express from "express";
import validateRole from "../helper/validateRole";
import Gate from "../models/Gate";
import User from "../models/User";

const pointRouter = express.Router();

/**
 * Get points of all teams
 */
pointRouter.get("/teams", async (req, res) => {
  try {
    await validateRole(req?.currentUser);

    const gates = await Gate.find({});

    return res.status(200).send(gates);
  } catch (e) {
    return res.status(500).send("Something went wrong");
  }
});

/**
 * @description Compute total score of every gate
 */
pointRouter.get("/compute", async (req, res) => {
  try {
    await validateRole(req?.currentUser);

    const ANDusers = await User.find({
      gate: "AND",
    });
    const ORusers = await User.find({
      gate: "OR",
    });
    const NORusers = await User.find({
      gate: "NOR",
    });
    const NOTusers = await User.find({
      gate: "NOT",
    });

    const ANDtotal = ANDusers.reduce((total, user) => {
      return total + user.balance;
    }, 0);
    const ORtotal = ORusers.reduce((total, user) => {
      return total + user.balance;
    }, 0);
    const NORtotal = NORusers.reduce((total, user) => {
      return total + user.balance;
    }, 0);
    const NOTtotal = NOTusers.reduce((total, user) => {
      return total + user.balance;
    }, 0);

    const ANDgate = await Gate.findOneAndUpdate(
      {
        _id: "AND",
      },
      {
        totalPoints: ANDtotal,
      }
    );
    const ORgate = await Gate.findOneAndUpdate(
      {
        _id: "OR",
      },
      {
        totalPoints: ORtotal,
      }
    );
    const NORgate = await Gate.findOneAndUpdate(
      {
        _id: "NOR",
      },
      {
        totalPoints: NORtotal,
      }
    );
    const NOTgate = await Gate.findOneAndUpdate(
      {
        _id: "NOT",
      },
      {
        totalPoints: NOTtotal,
      }
    );

    res.status(200).send({ ANDgate, ORgate, NORgate, NOTgate });
  } catch (e) {
    res.status(500).send("AN error has occured");
  }
});

/**
 * @description Change a user points
 */
pointRouter.post<
  "/set/:uid",
  { uid: string },
  any,
  {
    value: number;
  }
>("/set/:uid", async (req, res) => {
  try {
    const requester = await validateRole(req?.currentUser, ["Agency"]);

    const response = await User.findOneAndUpdate(
      {
        uid: req.params.uid,
      },
      {
        $inc: {
          balance: req.body.value,
        },
      }
    );

    return res.status(200).send(JSON.parse(JSON.stringify(response)));
  } catch (e) {
    res.status(500).send("An error has occured");
  }
});

/**
 * @description Adjust a user value incrementally
 */
pointRouter.post<
  "/incremental/:uid",
  { uid: string },
  {},
  {
    value: number;
  }
>("/incremental/:uid", async (req, res) => {
  try {
    const requester = await validateRole(req?.currentUser, ["Agency"]);

    const response = await User.findOneAndUpdate(
      {
        uid: req.params.uid,
      },
      {
        $inc: {
          balance: req.body.value,
        },
      }
    );

    return res.status(200).send(JSON.parse(JSON.stringify(response)));
  } catch (e) {
    res.status(500).send("An error has occured");
  }
});
