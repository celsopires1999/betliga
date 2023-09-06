type BetterProps = {
  id: string;
  name: string;
};

export class Better {
  id: string;
  name: string;

  constructor(props: BetterProps) {
    this.id = props.id;
    this.name = props.name;
  }

  static create(props: Omit<BetterProps, "id">) {}

  static restore(props: BetterProps) {
    return new Better(props);
  }
}
