import { Result, ResultCreateParams, ResultRestoreParams } from "./result";
import { ResultScoreParams } from "./result-score";

describe("Result Unit Test", () => {
  const resultScoresRestore: ResultScoreParams[] = [
    {
      id: "1",
      gameId: "1",
      homeGols: 1,
      awayGols: 1,
      column: "X",
    },
    {
      id: "2",
      gameId: "1",
      homeGols: 2,
      awayGols: 1,
      column: "1",
    },
  ];

  const resultScoresCreate: Omit<ResultScoreParams, "id" | "column">[] = [
    {
      gameId: "1",
      homeGols: 1,
      awayGols: 1,
    },
    {
      gameId: "1",
      homeGols: 2,
      awayGols: 1,
    },
  ];

  const resultRestore: ResultRestoreParams = {
    id: "1",
    gameDayId: "1",
    resultScores: resultScoresRestore,
  };

  const resultCreate: ResultCreateParams = {
    gameDayId: "1",
    resultScores: resultScoresCreate,
  };

  it("should restore a Result", () => {
    const result = Result.restore(resultRestore);
    expect(result.id).toBe(resultRestore.id);
    expect(result.gameDayId).toBe(resultRestore.gameDayId);
    expect(result.resultScores.length).toBe(2);
    expect(result.resultScores[0].homeGols).toBe(1);
    expect(result.resultScores[0].awayGols).toBe(1);
    expect(result.resultScores[0].column).toBe("X");
    expect(result.resultScores[1].homeGols).toBe(2);
    expect(result.resultScores[1].awayGols).toBe(1);
    expect(result.resultScores[1].column).toBe("1");
  });

  it("should create a Result", () => {
    const result = Result.create(resultCreate);
    expect(result.id).toBeDefined();
    expect(result.gameDayId).toBe(resultCreate.gameDayId);
    expect(result.resultScores.length).toBe(2);
    expect(result.resultScores[0].homeGols).toBe(1);
    expect(result.resultScores[0].awayGols).toBe(1);
    expect(result.resultScores[0].column).toBe("X");
    expect(result.resultScores[1].homeGols).toBe(2);
    expect(result.resultScores[1].awayGols).toBe(1);
    expect(result.resultScores[1].column).toBe("1");
  });
});
