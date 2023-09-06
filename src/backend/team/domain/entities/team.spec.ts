import { teamData } from "@/backend/tests/data.spec";
import { Team } from "./team";

describe("Team Unit Test", () => {
  it("should restore a Team", () => {
    const team = Team.restore({
      id: teamData[0].id,
      name: teamData[0].name,
    });
    expect(team.id).toBe(teamData[0].id);
    expect(team.name).toBe(teamData[0].name);
  });
});
