import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {SOCIAL_LOGIN_ACTION, LOGOUT_ACTION} from "../actions";
import {LoginService} from "../../service/login.service";

@Injectable()
export class LoginEffectService {

  constructor(
    private actions$: Actions,
    private fbLogin: LoginService
  ) { }

  @Effect({dispatch: false}) login$ = this.actions$
    .ofType(SOCIAL_LOGIN_ACTION)
    .debug("SOCIAL_LOGIN_ACTION")
    .map(action => this.fbLogin.login(action.payload));

  @Effect({dispatch: false}) logout$ = this.actions$
    .ofType(LOGOUT_ACTION)
    .debug("LOGOUT_ACTION")
    .map(action => this.fbLogin.logout());



}
