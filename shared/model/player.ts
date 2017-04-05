import {PlayerVM} from "../../src/app/player/player.vm";

export class Player {

  id: string;
  userUid: string;
  firstName: string;
  lastName: string;
  nickName: string;
  elo: number;
  meta: string;
  origin: string;
  country: string;

  static fromJson({firstname, lastname, nickname, elo, meta, origin, country}): Player {
    return new Player(
      firstname, lastname, nickname, elo, meta, origin, country);
  }

  static fromPlayerVM(playerVM: PlayerVM): Player {
    return new Player(playerVM.firstName, playerVM.lastName,
      playerVM.nickName, playerVM.elo, playerVM.meta, playerVM.origin, playerVM.country
    );
  }

  constructor(firstName: string, lastName: string,
              nickName: string, elo: number, meta: string, origin: string, country: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.elo = elo;
    this.origin = origin;
    this.meta = meta;
    this.country = country;
  }
}


