import { NextPage } from "next";
import { motion } from "framer-motion";
import { GameState } from "../types";
import shuffle from "../../utils/Shuffle";
import Choice from "./Choice";

interface Props {
  gameState: GameState;
}

const LiveReveal: NextPage<Props> = ({ gameState }) => {
  const truth = gameState.truth;
  const decoy = gameState.decoy;
  const participants = gameState.participants;

  return (
    <div className="w-screen min-h-screen flex flex-col justify-around">
      <motion.div
        layout
        layoutId="banner"
        className="flex-col flex gap-y-4 text-center w-full py-16 px-4 bg-black border-b-8 border-purple-300"
      >
        <h1 className="font-noto font-medium text-white text-5xl">
          {gameState.prompt}
        </h1>
      </motion.div>
      <motion.div layout className="grid grid-cols-3 grid-rows-3 gap-4 px-12">
        {shuffle(gameState.approvedChoices!).map((choice) => (
          <Choice
            choice={choice}
            truth={truth === choice}
            source={
              participants?.find((par) => par.choice === choice)?.owner ?? null
            }
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LiveReveal;
