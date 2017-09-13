import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {LoginAction, LoginWithProviderAction} from '../../store/actions/auth-actions';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppState} from '../../store/reducers/index';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent  {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private store: Store<AppState>,
              private router: Router) {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required ],
      password: ['', Validators.required ],
    });
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
