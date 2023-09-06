import { Bet } from "@/backend/bet/domain/entities/bet";
import { v4 as uuidv4 } from "uuid";

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

  static create(params: Omit<BetterProps, "id">) {
    const id = uuidv4();
    return new Better({ ...params, id });
  }

  static restore(params: BetterProps) {
    return new Better(params);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
