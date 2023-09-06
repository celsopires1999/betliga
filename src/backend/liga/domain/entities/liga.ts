import { v4 as uuidv4 } from "uuid";

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

  static create(params: Omit<LigaProps, "id">) {
    const id = uuidv4();
    return new Liga({ ...params, id });
  }

  static restore(params: LigaProps) {
    return new Liga(params);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
