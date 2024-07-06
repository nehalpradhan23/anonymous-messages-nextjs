import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Content must be at least 1 characters." })
    .max(300, { message: "Content must not be longer than 300 characters." }),
});
