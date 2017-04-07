import {Component, OnInit} from '@angular/core';
import {TournamentVM} from '../tournament.vm';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../../store/application-state';
import {composeValidators} from '@angular/forms/src/directives/shared';
import {CustomValidators} from 'ng2-validation';
import {TournamentPushAction} from '../../store/actions/tournaments-actions';
import {Router} from '@angular/router';

import * as moment from 'moment';


@Component({
  selector: 'tournament-new',
  templateUrl: './tournament-new.component.html',
  styleUrls: ['./tournament-new.component.css']
})
export class TournamentNewComponent implements OnInit {

  tournamentForm: FormGroup;

  creatorId: string;

  dateFormat = 'dd, M/D/YY HH:mm';

  validationMessages = {
    'name': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 5 characters long.',
      'maxlength': 'Name cannot be more than 30 characters long.'
    },
    'location': {
      'required': 'Location is required.',
      'minlength': 'Location must be at least 5 characters long.',
      'maxlength': 'Location cannot be more than 30 characters long.'
    },
    'maxParticipants': {
      'required': 'MaxParticipants is required.',
      'min': 'Minimum MaxParticipants is 2',
      'max': 'Maximum MaxParticipants is 9999'
    },
    'teamSize': {
      'required': 'TeamSize is required.',
      'min': 'Minimum TeamSize is 2',
      'max': 'Maximum TeamSize is 20'
    }
  };

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store<ApplicationState>,
    public snackBar: MdSnackBar) {

  }

  ngOnInit() {
    this.store.select(state => state.uiState.currentUserId).subscribe(currentUserId => this.creatorId = currentUserId);

    this.initForm();

    this.handleError();

    this.listenOnTeamTournamentCheckbox();

  }

  initForm() {

    const initialBeginDate = moment().weekday(6).hours(10).minutes(0).add(1, 'week').format(this.dateFormat);
    const initialEndDate = moment().weekday(6).hours(20).minutes(0).add(1, 'week').format(this.dateFormat);

    this.tournamentForm = this.formBuilder.group({
      name: ['', composeValidators([Validators.required, Validators.minLength(5), Validators.maxLength(30)])],
      location: ['', composeValidators([Validators.required, Validators.minLength(5), Validators.maxLength(30)])],
      beginDate: [initialBeginDate, Validators.required],
      endDate: [initialEndDate, Validators.required],
      teamTournament: [''],
      teamSize: [''],
      maxParticipants: ['', composeValidators([Validators.required, CustomValidators.min(2), CustomValidators.max(9999)])]
    });
  }

  handleError() {
    this.tournamentForm.valueChanges
      .subscribe(() => this.onValueChanged());
    this.onValueChanged();
  }

  listenOnTeamTournamentCheckbox() {
    const changes$ = this.tournamentForm.get('teamTournament').valueChanges;

    changes$.subscribe(teamTournament => {
      if (teamTournament) {
        console.log('is TeamTournament:');
        this.tournamentForm.get('teamSize').setValidators(
          composeValidators([Validators.required, CustomValidators.min(2), CustomValidators.max(20)])
        );
        this.tournamentForm.get('teamSize').updateValueAndValidity();

      } else {
        console.log('is not TeamTournament:');
        this.tournamentForm.get('teamSize').clearValidators();
        this.tournamentForm.get('teamSize').updateValueAndValidity();
      }
    });
  }

  onValueChanged() {
    if (!this.tournamentForm) {
      return;
    }
    const form = this.tournamentForm;
    for (const field of Object.keys(this.tournamentForm.controls)) {

      const formField = form.get(field);

      if (formField && formField.dirty && !formField.valid) {
        const messages = this.validationMessages[field];
        for (const key of Object.keys(formField.errors)) {

          console.log('errors: ' + key + ' message: ' + messages[key]);
          formField.setErrors({'message': messages[key]});
        }
      }
    }
  }

  setBeginDate(start: any): any {

    if (moment(start).isAfter(moment().add(1, 'year'))) {
      this.tournamentForm.get('beginDate').setValue(
        moment().add(1, 'year').add(-1, 'week').weekday(6).hours(10).minutes(0).format(this.dateFormat)
      );
      this.tournamentForm.get('endDate').setValue(
        moment().add(1, 'year').add(-1, 'week').weekday(6).hours(20).minutes(0).format(this.dateFormat)
      );

      this.snackBar.open('Maximum tournament date us one year ahead', '', {
        duration: 3000,
        extraClasses: ['info']
      });
    } else if (moment(start).isBefore(moment())) {
      this.tournamentForm.get('beginDate').setValue(
        moment().weekday(6).hours(10).minutes(0).add(1, 'week').format(this.dateFormat)
      );

      this.snackBar.open('Tournament cant be in past', '', {
        duration: 3000,
        extraClasses: ['info']
      });
    } else if (moment(start).isAfter(moment(this.tournamentForm.get('endDate').value))) {
      this.tournamentForm.get('beginDate').setValue(moment(start).format(this.dateFormat));
      this.tournamentForm.get('endDate').setValue(moment(start).add(10, 'hours').format(this.dateFormat));

      this.snackBar.open('Begin before End. Set End start +10hours', '', {
        duration: 3000,
        extraClasses: ['info']
      });
    } else {
      this.tournamentForm.get('beginDate').setValue(moment(start).format(this.dateFormat));
    }
  }

  setEndDate(end: any): any {
    if (moment(end).isAfter(moment().add(1, 'year'))) {
      this.tournamentForm.get('beginDate').setValue(
        moment().add(1, 'year').add(-1, 'week').weekday(6).hours(10).minutes(0).format(this.dateFormat)
      );
      this.tournamentForm.get('endDate').setValue(
        moment().add(1, 'year').add(-1, 'week').weekday(6).hours(20).minutes(0).format(this.dateFormat)
      );
      this.snackBar.open('Maximum tournament date us one year ahead', '', {
        duration: 3000,
      });
    } else if (moment(end).isBefore(moment())) {
      this.tournamentForm.get('endDate').setValue(
        moment().weekday(6).hours(20).minutes(0).add(1, 'week').format(this.dateFormat)
      );


      this.snackBar.open('Tournament cant be in past', '', {
        duration: 3000,
      });
    } else if (moment(end).isBefore(moment(this.tournamentForm.get('beginDate').value))) {
      this.tournamentForm.get('beginDate').setValue(moment(end).add(-10, 'hours').format(this.dateFormat));
      this.tournamentForm.get('endDate').setValue(moment(end).format(this.dateFormat));

      this.snackBar.open('Begin before End. Set Begin end -10hours', '', {
        duration: 3000,
      });
    } else {
      this.tournamentForm.get('endDate').setValue(moment(end).format(this.dateFormat));
    }
  }


  prepareSaveTournament(): TournamentVM {
    const formModel = this.tournamentForm.value;

    return  {
      id: undefined,
      name: formModel.name as string,
      location: formModel.location as string,
      beginDate: formModel.beginDate as string,
      endDate: formModel.endDate as string,
      actualRound: 0,
      maxParticipants: formModel.maxParticipants as number,
      teamSize: formModel.teamSize as number,
      creatorUid: this.creatorId
    };
  }


  onSaveTournament() {
    const tournament = this.prepareSaveTournament();

    this.store.dispatch(new TournamentPushAction(tournament));

  }


}
