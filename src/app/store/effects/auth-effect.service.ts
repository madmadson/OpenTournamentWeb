import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {
  AUTH_SUBSCRIBE_ACTION, CREATE_ACCOUNT_ACTION, LOGIN_ACTION, LOGIN_PROVIDER_ACTION,
  LOGOUT_ACTION, RESET_PASSWORD_ACTION
} from '../actions/auth-actions';
import {LoginService} from '../../service/auth.service';

@Injectable()
export class AuthEffectService {

  constructor(
    private actions$: Actions,
    private loginService: LoginService
  ) { }

  @Effect({dispatch: false}) login = this.actions$
    .ofType(LOGIN_ACTION)
    .debug('LOGIN_ACTION')
    .map(action => this.loginService.loginWithEmailAndPassword(action.payload));

  @Effect({dispatch: false}) authSub = this.actions$
    .ofType(AUTH_SUBSCRIBE_ACTION)
    .debug('AUTH_SUBSCRIBE_ACTION')
    .map(action => this.loginService.subscribeOnAuthentication());

  @Effect({dispatch: false}) resetPassword = this.actions$
    .ofType(RESET_PASSWORD_ACTION)
    .debug('RESET_PASSWORD_ACTION')
    .map(action => this.loginService.resetPassword(action.payload));

  @Effect({dispatch: false}) loginProvider = this.actions$
    .ofType(LOGIN_PROVIDER_ACTION)
    .debug('LOGIN_PROVIDER_ACTION')
    .map(action => this.loginService.loginWithProvider(action.payload));

  @Effect({dispatch: false}) createAccount = this.actions$
    .ofType(CREATE_ACCOUNT_ACTION)
    .debug('CREATE_ACCOUNT_ACTION')
    .map(action => this.loginService.createAccount(action.payload));


  @Effect({dispatch: false}) logout = this.actions$
    .ofType(LOGOUT_ACTION)
    .debug('LOGOUT_ACTION')
    .map(action => this.loginService.logout());

}
