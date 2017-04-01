import {Action} from "@ngrx/store";
import {UserData} from "../../../../shared/model/userData";

export const LOGIN_ACTION = 'LOGIN_ACTION';

export class LoginAction implements Action{

  readonly type = 'LOGIN_ACTION';

  constructor(public payload?: string ) {
  }
}

export const STORE_USERDATA_ACTION = 'STORE_USERDATA_ACTION';

export class SaveUserDataAction implements Action{

  readonly type = 'STORE_USERDATA_ACTION';


  constructor(public payload: UserData ) {
  }
}

export const LOGOUT_ACTION = 'LOGOUT_ACTION';

export class LogoutAction implements Action {

  readonly type = 'LOGOUT_ACTION';

  constructor() {
  }
}
