import { z } from "zod";

export const playerSchema = z.object({
  email: z.string().toLowerCase().trim().email(),
  name: z.string().trim().min(1),
  password: z.string().min(8),
});

export const credentialsSchema = playerSchema.pick({
  email: true,
  password: true,
});
