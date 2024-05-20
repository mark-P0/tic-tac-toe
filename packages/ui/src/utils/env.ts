import z from "zod";

const zEnv = z.object({
  VITE_API_BASE_URL: z.string().url(),
});
export const env = zEnv.parse(import.meta.env);
