import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot} from '@angular/router';

import {AuthService} from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {

    return this.authService.isLoggedIn();

  }

  canLoad(route: Route): boolean {

    return this.authService.isLoggedIn();

  }

}
