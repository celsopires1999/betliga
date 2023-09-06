import { betterData } from "@/backend/tests/data.spec";
import { Better } from "./better";

describe("Better Unit Test", () => {
  it("should restore a Better", () => {
    const better = Better.restore({
      id: betterData[0].id,
      name: betterData[0].name,
    });
    expect(better.id).toBe(betterData[0].id);
    expect(better.name).toBe(betterData[0].name);
  });
});
