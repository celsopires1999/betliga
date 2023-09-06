import { GameCreateParams, GameRestoreParams } from "./game";
import { GameDay, GameDayCreateParams, GameDayRestoreParams } from "./game-day";

describe("GameDay Unit Test", () => {
  const gamesRestoreParams: GameRestoreParams[] = [
    {
      id: "1",
      gameDayId: "1",
      gameNumber: 1,
      homeId: "0",
      awayId: "1",
      homeGols: null,
      awayGols: null,
      column: null,
    },
    {
      id: "2",
      gameDayId: "1",
      gameNumber: 2,
      homeId: "2",
      awayId: "3",
      homeGols: 1,
      awayGols: 1,
      column: "X",
    },
  ];

  const gamesCreateParams: GameCreateParams[] = [
    {
      gameDayId: "1",
      gameNumber: 1,
      homeId: "0",
      awayId: "1",
    },
    {
      gameDayId: "1",
      gameNumber: 2,
      homeId: "2",
      awayId: "3",
    },
  ];

  const gameDayRestore: GameDayRestoreParams = {
    id: "1",
    ligaId: "1",
    round: 1,
    games: gamesRestoreParams,
  };

  const gameDayCreate: GameDayCreateParams = {
    ligaId: "1",
    round: 1,
    games: gamesCreateParams,
  };

  it("should restore a GameDay", () => {
    const gameDay = GameDay.restore(gameDayRestore);
    expect(gameDay.id).toBe(gameDayRestore.id);
    expect(gameDay.ligaId).toBe(gameDayRestore.ligaId);
    expect(gameDay.round).toBe(gameDayRestore.round);
    expect(gameDay.games.length).toBe(2);
    expect(gameDay.games[0].gameNumber).toBe(1);
    expect(gameDay.games[0].homeId).toBe("0");
    expect(gameDay.games[0].awayId).toBe("1");
    expect(gameDay.games[1].gameNumber).toBe(2);
    expect(gameDay.games[1].homeId).toBe("2");
    expect(gameDay.games[1].awayId).toBe("3");
  });

  it("should create a GameDay", () => {
    const gameDay = GameDay.create(gameDayCreate);
    expect(gameDay.id).not.toBe(gameDayRestore.id);
    expect(gameDay.ligaId).toBe(gameDayRestore.ligaId);
    expect(gameDay.round).toBe(gameDayRestore.round);
    expect(gameDay.games.length).toBe(2);
    expect(gameDay.games[0].id).toBeDefined();
    expect(gameDay.games[0].id).not.toBe("1");
    expect(gameDay.games[0].gameNumber).toBe(1);
    expect(gameDay.games[0].homeId).toBe("0");
    expect(gameDay.games[0].awayId).toBe("1");
    expect(gameDay.games[1].id).toBeDefined();
    expect(gameDay.games[0].id).not.toBe("2");
    expect(gameDay.games[1].gameNumber).toBe(2);
    expect(gameDay.games[1].homeId).toBe("2");
    expect(gameDay.games[1].awayId).toBe("3");
  });

  it("should update Score", () => {
    const gameDay = GameDay.create(gameDayCreate);
    gameDay.games[0].updateScore(1, 1);
    gameDay.games[1].updateScore(2, 1);
    expect(gameDay.games[0].homeGols).toBe(1);
    expect(gameDay.games[0].awayGols).toBe(1);
    expect(gameDay.games[0].column).toBe("X");
    expect(gameDay.games[1].homeGols).toBe(2);
    expect(gameDay.games[1].awayGols).toBe(1);
    expect(gameDay.games[1].column).toBe("1");
  });

  it("should convert to JSON", () => {
    const expectedJSON = {
      id: "1",
      ligaId: "1",
      round: 1,
      games: [
        {
          id: "1",
          gameDayId: "1",
          gameNumber: 1,
          homeId: "0",
          awayId: "1",
          homeGols: 1,
          awayGols: 1,
          column: "X",
        },
        {
          id: "2",
          gameDayId: "1",
          gameNumber: 2,
          homeId: "2",
          awayId: "3",
          homeGols: 2,
          awayGols: 1,
          column: "1",
        },
      ],
    };
    const gameDay = GameDay.restore(gameDayRestore);
    gameDay.games[0].updateScore(1, 1);
    gameDay.games[1].updateScore(2, 1);
    const gameDayJSON = gameDay.toJSON();
    expect(gameDayJSON).toStrictEqual(expectedJSON);
  });
});
