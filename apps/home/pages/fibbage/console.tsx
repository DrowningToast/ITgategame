import { AxiosError } from "axios";
import {
  ConditionalRedirect,
  firebaseReady,
  profileInfoAtom,
} from "firebase-auth-api";
import { useAtom } from "jotai";
import { NextPage } from "next";
import { useEffect, useReducer } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { axiosBackendInstance } from "../../components/axios/helper";
import ConsoleIdle from "../../components/fibbage/components/ConsoleIdle";
import ConsolePregame from "../../components/fibbage/components/ConsolePregame";
import ConsoleSubmit from "../../components/fibbage/components/ConsoleSubmit";
import NewGame from "../../components/fibbage/components/NewGame";
import {
  GameReducer,
  phases,
  startNewGame,
} from "../../components/fibbage/instance";
import { SudoGameState } from "../../components/fibbage/types";

const FibbageConsole: NextPage = () => {
  const { sendMessage, lastJsonMessage, readyState } = useWebSocket<{
    phase: string;
    jwt: string;
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
        const game = await axiosBackendInstance.get<SudoGameState>(
          "/fibbage/sudo"
        );
        dispatch(game.data);
      } catch (e: any) {
        if (e.response.status === 404) {
          dispatch(null);
        }
      }
    };

    fetchSudoGame();
  }, [connectionStatus, profile, lastJsonMessage]);

  const handleContinue = async (event?: any, approved?: string[]) => {
    if (gameState.phase === "END") {
      dispatch({});
    }

    try {
      await axiosBackendInstance.patch("/fibbage/continue", {
        phase: phases[phases.indexOf(gameState.phase!) + 1],
        choices: approved ?? [],
      });
    } catch (e: any) {
      console.log(e);
      alert(e?.response?.data);
    }
  };

  return (
    <>
      <ConditionalRedirect
        path="/"
        cb={(user, ready) => {
          return !user && ready;
        }}
      />
      {connectionStatus === "Open" && (
        <div className="w-screen min-h-screen text-black bg-white flex flex-col justify-center items-center gap-y-8">
          {gameState.phase === "IDLE" ? (
            // IDLE
            <>
              <ConsoleIdle handleContinue={handleContinue} />
              {/* <ConsoleSubmit choices={["hello"]} /> */}
            </>
          ) : gameState.phase === "PREGAME" ? (
            //  PREGAME
            <>
              <ConsolePregame handleContinue={handleContinue} />
            </>
          ) : gameState.phase === "SUBMIT" ? (
            <>
              <ConsoleSubmit
                initialChoices={gameState?.choices ?? []}
                lastJSON={lastJsonMessage}
                onsubmit={handleContinue}
              />
            </>
          ) : gameState.phase === "BET" ? (
            <>
              <h1>(BET) Players are placeing their bets</h1>
              <button
                className="text-xl p-2 py-1 rounded-lg border-2 border-black"
                onClick={handleContinue}
              >
                Continue
              </button>
            </>
          ) : gameState.phase === "REVEAL" ? (
            <>
              <h1>(REVEAL) Mods are revealing the answers</h1>
              <button
                className="text-xl p-2 py-1 rounded-lg border-2 border-black"
                onClick={handleContinue}
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <NewGame />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default FibbageConsole;
