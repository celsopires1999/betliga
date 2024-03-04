import { Game } from "@/backend/game-day/domain/entities/game";
import { Bet, BetCreateParams, BetRestoreParams } from "./bet";
import { BetScoreParams, ChangeBetScoreParams } from "./bet-score";

describe("Bet Unit Test", () => {
  const betScoresRestore: BetScoreParams[] = [
    {
      id: "1",
      betId: "1",
      gameId: "1",
      homeGols: 1,
      awayGols: 1,
      column: "X",
      points: null,
    },
    {
      id: "2",
      betId: "2",
      gameId: "2",
      homeGols: 2,
      awayGols: 1,
      column: "1",
      points: 5,
    },
  ];

  const betScoresCreate: Omit<BetScoreParams, "id" | "column" | "points">[] = [
    {
      betId: "1",
      gameId: "1",
      homeGols: 1,
      awayGols: 1,
    },
    {
      betId: "2",
      gameId: "2",
      homeGols: 2,
      awayGols: 1,
    },
  ];

  const betRestore: BetRestoreParams = {
    id: "1",
    gameDayId: "1",
    betterId: "1",
    betScores: betScoresRestore,
    points: null,
  };

  const betCreate: BetCreateParams = {
    gameDayId: "1",
    betterId: "1",
    betScores: betScoresCreate,
    points: null,
  };

  it("should restore a Bet", () => {
    const bet = Bet.restore(betRestore);
    expect(bet.id).toBe(betRestore.id);
    expect(bet.gameDayId).toBe(betRestore.gameDayId);
    expect(bet.betterId).toBe(betRestore.betterId);
    expect(bet.betScores.length).toBe(2);
    expect(bet.betScores[0].homeGols).toBe(1);
    expect(bet.betScores[0].awayGols).toBe(1);
    expect(bet.betScores[0].column).toBe("X");
    expect(bet.betScores[0].points).toBeNull();
    expect(bet.betScores[1].homeGols).toBe(2);
    expect(bet.betScores[1].awayGols).toBe(1);
    expect(bet.betScores[1].column).toBe("1");
    expect(bet.betScores[1].points).toBe(5);
  });

  it("should create a Bet", () => {
    const bet = Bet.create(betCreate);
    expect(bet.id).toBeDefined();
    expect(bet.gameDayId).toBe(betCreate.gameDayId);
    expect(bet.betterId).toBe(betCreate.betterId);
    expect(bet.betScores.length).toBe(2);
    expect(bet.betScores[0].homeGols).toBe(1);
    expect(bet.betScores[0].awayGols).toBe(1);
    expect(bet.betScores[0].column).toBe("X");
    expect(bet.betScores[0].points).toBeNull();
    expect(bet.betScores[1].homeGols).toBe(2);
    expect(bet.betScores[1].awayGols).toBe(1);
    expect(bet.betScores[1].column).toBe("1");
    expect(bet.betScores[1].points).toBeNull;
  });

  it("should calculate points", () => {
    const games = [
      Game.restore({
        id: "1",
        gameDayId: "1",
        gameNumber: 1,
        homeId: "1",
        awayId: "2",
        homeGols: 1,
        awayGols: 1,
        column: "X",
      }),
      Game.restore({
        id: "2",
        gameDayId: "1",
        gameNumber: 2,
        homeId: "3",
        awayId: "4",
        homeGols: 2,
        awayGols: 1,
        column: "1",
      }),
    ];

    const bet = Bet.restore(betRestore);
    bet.calculatePoints(games);
    expect(bet.betScores[0].points).toBe(10);
    expect(bet.betScores[1].points).toBe(5);
    expect(bet.points).toBe(15);
  });

  it("should change scores", () => {
    const changeBetScoreParams: ChangeBetScoreParams[] = [
      {
        gameId: "1",
        homeGols: 9,
        awayGols: 8,
      },
      {
        gameId: "2",
        homeGols: 8,
        awayGols: 9,
      },
    ];
    const bet = Bet.restore(betRestore);

    expect(bet.id).toBe(betRestore.id);
    expect(bet.gameDayId).toBe(betRestore.gameDayId);
    expect(bet.betterId).toBe(betRestore.betterId);
    expect(bet.betScores.length).toBe(2);
    expect(bet.betScores[0].homeGols).toBe(1);
    expect(bet.betScores[0].awayGols).toBe(1);
    expect(bet.betScores[0].column).toBe("X");
    expect(bet.betScores[0].points).toBeNull();
    expect(bet.betScores[1].homeGols).toBe(2);
    expect(bet.betScores[1].awayGols).toBe(1);
    expect(bet.betScores[1].column).toBe("1");
    expect(bet.betScores[1].points).toBe(5);

    bet.changeScores(changeBetScoreParams);

    expect(bet.gameDayId).toBe(betRestore.gameDayId);
    expect(bet.betterId).toBe(betRestore.betterId);
    expect(bet.betScores.length).toBe(2);
    expect(bet.betScores[0].homeGols).toBe(9);
    expect(bet.betScores[0].awayGols).toBe(8);
    expect(bet.betScores[0].column).toBe("1");
    expect(bet.betScores[0].points).toBeNull();
    expect(bet.betScores[1].homeGols).toBe(8);
    expect(bet.betScores[1].awayGols).toBe(9);
    expect(bet.betScores[1].column).toBe("2");
    expect(bet.betScores[1].points).toBeNull();
    expect(bet.betScores[0].points).toBeNull();
    expect(bet.betScores[1].points).toBeNull();
    expect(bet.points).toBeNull();
  });

  it("should convert to JSON", () => {
    const expectedJSON = {
      id: "1",
      gameDayId: "1",
      betterId: "1",
      betScores: [
        {
          id: "1",
          gameId: "1",
          betId: "1",
          homeGols: 1,
          awayGols: 1,
          column: "X",
          points: null,
        },
        {
          id: "2",
          gameId: "2",
          betId: "2",
          homeGols: 2,
          awayGols: 1,
          column: "1",
          points: 5,
        },
      ],
      points: null,
    };

    const bet = Bet.restore(betRestore);
    const betJSON = bet.toJSON();
    expect(betJSON).toStrictEqual(expectedJSON);
  });
});
