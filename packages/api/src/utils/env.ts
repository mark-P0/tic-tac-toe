import z from "zod";

const zEnv = z.object({
  API_PORT: z.coerce.number(),
});
export const env = zEnv.parse(process.env);
