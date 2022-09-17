import { NextPage } from "next";
import shuffle from "../../utils/Shuffle";
import { GameState } from "../types";
import { motion } from "framer-motion";
import { axiosBackendInstance } from "../../axios/helper";
import { useState } from "react";

interface Props {
  gameState: GameState;
}

const PlayerBet: NextPage<Props> = ({ gameState }) => {
  const [hasBet, setHasBet] = useState<boolean>(false);

  const handleBet = async (choice: string) => {
    try {
      await axiosBackendInstance.post("/fibbage/bet", {
        choice,
      });
      setHasBet(true);
    } catch (e: any) {
      console.log(e);
      alert(e.response.data);
    }
  };

  return (
    <div className="w-screen flex flex-col justify-around items-center gap-y-4 text-black">
      {!hasBet ? (
        <>
          <div className="bg-black border-b-8 py-8 border-purple-300 text-white w-full text-center flex flex-col justify-around items-center">
            <h1 className="text-8xl font-bold font-eb">Bet!</h1>
            <h2 className="text-lg font-bold font-noto">
              Win {gameState.baseBet! * 5} tokens if choose correctly
            </h2>
          </div>
          {shuffle(gameState.approvedChoices!).map((choice) => (
            <motion.div
              onClick={() => handleBet(choice)}
              className="cursor-pointer rounded-full py-1.5 px-6 text-center bg-white shadow-2xl border-2 font-noto font-semibold text-2xl text-black"
            >
              {choice}
            </motion.div>
          ))}
        </>
      ) : (
        <h1 className="mb-8 text-5xl font-bold font-eb text-purple-300">
          Pray for the best
        </h1>
      )}
    </div>
  );
};

export default PlayerBet;
