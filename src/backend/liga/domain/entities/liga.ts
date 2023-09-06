type LigaProps = {
  id: string;
  name: string;
};

export class Liga {
  id: string;
  name: string;

  constructor(props: LigaProps) {
    this.id = props.id;
    this.name = props.name;
  }

  static create(props: Omit<LigaProps, "id">) {}

  static restore(props: LigaProps) {
    return new Liga(props);
  }
}
