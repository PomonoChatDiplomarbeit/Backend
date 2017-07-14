class User {
  constructor(guid, usertelnr, username) {
    this.guid = guid;
    this.usertelnr = usertelnr;
    this.username = username;
  }

  get guid() {
    return this.guid;
  }

  get usertelnr() {
    return this.usertelnr;
  }

  get username() {
    return this.username;
  }
}