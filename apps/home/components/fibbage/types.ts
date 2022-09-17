export type GameState = Partial<SudoGameState>;

interface PreGameState {
  phase: "PREGAME";
}

interface SubmitState {
  phase: "SUBMIT";
  _previewChoice: string[];
}

interface BetState {
  phase: "BET";
  choice: string[];
  truth: string;
  decoy?: string;
}

export interface SudoGameState {
  onGoing: boolean;
  baseBet: number;
  bets: { owner: string; choice: string }[];
  prompt: string;
  participants: [
    {
      owner: string;
      choice: string;
    }
  ];
  phase: "IDLE" | "PREGAME" | "SUBMIT" | "BET" | "REVEAL" | "END";
  choices: string[];
  approvedChoices?: string[];
  truth: string;
  decoy: string;
  totalBet: number;
}

export type Phase = "IDLE" | "PREGAME" | "SUBMIT" | "BET" | "REVEAL" | "END";
