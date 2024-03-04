"use server";

import { BetService } from "../services/bet-service";
import { updateBetSchema } from "../types/update-bet";
export type PerformActionResponse = {
  success?: boolean;
  message?: string;
};

export async function performAction(
  prevState: any,
  formData: FormData
): Promise<PerformActionResponse> {
  const input = {
    ligaId: formData.get("liga_id"),
    gameDayId: formData.get("game_day_id"),
    betterId: formData.get("better_id"),
    betId: formData.get("bet_id"),
    scores: getScores(
      formData.getAll("home[]"),
      formData.getAll("away[]"),
      formData.getAll("game_number[]"),
      formData.getAll("game_id[]")
    ),
  };

  const parsedInput = updateBetSchema.safeParse(input);

  if (!parsedInput.success) {
    const fieldErrors = parsedInput.error.flatten().fieldErrors as {
      [key: string]: string[];
    };
    let message = "";

    Object.keys(fieldErrors).forEach((key) => {
      message.length > 0 ? (message += ", ") : null;
      message += fieldErrors[key].join(", ");
    });

    return {
      success: false,
      message,
    };
  }

  try {
    await new BetService().updateBet({
      id: parsedInput.data.betId,
      scores: parsedInput.data.scores,
    });
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: "Error updating bet",
    };
  }

  return {
    success: true,
    message: "Bet updated successfully",
  };
  // return "/bets/edit";
}

function getScores(
  homeScores: FormDataEntryValue[],
  awayScores: FormDataEntryValue[],
  gameNumbers: FormDataEntryValue[],
  gamesId: FormDataEntryValue[]
) {
  type score = {
    homeGols: FormDataEntryValue;
    awayGols: FormDataEntryValue;
    gameNumber: FormDataEntryValue;
    gameId: FormDataEntryValue;
  };
  let scores: score[] = [];
  for (let i = 0; i < homeScores.length; i++) {
    const homeGols = homeScores[i];
    const awayGols = awayScores[i];
    const gameNumber = gameNumbers[i];
    const gameId = gamesId[i];
    const score: score = {
      homeGols,
      awayGols,
      gameNumber,
      gameId,
    };
    scores.push(score);
  }
  return scores;
}
