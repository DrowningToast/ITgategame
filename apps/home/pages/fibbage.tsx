import { profileInfoAtom } from "firebase-auth-api";
import { useAtom } from "jotai";
import { NextPage } from "next";
import { useCallback, useEffect, useReducer } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { axiosBackendInstance } from "../components/axios/helper";
import PlayerBet from "../components/fibbage/components/PlayerBet";
import PlayerSubmit from "../components/fibbage/components/PlayerSubmit";
import { GameReducer } from "../components/fibbage/instance";
import { GameState } from "../components/fibbage/types";

const Fibbage: NextPage = () => {
  const { sendMessage, lastJsonMessage, readyState } = useWebSocket<{
    phase: string;
  }>(
    process.env.NEXT_PUBLIC_WS_Prod_URL! ?? process.env.NEXT_PUBLIC_WS_Dev_URL!
    // "wss://cz1312nzoj.execute-api.ap-southeast-1.amazonaws.com/dev"
  );

  const [gameState, dispatch] = useReducer(GameReducer, {});

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
        const game = await axiosBackendInstance.get<GameState>("/fibbage");
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

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col justify-center gap-y-4 items-center">
      {!gameState.phase ? (
        <>
          <h1 className="text-5xl text-purple-400 font-bold font-eb">
            Fibbage
          </h1>
        </>
      ) : gameState.phase === "SUBMIT" ? (
        <PlayerSubmit />
      ) : gameState.phase === "BET" ? (
        <>
          <PlayerBet gameState={gameState} />
        </>
      ) : (
        <h1 className="text-5xl text-purple-400 font-bold font-eb">
          Eyes on the screen!
        </h1>
      )}
    </div>
  );
};

export default Fibbage;
