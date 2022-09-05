import express, { Request } from "express";
import validateRole from "../helper/validateRole";
import Gate from "../models/Gate";
import User from "../models/User";

const pointRouter = express.Router();

/**
 * Get points of all teams, ascending
 */
pointRouter.get("/teams", async (req, res) => {
  try {
    await validateRole(req?.currentUser);

    const gates = await Gate.find({}).sort({
      totalPoints: -1,
      basePoints: -1,
    });

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
    // await validateRole(req?.currentUser);
    /**
     * TODO:
     * Find the MVPs of the gates
     */

    const ANDusers = await User.find({
      gate: "AND",
      activated: true,
    });
    const ORusers = await User.find({
      gate: "OR",
      activated: true,
    });
    const NORusers = await User.find({
      gate: "NOR",
      activated: true,
    });
    const NOTusers = await User.find({
      gate: "NOT",
      activated: true,
    });
    // const AndScore = await Gate.findById('And')
    const AndScore = (await Gate.findById("AND"))?.basePoints;
    const ORScore = (await Gate.findById("OR"))?.basePoints;
    const NORScore = (await Gate.findById("NOR"))?.basePoints;
    const NOTScore = (await Gate.findById("NOT"))?.basePoints;

    const ANDtotal =
      ANDusers.reduce((total, user) => {
        return total + user.balance;
      }, 0) + AndScore!;
    const ORtotal =
      ORusers.reduce((total, user) => {
        return total + user.balance;
      }, 0) + ORScore!;
    const NORtotal =
      NORusers.reduce((total, user) => {
        return total + user.balance;
      }, 0) + NORScore!;
    const NOTtotal =
      NOTusers.reduce((total, user) => {
        return total + user.balance;
      }, 0) + NOTScore!;

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
    console.log(e);
    res.status(501).send("AN error has occured");
  }
});

pointRouter.get("/:uid", async (req, res) => {
  try {
    const incomingRequestAuth = await validateRole(req?.currentUser);

    const target = await User.findOne({
      uid: req.params.uid,
    });

    if (incomingRequestAuth.uid !== target?.uid) {
      // The requested user mismatch the user the credentials
      // Check for agency pivilledge
      if (incomingRequestAuth.role !== "Agency") {
        return res.status(401).send("Unauthorized");
      }
    }

    return res.status(200).send(target?.balance);
  } catch (e) {}
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

export default pointRouter;
