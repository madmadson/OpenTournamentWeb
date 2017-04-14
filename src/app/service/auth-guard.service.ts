import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot} from '@angular/router';
import {ApplicationState} from '../store/application-state';
import {Store} from '@ngrx/store';
import {AddRedirectUrlAction} from '../store/actions/auth-actions';


@Injectable()
export class AuthGuard implements OnInit, OnDestroy, CanActivate, CanLoad {


  loggedIn: boolean;

  constructor(private store: Store<ApplicationState>, private router: Router) {
    this.store.select(state => state.authenticationStoreData.loggedIn).subscribe(loggedIn => {

        this.loggedIn = loggedIn;
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  canActivate(route: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): boolean {
    const url: string = routerStateSnapshot.url;
    return this.checkLogin(url);
  }

  canLoad(route: Route): boolean {

    const url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string ): boolean {
    if (this.loggedIn) { return true; }

    this.store.dispatch(new AddRedirectUrlAction(url));

    this.router.navigate(['/login']);
    return false;
  }
}
