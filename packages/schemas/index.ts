export type Player = "x" | "o";
export type Cell = Player | null;
export type Round = {
  board: Cell[];
};
export type Session = {
  timestampMs: number;
  players: [string, string] | null;
  rounds: Round[];
};
