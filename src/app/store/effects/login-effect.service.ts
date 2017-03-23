import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {LOGOUT_ACTION, LOGIN_ACTION} from "../actions";
import {LoginService} from "../../service/login.service";
import {routerActions} from "@ngrx/router-store";

@Injectable()
export class LoginEffectService {

  constructor(
    private actions$: Actions,
    private fbLogin: LoginService
  ) { }

  @Effect({dispatch: false}) login = this.actions$
    .ofType(LOGIN_ACTION)
    .debug("LOGIN_ACTION")
    .map(action => this.fbLogin.login(action.payload));


  @Effect({dispatch: false}) logout = this.actions$
    .ofType(LOGOUT_ACTION)
    .debug("LOGOUT_ACTION")
    .map(action => this.fbLogin.logout());

  @Effect({dispatch: false}) checkLogin = this.actions$
    .ofType(routerActions.UPDATE_LOCATION)
    .debug("UPDATE_LOCATION")
    .map(action => this.fbLogin.routeToLoginPageWhenUnauthenticated(action.payload));

}
