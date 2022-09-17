import { NextPage } from "next";
import { motion } from "framer-motion";
import { GameState } from "../types";
import shuffle from "../../utils/Shuffle";

interface Props {
  gameState: GameState;
}

const LiveBet: NextPage<Props> = ({ gameState }) => {
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
      <motion.div layout className="grid grid-cols-3 grid-rows-3 gap-4 px-6">
        {shuffle(gameState.approvedChoices!).map((choice) => (
          <motion.div className="rounded-full py-1.5 px-6 text-center bg-white shadow-2xl border-2 font-noto font-semibold text-2xl">
            {choice}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LiveBet;
