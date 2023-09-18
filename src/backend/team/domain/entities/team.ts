import { v4 as uuidv4 } from "uuid";

type TeamProps = {
  id: string;
  name: string;
};

export class Team {
  id: string;
  name: string;

  constructor(props: TeamProps) {
    this.id = props.id;
    this.name = props.name;
  }

  static create(params: Omit<TeamProps, "id">) {
    const id = uuidv4();
    return new Team({ ...params, id });
  }

  static restore(params: TeamProps) {
    return new Team(params);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
