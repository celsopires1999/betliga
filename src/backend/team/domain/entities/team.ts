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

  static create(props: Omit<TeamProps, "id">) {}

  static restore(props: TeamProps) {
    return new Team(props);
  }
}
