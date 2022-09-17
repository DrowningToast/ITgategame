import { NextPage } from "next";
import { GameState } from "../types";
import { LayoutGroup, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface Props {
  gameState: GameState;
  lastJSON: { jwt?: string };
}

const LiveSubmit: NextPage<Props> = ({ gameState, lastJSON }) => {
  const [total, setTotal] = useState<number>(gameState?.choices?.length ?? 0);

  useEffect(() => {
    if (!lastJSON?.jwt) return;

    setTotal(total + 1);
  }, [lastJSON]);

  return (
    <>
      <div className="w-screen min-h-screen flex flex-col justify-around">
        <LayoutGroup>
          <motion.div
            layoutId="banner"
            layout
            className="flex-col flex gap-y-4 text-center w-full py-16 px-4 bg-black border-b-8 border-purple-300"
          >
            <h1 className="font-noto font-medium text-white text-5xl">
              {gameState.prompt}
            </h1>
          </motion.div>
          <motion.div
            layout
            className="py-12 flex justify-around items-center overflow-x-hidden flex-wrap gap-y-6"
          >
            {[...Array(total).keys()].map((element, index) => {
              return (
                <motion.div
                  initial={{
                    y: "100vh",
                  }}
                  animate={{
                    y: "0vh",
                  }}
                  key={index}
                  className="relative p-6 rounded-full bg-black aspect-square grid place-items-center"
                >
                  <FontAwesomeIcon
                    className="scale-150"
                    color="white"
                    icon={faCheck as IconProp}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </LayoutGroup>
      </div>
    </>
  );
};

export default LiveSubmit;
