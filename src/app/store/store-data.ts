import {UserData} from "../../../shared/model/userData";
export interface StoreData {

  userData:  UserData;

}

export const INITIAL_STORE_DATA = {

  userData: {uid: "1", displayName: "Hans"}
};
