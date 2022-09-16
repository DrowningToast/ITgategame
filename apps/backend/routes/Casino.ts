import express, { response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { stringify } from "querystring";
import ValidateJWT from "../helper/validateJWT";
import validateRole from "../helper/validateRole";
import DiscordUser from "../models/DiscordUser";
import HighLow from "../models/HighLow";
import User from "../models/User";

const casinoRouter = express.Router();

/**
 * @description Create a new highlow
 */
casinoRouter.post<
  "/highlow",
  {},
  {},
  {
    jwt: string;
  }
>("/highlow", async (req, res) => {
  try {
    const { creatorId, price, messageId } = (await ValidateJWT(
      req.body.jwt
    )) as {
      creatorId: string;
      price: number;
      messageId: string;
    };

    // Verify role
    const requester = await User.findOne({
      discordId: creatorId,
    });
    if (requester?.role !== "Agency")
      return res.status(401).send("Insufficient permission");

    if (
      await HighLow.findOne({
        onGoing: true,
      })
    )
      return res.status(400).send("There is already an ongoing game");

    const instance = new HighLow({
      owner: creatorId,
      price,
      messageId,
      onGoing: true,
      joined: 0,
    });

    await instance.save();

    res.send(instance);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

/**
 * @description Player joins the HIGHLOW game
 */
casinoRouter.patch<
  "/highlow/join",
  {},
  {},
  {
    jwt: string;
  }
>("/highlow/join", async (req, res) => {
  const { side, requesterId } = (await ValidateJWT(req.body.jwt)) as {
    side: string;
    requesterId: string;
  };

  const instance = await HighLow.findOne({
    onGoing: true,
  });

  if (!instance) {
    return res.status(404).send("There is no ongoing game");
  }

  // Check if already joined
  // @ts-ignore
  if (instance.high.includes(requesterId) || instance.low.includes(requesterId))
    return res.status(400).send("Already joined");

  //@ts-ignore
  if (side !== "HIGH" && side !== "LOW" && side !== "CENTER") {
    return res.status(400).send("Invalid bet side");
  }

  // Money and user validation check
  const user =
    (await User.findOne({ discordId: requesterId }).select("balance")) ??
    (await DiscordUser.findOne({ discordId: requesterId }).select("balance"));
  if (!user) {
    return res
      .status(404)
      .send("User not found, try /wallet to generate a new one");
  } else if (user.balance < instance.price || user.balance <= 0) {
    return res.status(400).send("Insufficient balance");
  }

  // Deduct the cost of the game
  if (await User.findOne({ discordId: requesterId })) {
    await User.findOneAndUpdate(
      {
        discordId: requesterId,
      },
      {
        $inc: {
          balance: +instance?.price * -1,
        },
      }
    );
  } else if (
    await DiscordUser.findOne({
      discordId: requesterId,
    })
  ) {
    await DiscordUser.findOneAndUpdate(
      {
        discordId: requesterId,
      },
      {
        $inc: {
          balance: +instance?.price * -1,
        },
      }
    );
  } else {
    // Requester not found
    return res.status(404).send("Requester not found");
  }

  if (side === "HIGH") {
    const response = await HighLow.findOneAndUpdate(
      {
        onGoing: true,
      },
      {
        $push: {
          high: requesterId,
        },
        $inc: {
          joined: 1,
        },
      }
    );
    if (!response) return res.status(404).send("There is no ongoing game");
    return res.status(200).send(response);
  } else if (side === "LOW") {
    const response = await HighLow.findOneAndUpdate(
      {
        onGoing: true,
      },
      {
        $push: {
          low: requesterId,
        },
        $inc: {
          joined: 1,
        },
      }
    );
    if (!response) return res.status(404).send("There is no ongoing game");
    return res.status(200).send(response);
  } else if (side === "CENTER") {
    const response = await HighLow.findOneAndUpdate(
      {
        onGoing: true,
      },
      {
        $push: {
          center: requesterId,
        },
        $inc: {
          joined: 1,
        },
      }
    );
    if (!response) return res.status(404).send("There is no ongoing game");
    return res.status(200).send(response);
  }
});

casinoRouter.patch<
  "/highlow/end",
  {},
  {},
  {
    jwt: string;
  }
>("/highlow/end", async (req, res) => {
  try {
    const { creatorId, side } = (await ValidateJWT(req.body.jwt)) as {
      creatorId: string;
      side: "HIGH" | "LOW" | "CENTER";
    };

    // Verify role
    const requester = await User.findOne({
      discordId: creatorId,
    });
    if (requester?.role !== "Agency")
      return res.status(401).send("Insufficient permission");

    const instance = await HighLow.findOneAndUpdate(
      {
        onGoing: true,
      },
      {
        onGoing: false,
      }
    );

    if (!instance) return res.status(400).send("There is no ongoing game!");

    const winners =
      side === "HIGH"
        ? instance?.high
        : side === "CENTER"
        ? instance.center
        : instance?.low;
    const losers =
      side === "HIGH"
        ? instance?.low
        : side === "CENTER"
        ? [...instance?.high, ...instance?.low]
        : [...instance?.high, ...instance?.center];

    // Update winners
    const results = await User.updateMany(
      {
        discordId: {
          $in: winners,
        },
      },
      {
        $inc: {
          balance: instance.price * (side === "CENTER" ? 9 : 2),
        },
      }
    );

    res.status(200).send({
      instance,
      results,
      winners,
      losers,
    });
  } catch (e) {
    console.log("Error");
    console.log(e);
    res.status(500).send(e);
  }
});

export default casinoRouter;
