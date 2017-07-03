import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {LoginAction, LoginWithProviderAction} from '../../store/actions/auth-actions';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private store: Store<ApplicationState>,
              private router: Router) {
    this.createForm();

    this.subscription = store.select(state => state.authenticationStoreState).subscribe(authenticationStoreState => {
      if (authenticationStoreState.loggedIn !== false) {
        this.router.navigate([authenticationStoreState.redirectUrl ? authenticationStoreState.redirectUrl : '/home']);
      }
     }
   );
  }
  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required ],
      password: ['', Validators.required ],
    });
  }


  ngOnInit() {}

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }

  login() {
    this.store.dispatch(new LoginAction({email: this.loginForm.get('email').value, password: this.loginForm.get('password').value}));
  }

  loginWithProvider(loginProvider?: string) {

    this.store.dispatch(new LoginWithProviderAction(loginProvider));

  }

  register() {
    this.router.navigate(['/register']);
  }

  passwordForget() {
    this.router.navigate(['/password-forget']);
  }
}
