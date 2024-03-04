import { z } from "zod";

export const updateBetSchema = z.object({
  ligaId: z.string().uuid({ message: "Invalid Liga" }),
  gameDayId: z.string().uuid({ message: "Invalid Game Day" }),
  betterId: z.string().uuid({ message: "Invalid Better" }),
  betId: z.string(),
  scores: z.array(
    z.object({
      homeGols: z.coerce
        .number()
        .min(0, { message: "Home gols is less than zero" })
        .max(99, "Home gols is greater than 99"),
      awayGols: z.coerce
        .number()
        .min(0, { message: "Away gols is less than zero" })
        .max(99, "Away gols is greater than 99"),
      gameNumber: z.coerce.number().min(1, "Game number is less than 1"),
      gameId: z.string().uuid({ message: "Invalid Game" }),
    })
  ),
});

export type UpdateBetSchema = z.infer<typeof updateBetSchema>;
