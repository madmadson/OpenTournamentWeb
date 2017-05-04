import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {MdSnackBar} from '@angular/material';
import {CustomValidators} from 'ng2-validation';

import * as moment from 'moment';
import {Tournament} from '../../../../shared/model/tournament';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'tournament-form',
  templateUrl: './tournament-form.component.html',
  styleUrls: ['./tournament-form.component.css']
})
export class TournamentFormComponent implements OnInit {

  @Input() tournament: Tournament;
  @Output() onSaveTournament = new EventEmitter<Tournament>();

  tournamentForm: FormGroup;
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

  constructor(protected fb: FormBuilder,
              protected snackBar: MdSnackBar) {

  }

  ngOnInit() {
    this.initForm();
    this.handleError();
    this.listenOnTeamTournamentCheckbox();
  }

  initForm() {
    const initialBeginDate = moment().weekday(6).hours(10).minutes(0).add(1, 'week').format(this.dateFormat);
    const initialEndDate = moment().weekday(6).hours(20).minutes(0).add(1, 'week').format(this.dateFormat);


    this.tournamentForm = this.fb.group({
      name: [this.tournament.name,
        Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])],
      location: [this.tournament.location,
        Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])],
      beginDate: [this.tournament.beginDate ?
                  moment(this.tournament.beginDate).format(this.dateFormat) :
                  initialBeginDate, Validators.required],
      endDate: [this.tournament.endDate ?
                moment(this.tournament.endDate).format(this.dateFormat) :
                initialEndDate, Validators.required],
      teamTournament: [this.tournament.teamSize > 0],
      teamSize: [this.tournament.teamSize],
      maxParticipants: [this.tournament.maxParticipants,
        Validators.compose([Validators.required, CustomValidators.min(2), CustomValidators.max(9999)])]
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
        this.tournamentForm.get('teamSize').setValidators(
          Validators.compose([Validators.required, CustomValidators.min(2), CustomValidators.max(20)])
        );
        this.tournamentForm.get('teamSize').updateValueAndValidity();
        this.tournamentForm.get('teamSize').setValue(3);

      } else {
        this.tournamentForm.get('teamSize').clearValidators();
        this.tournamentForm.get('teamSize').updateValueAndValidity();
        this.tournamentForm.get('teamSize').setValue(0);
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


  prepareSaveTournament(): Tournament {
    const formModel = this.tournamentForm.value;

    return  {
      id: this.tournament.id ? this.tournament.id : '',
      name: formModel.name as string,
      location: formModel.location as string,
      beginDate: formModel.beginDate as string,
      endDate: formModel.endDate as string,
      actualRound: 0,
      visibleRound: 0,
      maxParticipants: formModel.maxParticipants as number,
      actualParticipants: 0,
      teamSize: formModel.teamSize as number,
      creatorUid: this.tournament.creatorUid,
      finished: false,
      uploaded: false
    };
  }

  saveTournament() {
    const tournament = this.prepareSaveTournament();
    this.onSaveTournament.emit(tournament);
  }
}
