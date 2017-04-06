import {Action} from '@ngrx/store';
import {UserData} from '../../../../shared/model/userData';

export const LOGIN_ACTION = 'LOGIN_ACTION';

export class LoginAction implements Action {

  readonly type = 'LOGIN_ACTION';

  constructor(public payload: any ) {
  }
}

export const LOGIN_PROVIDER_ACTION = 'LOGIN_PROVIDER_ACTION';

export class LoginWithProviderAction implements Action {

  readonly type = 'LOGIN_PROVIDER_ACTION';

  constructor(public payload?: string ) {
  }
}

export const CREATE_ACCOUNT_ACTION = 'CREATE_ACCOUNT_ACTION';

export class CreateAccountAction implements Action {

  readonly type = 'CREATE_ACCOUNT_ACTION';

  constructor(public payload: CreateAccount ) {
  }
}

export const STORE_USERDATA_ACTION = 'STORE_USERDATA_ACTION';

export class SaveUserDataAction implements Action {

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

export const ADD_REDIRECT_LOGIN_ACTION = 'ADD_REDIRECT_LOGIN_ACTION';

export class AddRedirectUrlAction implements Action {

  readonly type = 'ADD_REDIRECT_LOGIN_ACTION';

  constructor(public payload: string) {
  }
}
