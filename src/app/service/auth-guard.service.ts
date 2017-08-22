import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot} from '@angular/router';
import {ApplicationState} from '../store/application-state';
import {Store} from '@ngrx/store';
import {AddRedirectUrlAction} from '../store/actions/auth-actions';
import {Subscription} from 'rxjs/Subscription';


@Injectable()
export class AuthGuard implements OnDestroy, CanActivate, CanLoad {

  private loggedInSubscription: Subscription;
  private loggedIn: boolean;

  constructor(private store: Store<ApplicationState>, private router: Router) {
    this.loggedInSubscription = this.store.select(state => state.authenticationStoreState.loggedIn).subscribe(loggedIn => {

        this.loggedIn = loggedIn;
      }
    );
  }


  ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
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
