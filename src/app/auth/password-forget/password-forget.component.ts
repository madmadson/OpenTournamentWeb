import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {CustomValidators} from 'ng2-validation';
import {ResetPasswordAction} from '../../store/actions/auth-actions';

@Component({
  selector: 'password-forget',
  templateUrl: './password-forget.component.html',
  styleUrls: ['./password-forget.component.scss']
})
export class PasswordForgetComponent implements OnInit {

  passwordForm: FormGroup;

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Must be a valid userEmail'
    }
  };

  constructor(  @Inject(FormBuilder) protected formBuilder: FormBuilder,
              private store: Store<ApplicationState>) { }

  ngOnInit() {

    this.initForm();

    this.handleError();
  }

  initForm() {


    this.passwordForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
    });
  }

  private handleError() {
    this.passwordForm.valueChanges
      .subscribe(() => this.onValueChanged());
    this.onValueChanged();
  }

  onValueChanged() {
    if (!this.passwordForm) {
      return;
    }

    const form = this.passwordForm;
    for (const field of Object.keys(this.passwordForm.controls)) {

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


  sendEmail() {
    this.store.dispatch(new ResetPasswordAction(this.passwordForm.get('email').value));
  }

}
