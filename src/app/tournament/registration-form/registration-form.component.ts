import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Store} from "@ngrx/store";
import {MdSnackBar} from "@angular/material";
import {ApplicationState} from "../../store/application-state";
import {Router} from "@angular/router";
import {RegistrationPushAction} from "../../store/actions/tournament-actions";
import {RegistrationVM} from "../registration.vm";

import * as moment from "moment";

@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {

  registrationForm: FormGroup;


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store<ApplicationState>,
    public snackBar: MdSnackBar) {

  }

  ngOnInit() {

    this.initForm();
  }

  initForm() {


    this.registrationForm = this.formBuilder.group({

    });
  }
  onSaveRegistration() {

    const registration = this.prepareSaveRegistration();
    this.store.dispatch(new RegistrationPushAction(registration));
    // this.af.database.list('tournaments').push(this.tournament);
    this.snackBar.open('Registration successful', '', {
      duration: 2000,
    });

  }

  prepareSaveRegistration(): RegistrationVM {
    const formModel = this.registrationForm.value;

    return  {
      id: undefined,
      tournamentId: '987',
      name: 'Bob',
      origin: 'Walldorf',
      meta: 'Ober',
      registrationDate: moment().format(),
      teamName: 'team',
      playerId: '123',
      teamId: '456'
    };
  }

}
