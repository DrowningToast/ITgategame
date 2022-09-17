import { axiosBackendInstance } from "../axios/helper";
import { GameState, Phase, SudoGameState } from "./types";

export const phases = ["PREGAME", "SUBMIT", "BET", "REVEAL", "END"];

export const GameReducer = (state: GameState, action: any): GameState => {
  return {
    ...action,
  };
};

// ADMIN
export const startNewGame = async (
  bet: number,
  prompt: string,
  truth: string,
  decoy: string
) => {
  const response = await axiosBackendInstance.post<SudoGameState>(
    "/fibbage/new",
    {
      bet,
      prompt,
      truth,
      decoy,
    }
  );
  return response.data;
};

// ADMIN
export const continueGame = async (phase: Phase, choices: string[] = []) => {
  const response = await axiosBackendInstance.patch("/continue", {
    phase,
    choices,
  });

  return response.data;
};
