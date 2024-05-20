import z from "zod";

const zEnv = z.object({
  API_PORT: z.coerce.number(),
  MONGO_CONNECTION_STRING: z.string(),
});
export const env = zEnv.parse(process.env);
