import z from "zod";

export const zPlayer = z.union([z.literal("x"), z.literal("o")]);
export const zCell = z.union([zPlayer, z.null()]);
export const zRound = z.object({
  board: zCell.array(),
});
export const zSession = z.object({
  timestampMs: z.number(),
  players: z.union([z.tuple([z.string(), z.string()]), z.null()]),
  rounds: zRound.array(),
});

export type Player = z.infer<typeof zPlayer>;
export type Cell = z.infer<typeof zCell>;
export type Round = z.infer<typeof zRound>;
export type Session = z.infer<typeof zSession>;
