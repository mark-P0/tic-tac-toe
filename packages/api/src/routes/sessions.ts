import { zSession } from "@tic-tac-toe/schemas";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { getAllSessionsFromMostToLeastRecent } from "../db/sessions";

export const SessionsRouter = Router();

SessionsRouter.get("/sessions", async (req, res) => {
  try {
    const dbSessions = await getAllSessionsFromMostToLeastRecent();

    const sessions = zSession.array().parse(dbSessions);
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});
