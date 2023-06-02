export class UserOutput {
  id: string;
  username: string;
  password: string;

  constructor(username: string, password: string, id: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
}
