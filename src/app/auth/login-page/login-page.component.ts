import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {LoginAction, LoginWithProviderAction} from '../../store/actions/auth-actions';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private store: Store<ApplicationState>,
              private router: Router,
              private snackBar: MdSnackBar) {
    this.createForm();

    this.subscription = store.select(state => state.authenticationState).subscribe(authenticationState => {
      if (authenticationState.loggedIn !== false) {
        this.router.navigate([authenticationState.redirectUrl ? authenticationState.redirectUrl : '/home']);
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
