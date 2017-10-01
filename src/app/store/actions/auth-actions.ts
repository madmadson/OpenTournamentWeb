import {Action} from '@ngrx/store';
import {UserData} from '../../../../shared/model/user-data';
import {Player} from '../../../../shared/model/player';


export const AUTH_SUBSCRIBE_ACTION = 'AUTH_SUBSCRIBE_ACTION';
export class AuthSubscribeAction implements Action {

  readonly type = 'AUTH_SUBSCRIBE_ACTION';
  constructor() {
  }
}

export const LOGIN_ACTION = 'LOGIN_ACTION';
export class LoginAction implements Action {

  readonly type = 'LOGIN_ACTION';
  constructor(public payload: any ) {
  }
}

export const RESET_PASSWORD_ACTION = 'RESET_PASSWORD_ACTION';

export class ResetPasswordAction implements Action {

  readonly type = 'RESET_PASSWORD_ACTION';
  constructor(public payload: string ) {
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

export const SAVE_USERDATA_ACTION = 'SAVE_USERDATA_ACTION';
export class SaveUserDataAction implements Action {

  readonly type = 'SAVE_USERDATA_ACTION';
  constructor(public payload: UserData ) {
  }
}

export const SAVE_USER_PLAYER_DATA_ACTION = 'SAVE_USER_PLAYER_DATA_ACTION';
export class SaveUserPlayerDataAction implements Action {

  readonly type = 'SAVE_USER_PLAYER_DATA_ACTION';
  constructor(public payload: Player ) {
  }
}

export const DELETE_USER_PLAYER_DATA_ACTION = 'DELETE_USER_PLAYER_DATA_ACTION';
export class DeleteUserPlayerDataAction implements Action {

  readonly type = 'DELETE_USER_PLAYER_DATA_ACTION';
  constructor() {
  }
}

export const LOGOUT_ACTION = 'LOGOUT_ACTION';
export class LogoutAction implements Action {

  readonly type = 'LOGOUT_ACTION';
  constructor() {
  }
}

export const ADD_REDIRECT_LOGIN_ACTION = 'ADD_REDIRECT_LOGIN_ACTION';

