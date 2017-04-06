import {Component, OnInit} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {composeValidators} from '@angular/forms/src/directives/shared';
import {CustomValidators} from 'ng2-validation';
import {ApplicationState} from '../store/application-state';
import {Store} from '@ngrx/store';
import {CreateAccountAction} from '../store/actions/auth-actions';

@Component({
  selector: 'register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  registerForm: FormGroup;

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Must be a valid email'
    }
  };

  constructor(private formBuilder: FormBuilder,
              private store: Store<ApplicationState>) {

  }

  ngOnInit() {

    this.initForm();

    this.handleError();
  }

  initForm() {
    const password = new FormControl('', composeValidators([Validators.required, Validators.minLength(6)]));

    this.registerForm = this.formBuilder.group({
      email: ['', composeValidators([Validators.required, CustomValidators.email])],
      password: password,
      certainPassword: ['', composeValidators([Validators.required, CustomValidators.equalTo(password)])],
    });
  }

  private handleError() {
    this.registerForm.valueChanges
      .subscribe(() => this.onValueChanged());
    this.onValueChanged();
  }

  onValueChanged() {
    if (!this.registerForm) {
      return;
    }

    const form = this.registerForm;
    for (const field of Object.keys(this.registerForm.controls)) {

      const formField = form.get(field);

      if (formField && formField.dirty && !formField.valid) {
        const messages = this.validationMessages[field];

        if (messages) {
          for (const key of Object.keys(formField.errors)) {
            formField.setErrors({'message': messages[key]});
          }
        }
      }
    }
  }


  register() {

    const registerModel = this.prepareRegister();


    this.store.dispatch(new CreateAccountAction(registerModel));
  }


  private prepareRegister(): any {

    const formModel = this.registerForm.value;

    return {
      email: formModel.email as string,
      password: formModel.password as string,
      passwordRepeat: formModel.certainPassword as string,
    };

  }
}
