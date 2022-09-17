import { ConditionalRedirect, profileInfoAtom } from "firebase-auth-api";
import { useAtom } from "jotai";
import { NextPage } from "next";
import { useEffect, useReducer } from "react";
import { ReadyState } from "react-use-websocket";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import { axiosBackendInstance } from "../../components/axios/helper";
import LiveSubmit from "../../components/fibbage/components/LiveSubmit";
import { GameReducer } from "../../components/fibbage/instance";
import { SudoGameState } from "../../components/fibbage/types";
import { motion } from "framer-motion";
import LiveBet from "../../components/fibbage/components/LiveBet";
import LiveReveal from "../../components/fibbage/components/LiveReveal";
import shuffle from "../../components/utils/Shuffle";

const LiveFibbage: NextPage = () => {
  const { sendMessage, lastJsonMessage, readyState } = useWebSocket<{
    phase: string;
    jwt?: string;
  }>(
    "wss://cz1312nzoj.execute-api.ap-southeast-1.amazonaws.com/dev"
    // process.env.NEXT_PUBLIC_WS_Prod_URL! ?? process.env.NEXT_PUBLIC_WS_Dev_URL!
    // "wss://cz1312nzoj.execute-api.ap-southeast-1.amazonaws.com/dev"
  );

  const [gameState, dispatch] = useReducer(GameReducer, {
    phase: "PREGAME",
  });

  const [profile] = useAtom(profileInfoAtom);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  // Fetch data once told
  useEffect(() => {
    if (
      connectionStatus !== "Open" ||
      !profile ||
      (!lastJsonMessage?.phase && lastJsonMessage)
    )
      return () => {};

    const fetchSudoGame = async () => {
      try {
        const game = await axiosBackendInstance.get<SudoGameState>(
          "/fibbage/sudo"
        );
        dispatch(game.data);
      } catch (e: any) {
        console.log(e);
        if (e.response.status === 404) {
          dispatch(null);
        }
      }
    };

    fetchSudoGame();
  }, [connectionStatus, profile, lastJsonMessage]);

  const bg = ["blue", "green", "orange", "red", "yellow"];

  return (
    <>
      <ConditionalRedirect
        path="/"
        cb={(user, ready) => {
          return !user && ready;
        }}
      />
      <div
        style={{
          backgroundImage: `url("/assets/bg/${shuffle(bg)[0]}${Math.floor(
            Math.random() / 0.4
          )}")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="w-screen min-h-screen text-black bg-white flex flex-col justify-center items-center"
      >
        {!gameState?.phase ? (
          <h1 className="font-eb font-bold text-purple-400 text-8xl">
            Fibbage
          </h1>
        ) : gameState?.phase === "IDLE" ? (
          <>
            <div className="flex-col flex gap-y-4 text-center">
              <h1 className="font-eb font-bold text-purple-400 text-8xl">
                Get Ready
              </h1>
              <h2 className="font-noto text-purple-400 text-4xl">
                เข้าตอนนี้ยังทัน!
              </h2>
            </div>
          </>
        ) : gameState?.phase === "PREGAME" ? (
          <>
            <motion.div
              layout
              layoutId="banner"
              className="flex-col flex gap-y-4 text-center w-full py-16 px-4 bg-black border-b-8 border-purple-300"
            >
              <h1 className="font-noto font-medium text-white text-5xl">
                {gameState.prompt}
              </h1>
            </motion.div>
          </>
        ) : gameState.phase === "SUBMIT" ? (
          <>
            <LiveSubmit gameState={gameState} lastJSON={lastJsonMessage} />
          </>
        ) : gameState.phase === "BET" ? (
          <>
            <LiveBet gameState={gameState} />
          </>
        ) : gameState.phase === "REVEAL" ? (
          <LiveReveal gameState={gameState} />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default LiveFibbage;
