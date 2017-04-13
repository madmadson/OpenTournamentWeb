import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot} from '@angular/router';
import {ApplicationState} from '../store/application-state';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import {AddRedirectUrlAction} from '../store/actions/auth-actions';


@Injectable()
export class AuthGuard implements OnDestroy, CanActivate, CanLoad {

  private subscription: Subscription;

  loggedIn: boolean;

  constructor(private store: Store<ApplicationState>, private router: Router) {
    this.subscription = store.select(state => state.globalState.loggedIn).subscribe(loggedIn => {

        this.loggedIn = loggedIn;
      }
    );
  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();

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
