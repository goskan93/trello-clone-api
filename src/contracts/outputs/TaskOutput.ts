export class TaskOutput {
  id: string;
  name: string;
  cardId: string;
  index: number;

  constructor(name: string, id: string, cardId: string, index: number) {
    this.name = name;
    this.id = id;
    this.cardId = cardId;
    this.index = index;
  }
}
