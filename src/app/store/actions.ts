import {Action} from "@ngrx/store";
import {UserData} from "../../../shared/model/userData";


export const SOCIAL_LOGIN_ACTION: string = 'SOCIAL_LOGIN_ACTION';

export class SocialLoginAction implements Action{

  readonly type: string = 'SOCIAL_LOGIN_ACTION';


  constructor(public payload:string ) {
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

export const DELETE_USERDATA_ACTION: string = 'DELETE_USERDATA_ACTION';

export class DeleteUserDataAction implements Action{

  readonly type: string = 'DELETE_USERDATA_ACTION';


  constructor() {
  }
}

