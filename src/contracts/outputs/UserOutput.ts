export default class UserOutput {
  id: string;
  username: string;

  constructor(username: string, id: string) {
    this.id = id;
    this.username = username;
  }
}
