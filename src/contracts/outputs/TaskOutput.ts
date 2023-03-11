export class TaskOutput {
  id: string;
  name: string;
  cardId: string;

  constructor(name: string, id: string, cardId: string) {
    this.name = name;
    this.id = id;
    this.cardId = cardId;
  }
}
