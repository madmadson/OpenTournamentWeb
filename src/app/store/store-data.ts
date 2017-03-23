import {UserData} from "../../../shared/model/userData";
import {Tournament} from "../../../shared/model/tournament";

export interface StoreData {

  userData:  UserData;
  tournaments: Tournament[];

}

export const INITIAL_STORE_DATA = {

  userData: {uid: "1", displayName: "Hans", photoURL:"/"},

  tournaments: [
    // {
    //   id: '1',
    //   name: 'Warmachine',
    //   timestamp:1490278039,
    //   month: 3,
    //   year:2017
    // },
    // {
    //   id: '2',
    //   name: 'Judgement!',
    //   timestamp: 1490278039,
    //   month: 4,
    //   year:2017
    // },
    // {
    //   id: '3',
    //   name: 'Badminton',
    //   timestamp:1490278039,
    //   month: 3,
    //   year:2017
    // },
  ]
};
