import {Component, OnDestroy, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {ApplicationState} from "../store/application-state";
import {LoginAction} from "../store/actions/auth-actions";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MdSnackBar} from "@angular/material";

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
              private  router: Router,
              private snackBar: MdSnackBar) {
    this.createForm();

    this.subscription = store.select(state => state.uiState).subscribe(uiState => {
      if (uiState.loggedIn !== false) {

        console.log('redirect loginPage: ' + JSON.stringify(uiState.redirectUrl));
        this.router.navigate([uiState.redirectUrl ? uiState.redirectUrl : '/home']);
      }
     }
   );
  }
  createForm() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required ],
      password: ['', Validators.required ],
    });
  }


  ngOnInit() {}

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }

  login(loginProvider?: string) {

    this.store.dispatch(new LoginAction(loginProvider));

  }
  onSubmit() {
    this.snackBar.open('Login', '', {
      duration: 2000,
    });
  }

  register() {
    this.snackBar.open('Register', '', {
      duration: 2000,
    });
  }
}
