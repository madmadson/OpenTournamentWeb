import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {LOGOUT_ACTION, LOGIN_ACTION} from "../actions/auth-actions";
import {LoginService} from "../../service/auth.service";
import {routerActions} from "@ngrx/router-store";

@Injectable()
export class AuthEffectService {

  constructor(
    private actions$: Actions,
    private loginService: LoginService
  ) { }

  @Effect({dispatch: false}) login = this.actions$
    .ofType(LOGIN_ACTION)
    .debug("LOGIN_ACTION")
    .map(action => this.loginService.login(action.payload));


  @Effect({dispatch: false}) logout = this.actions$
    .ofType(LOGOUT_ACTION)
    .debug("LOGOUT_ACTION")
    .map(action => this.loginService.logout());

  @Effect({dispatch: false}) checkLogin = this.actions$
    .ofType(routerActions.UPDATE_LOCATION)
    .debug("UPDATE_LOCATION")
    .map(action => this.loginService.routeToLoginPageWhenUnauthenticated(action.payload));

}
