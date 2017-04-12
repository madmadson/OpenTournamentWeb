

export class Player {

  id?: string;
  userUid: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  nickName: string;
  elo: number;
  meta: string;
  origin: string;
  country: string;

  static fromJson({userUid, userEmail, firstName, lastName, nickName, elo, meta, origin, country}): Player {
    return new Player(
      userUid, userEmail, firstName, nickName, lastName , elo, meta, origin, country);
  }

  constructor(userUid: string, userEmail: string, firstName: string, nickName: string, lastName: string,
               elo: number, meta: string, origin: string, country: string) {

    this.userUid = userUid;
    this.userEmail = userEmail;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.elo = elo;
    this.origin = origin;
    this.meta = meta;
    this.country = country;
  }

  getFullPlayerName(): string {
    return this.firstName + ' \"' + this.nickName + '\" ' + this.lastName;
  }
}


