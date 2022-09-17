import express from "express";
import EncodeObject from "../helper/encode";
import validateRole from "../helper/validateRole";
import Fibbage from "../models/Fibbage/Fibbage";
import User from "../models/User";
import { sendWSData } from "../websocket/sendWSData";

const fibbageRouter = express.Router();

// Get the current stage of the game
fibbageRouter.get("/", async (req, res) => {
  try {
    const user = await validateRole(req?.currentUser);

    // Check if there's a on going game
    const instance = await Fibbage.findOne({
      onGoing: true,
    });

    if (!instance) return res.sendStatus(404);

    let response: Object = {
      phase: instance?.phase,
      baseBet: instance?.baseBet,
      onGoing: instance?.onGoing,
    };
    switch (instance?.phase) {
      case "IDLE":
        response = {
          ...response,
        };
        break;
      case "PREGAME":
        response = {
          ...response,
          prompt: instance.prompt,
        };
      case "SUBMIT":
        response = {
          ...response,
          prompt: instance.prompt,
        };
      case "BET":
        response = {
          ...response,
          prompt: instance.prompt,
          choices: instance.choices,
        };
      case "REVEAL":
        response = {
          ...response,
          prompt: instance.prompt,
          choices: instance.choices,
          bets: [
            {
              owner: String,
              choice: String,
            },
          ],
        };
      case "END":
        response = {
          ...response,
          prompt: instance.prompt,
          choices: instance.choices,
          bets: [
            {
              owner: String,
              choice: String,
            },
          ],
          truth: instance.truth,
          decoy: instance.decoy,
        };
      default:
        break;
    }

    res.send(instance);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// Get the choices, only when the game is in bet phase
fibbageRouter.get("/choices", async (req, res) => {
  try {
    const user = await validateRole(req?.currentUser);

    // Check if there's a on going game
    const instance = await Fibbage.findOne({
      onGoing: true,
      phase: "BET",
    }).select("onGoing baseBet prompt phase choices");

    if (instance) res.sendStatus(404);
  } catch (e) {
    console.log(e);
  }
});

/**
 * @description Submit a choice
 */
fibbageRouter.post<
  "/submit",
  {},
  {},
  {
    choice: string;
  }
>("/submit", async (req, res) => {
  try {
    const user = await validateRole(req?.currentUser);

    const instance = await Fibbage.findOne({
      onGoing: true,
      phase: "SUBMIT",
    });

    if (!instance) return res.sendStatus(404);

    // Submit the answers
    // Check if already answered before
    if (instance.participants.find((par) => par.owner === user.uid)) {
      return res.status(400).send("ได้ส่้งคำตอบไปแล้ว");
    } else if (
      instance.choices.includes(req.body.choice) ||
      instance.decoy === req.body.choice
    ) {
      return res.status(400).send("ได้มีคนตอบคำตอบนี้ไปแล้ว");
    } else if (req.body.choice === instance.truth) {
      await Fibbage.findOneAndUpdate(
        {
          onGoing: true,
        },
        {
          $push: {
            fashTrackWinners: user.uid,
          },
        }
      );
      return res.status(200).send("Blindly guessed correctly");
    }

    // Submit to the pool
    await Fibbage.findOneAndUpdate(
      {
        onGoing: true,
      },
      {
        $push: {
          choices: req.body.choice,
          participants: {
            owner: user.uid,
            choice: req.body.choice,
          },
        },
      }
    );

    // Notify every users
    await sendWSData(
      null,
      JSON.stringify({
        jwt: await EncodeObject(req.body.choice),
      })
    );

    res.send(user);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

/**
 * @description Get all the choices, when starting the bet phase
 */
fibbageRouter.post<
  "/bet",
  {},
  {},
  {
    choice: string;
  }
>("/bet", async (req, res) => {
  try {
    const user = await validateRole(req?.currentUser);

    const instance = await Fibbage.findOne({
      onGoing: true,
      phase: "BET",
    });

    if (!instance) return res.sendStatus(404);
    if (!req.body.choice) return res.status(400).send("No choice detected");

    // Check if already make a bet or not
    if (instance.bets.find((bet) => bet.owner === user.uid))
      return res.status(400).send("Already make a bet");

    // Check if already the fast track winner
    if (instance.fastTrackWinners.includes(user.uid))
      return res.status(400).send("Already a winner");

    // Check balance
    if (user.balance < instance.baseBet)
      return res.status(400).send("Insufficient balance");

    // Check if valid choice
    if (!instance.approvedChoices.includes(req.body.choice))
      return res.status(400).send("Invalid choice");

    // Check if answer one's own answer
    instance.participants.forEach((par) => {
      if (par.choice === req.body.choice && par.owner === user.uid)
        throw new Error("You can't answer your own answer");
    });

    // Deduct the balance
    const resultUser = await User.findOneAndUpdate({
      uid: user.uid,
      $inc: {
        balance: instance.baseBet * -1,
      },
    });

    // Add user to the bet pool
    const resultInstance = await Fibbage.findOneAndUpdate(
      {
        onGoing: true,
      },
      {
        $push: {
          bets: {
            owner: user.uid,
            choice: req.body.choice,
          },
        },
        $inc: {
          totalBet: 1,
        },
      }
    ).select("onGoing baseBet bets prompt phase approvedChoices totalBet");

    // Notify every users
    await sendWSData(
      null,
      JSON.stringify({
        jwt: await EncodeObject(req.body.choice),
      })
    );

    res.send({});
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

// ADMIN ONLY
// ADMIN ONLY
// ADMIN ONLY

fibbageRouter.post<
  "/new",
  {},
  {},
  {
    bet: number;
    prompt: string;
    truth: string;
    decoy: string;
  }
>("/new", async (req, res) => {
  try {
    const user = await validateRole(req?.currentUser, ["Agency"]);

    const instance = await Fibbage.findOne({
      onGoing: true,
    });

    if (instance) return res.sendStatus(404);

    const fibbage = new Fibbage({
      onGoing: true,
      baseBet: req.body.bet,
      prompt: req.body.prompt,
      phase: "IDLE",
      truth: req.body.truth,
      decoy: req.body.decoy,
    });

    await fibbage.save();

    // Notify every users
    await sendWSData(
      null,
      JSON.stringify({
        phase: fibbage.phase,
      })
    );

    return res.status(200).send(fibbage);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

/**
 * @description Continue the phase
 */
fibbageRouter.patch<
  "/continue",
  {},
  {},
  { phase: "PREGAME" | "SUBMIT" | "BET" | "REVEAL" | "END"; choices?: string[] }
>("/continue", async (req, res) => {
  try {
    const user = await validateRole(req?.currentUser, ["Agency"]);

    const instance = await Fibbage.findOne({
      onGoing: true,
    });

    if (!instance) return res.sendStatus(404);

    const phase = req.body.phase;

    if (phase === "PREGAME") {
      await Fibbage.findOneAndUpdate(
        {
          onGoing: true,
        },
        {
          phase,
        }
      );
    } else if (phase === "SUBMIT") {
      await Fibbage.findOneAndUpdate(
        {
          onGoing: true,
        },
        {
          phase,
        }
      );
    } else if (phase === "BET") {
      /**
       * Choose choices to approve
       */
      console.log(req.body.choices);

      // check if already approved
      if (instance.approvedChoices.length)
        return res.status(400).send("Already approved for this game");
      if (!req.body.choices?.length)
        return res.status(400).send("No choice detected");

      // Check for invalid choices
      const check = req.body.choices.filter(
        (choice) => !instance.choices.includes(choice)
      );
      if (check.length) return res.status(400).send("Invalid choice");

      // Check for invalid length
      if (req.body.choices.length > 7)
        return res.status(400).send("approved choices should be more than 7");

      // Push the approved choices
      const result = await Fibbage.findOneAndUpdate(
        {
          onGoing: true,
        },
        {
          approvedChoices: [
            ...req.body.choices,
            instance.truth,
            instance.decoy,
          ],
          phase: "BET",
        }
      );
    } else if (phase === "REVEAL") {
      await Fibbage.findOneAndUpdate(
        {
          onGoing: true,
        },
        {
          phase,
        }
      );
    } else if (phase === "END") {
      // Rewards
      // Guess correctly
      const winnerIds = instance.bets.filter(
        (bet) => bet.choice === instance.truth
      );
      // Fast track
      const fastTrackIds = instance.fastTrackWinners;

      // Reward the corrects
      await User.updateMany(
        {
          discordId: {
            $in: winnerIds,
          },
        },
        {
          $inc: {
            balance: instance.baseBet * 5,
          },
        }
      );
      // Reward fast track
      await User.updateMany(
        {
          discordId: {
            $in: fastTrackIds,
          },
        },
        {
          $inc: {
            balance: instance.baseBet * 5,
          },
        }
      );

      // Fool reward, filter out the winners
      const remainingBets = instance.bets.filter(
        (bet) => bet.choice !== instance.truth
      );

      await Promise.all(
        instance.participants.map(async (par) => {
          const preys = remainingBets.filter(
            (bet) => bet.choice === par.choice
          );
          // Award
          await User.updateOne(
            {
              uid: par.owner,
            },
            {
              $inc: {
                balance: instance.baseBet * preys.length,
              },
            }
          );
          // Deduct
          await User.updateMany(
            {
              uid: {
                $in: preys,
              },
            },
            {
              $inc: {
                balance: instance.baseBet * -preys.length,
              },
            }
          );
        })
      );

      // End the game
      await Fibbage.findOneAndUpdate(
        {
          onGoing: true,
        },
        {
          phase,
          onGoing: false,
        }
      );
    }

    console.log(
      JSON.stringify({
        phase,
      })
    );

    // Notify every users
    await sendWSData(
      null,
      JSON.stringify({
        phase,
      })
    );

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

fibbageRouter.get("/sudo", async (req, res) => {
  try {
    const user = await validateRole(req?.currentUser, ["Agency"]);

    const instance = await Fibbage.findOne({
      onGoing: true,
    });

    if (!instance) return res.sendStatus(404);

    return res.status(200).send(instance);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

export default fibbageRouter;
