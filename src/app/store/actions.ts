import {Action} from "@ngrx/store";
import {UserData} from "../../../shared/model/userData";


export const ANONYMOUS_LOGIN_ACTION: string = 'ANONYMOUS_LOGIN_ACTION';



export const LOGIN_ACTION: string = 'LOGIN_ACTION';

export class LoginAction implements Action{

  readonly type: string = 'LOGIN_ACTION';

  constructor(public payload?:string ) {
  }
}

export const STORE_USERDATA_ACTION: string = 'STORE_USERDATA_ACTION';

export class SaveUserDataAction implements Action{

  readonly type: string = 'STORE_USERDATA_ACTION';


  constructor(public payload:UserData ) {
  }
}

export const LOGOUT_ACTION: string = 'LOGOUT_ACTION';

export class LogoutAction implements Action{

  readonly type: string = 'LOGOUT_ACTION';

  constructor() {
  }
}
