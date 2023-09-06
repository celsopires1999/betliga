import { ligaData } from "@/backend/tests/data.spec";
import { Liga } from "./liga";

describe("Liga Unit Test", () => {
  it("should restore a Liga", () => {
    const liga = Liga.restore({
      id: ligaData[0].id,
      name: ligaData[0].name,
    });
    expect(liga.id).toBe(ligaData[0].id);
    expect(liga.name).toBe(ligaData[0].name);
  });
});
