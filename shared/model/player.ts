import {PlayerVM} from '../../src/app/player/player.vm';

export class Player {

  id: string;
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
      userUid, userEmail, firstName, lastName, nickName, elo, meta, origin, country);
  }

  static fromPlayerVM(playerVM: PlayerVM): Player {
    return new Player(playerVM.userUid, playerVM.userEmail, playerVM.firstName, playerVM.lastName,
      playerVM.nickName, playerVM.elo, playerVM.meta, playerVM.origin, playerVM.country
    );
  }

  constructor(userUid: string, userEmail: string, firstName: string, lastName: string,
              nickName: string, elo: number, meta: string, origin: string, country: string) {

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


