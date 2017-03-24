import {UserData} from "../../../shared/model/userData";
import {Tournament} from "../../../shared/model/tournament";

export interface StoreData {

  userData:  UserData;
  tournaments: Tournament[];

}

export const INITIAL_STORE_DATA = {

  userData: {uid: "1", displayName: "Hans", photoURL:"/"},

  tournaments: [

  ]
};
