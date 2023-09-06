import { prisma } from "./prisma";

describe("Validate Prisma Model", () => {
  it("Collections", async () => {
    // Clean
    await prisma.betScoreModel.deleteMany();
    await prisma.betModel.deleteMany();
    await prisma.gameModel.deleteMany();
    await prisma.gameDayModel.deleteMany();
    await prisma.ligaModel.deleteMany();
    await prisma.teamModel.deleteMany();
    await prisma.betterModel.deleteMany();

    // #region  Liga
    await prisma.ligaModel.create({
      data: {
        id: "1",
        name: "Bundesliga 2023/24",
      },
    });
    const liga = await prisma.ligaModel.findUniqueOrThrow({
      where: {
        id: "1",
      },
    });

    expect(liga.id).toBe("1");
    expect(liga.name).toBe("Bundesliga 2023/24");
    // #endregion Liga

    // #region Team
    await prisma.teamModel.createMany({
      data: [
        {
          id: "1",
          name: "Team 1",
        },
        {
          id: "2",
          name: "Team 2",
        },
        {
          id: "3",
          name: "Team 3",
        },
        {
          id: "4",
          name: "Team 4",
        },
      ],
    });

    const teams = await prisma.teamModel.findMany();
    expect(teams[0].id).toBe("1");
    expect(teams[0].name).toBe("Team 1");
    expect(teams[1].id).toBe("2");
    expect(teams[1].name).toBe("Team 2");
    // #endregion Team

    // #region Betters
    await prisma.betterModel.createMany({
      data: [
        { id: "1", name: "Better 1" },
        { id: "2", name: "Better 2" },
      ],
    });

    const betters = await prisma.betterModel.findMany();
    expect(betters[0].id).toBe("1");
    expect(betters[0].name).toBe("Better 1");
    expect(betters[1].id).toBe("2");
    expect(betters[1].name).toBe("Better 2");
    // #endregion Betters

    // #region GameDay
    await prisma.gameDayModel.create({
      data: {
        id: "1",
        round: 1,
        ligaId: "1",
      },
    });
    const gameDay = await prisma.gameDayModel.findUniqueOrThrow({
      where: { id: "1" },
      include: { liga: {} },
    });

    expect(gameDay.id).toBe("1");
    expect(gameDay.round).toBe(1);
    expect(gameDay.ligaId).toBe("1");
    expect(gameDay.liga.name).toBe("Bundesliga 2023/24");
    // #endregion GameDay

    // #region Game
    await prisma.gameModel.createMany({
      data: [
        {
          id: "1",
          gameDayId: "1",
          gameNumber: 1,
          homeId: "1",
          awayId: "2",
        },
        {
          id: "2",
          gameDayId: "1",
          gameNumber: 2,
          homeId: "3",
          awayId: "4",
        },
      ],
    });

    const games = await prisma.gameModel.findMany({
      include: { gameDay: { include: { liga: {} } }, home: {}, away: {} },
    });
    expect(games[0].id).toBe("1");
    expect(games[0].gameDayId).toBe("1");
    expect(games[0].gameDay.round).toBe(1);
    expect(games[0].gameDay.liga.name).toBe("Bundesliga 2023/24");
    expect(games[0].gameNumber).toBe(1);
    expect(games[0].home.name).toBe("Team 1");
    expect(games[0].away.name).toBe("Team 2");
    expect(games[1].id).toBe("2");
    expect(games[1].gameDayId).toBe("1");
    expect(games[1].gameDay.round).toBe(1);
    expect(games[1].gameDay.liga.name).toBe("Bundesliga 2023/24");
    expect(games[1].gameNumber).toBe(2);
    expect(games[1].home.name).toBe("Team 3");
    expect(games[1].away.name).toBe("Team 4");
    // #endregion Game

    // #region Bet
    await prisma.betModel.createMany({
      data: [
        {
          id: "1",
          betterId: "1",
          gameDayId: "1",
        },
        {
          id: "2",
          betterId: "2",
          gameDayId: "1",
        },
      ],
    });

    const bets = await prisma.betModel.findMany({
      include: { better: {}, gameDay: {} },
    });

    expect(bets[0].id).toBe("1");
    expect(bets[0].betterId).toBe("1");
    expect(bets[0].better.name).toBe("Better 1");
    expect(bets[0].gameDayId).toBe("1");
    expect(bets[0].gameDay.round).toBe(1);
    expect(bets[1].id).toBe("2");
    expect(bets[1].betterId).toBe("2");
    expect(bets[1].better.name).toBe("Better 2");
    expect(bets[1].gameDayId).toBe("1");
    expect(bets[1].gameDay.round).toBe(1);
    // #endregion Bet

    // #region BetScore
    await prisma.betScoreModel.createMany({
      data: [
        {
          id: "1",
          betId: "1",
          gameId: "1",
          homeGols: 11,
          awayGols: 11,
          column: "X",
        },
        {
          id: "2",
          betId: "1",
          gameId: "2",
          homeGols: 12,
          awayGols: 12,
          column: "X",
        },
        {
          id: "3",
          betId: "2",
          gameId: "1",
          homeGols: 21,
          awayGols: 21,
          column: "X",
        },
        {
          id: "4",
          betId: "2",
          gameId: "2",
          homeGols: 22,
          awayGols: 22,
          column: "X",
        },
      ],
    });

    const betsScores = await prisma.betScoreModel.findMany({
      include: {
        bet: { include: { better: {} } },
        game: { include: { home: {}, away: {} } },
      },
    });

    expect(betsScores[0].id).toBe("1");
    expect(betsScores[0].betId).toBe("1");
    expect(betsScores[0].bet.better.name).toBe("Better 1");
    expect(betsScores[0].gameId).toBe("1");
    expect(betsScores[0].game.gameNumber).toBe(1);
    expect(betsScores[0].game.home.name).toBe("Team 1");
    expect(betsScores[0].game.away.name).toBe("Team 2");
    expect(betsScores[0].homeGols).toBe(11);
    expect(betsScores[0].awayGols).toBe(11);

    expect(betsScores[1].id).toBe("2");
    expect(betsScores[1].betId).toBe("1");
    expect(betsScores[1].bet.better.name).toBe("Better 1");
    expect(betsScores[1].gameId).toBe("2");
    expect(betsScores[1].game.gameNumber).toBe(2);
    expect(betsScores[1].game.home.name).toBe("Team 3");
    expect(betsScores[1].game.away.name).toBe("Team 4");
    expect(betsScores[1].homeGols).toBe(12);
    expect(betsScores[1].awayGols).toBe(12);

    // #endregion Bet
  }, 50000);
});
