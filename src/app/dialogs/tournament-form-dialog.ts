import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';

import {MD_DIALOG_DATA, MdDialogRef, MdSnackBar, MdDialog} from '@angular/material';
import {CustomValidators} from 'ng2-validation';

import * as moment from 'moment';

import { FormControl, FormGroup, Validators} from '@angular/forms';
import {StartTournamentDialogComponent} from '../tournament/tournament-preparation/tournament-preparation.component';
import {Tournament} from '../../../shared/model/tournament';
import {TournamentPlayer} from '../../../shared/model/tournament-player';
import {Registration} from '../../../shared/model/registration';
import {AddCoOrganizatorDialogComponent} from './add-co-organizator-dialog';
import {CoOrganizatorPush} from '../../../shared/dto/co-organizator-push';


@Component({
  selector: 'tournament-form-dialog',
  templateUrl: './tournament-form-dialog.html',
  styleUrls: ['./tournament-form-dialog.scss']
})
export class TournamentFormDialogComponent implements OnInit {

  @Output() onSaveTournament = new EventEmitter<Tournament>();

  @Output() onAddCoOrganizator = new EventEmitter<CoOrganizatorPush>();
  @Output() onDeleteCoOrganizator = new EventEmitter<CoOrganizatorPush>();

  tournament: Tournament;
  allActualTournamentPlayers: TournamentPlayer[];
  allRegistrations: Registration[];

  tournamentTeams: number;
  tournamentTeamRegistrations: number;

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

  constructor(public dialogRef: MdDialogRef<StartTournamentDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              protected snackBar: MdSnackBar,
              public dialog: MdDialog) {

    this.tournament = data.tournament;
    this.allActualTournamentPlayers = data.allActualTournamentPlayers;
    this.allRegistrations = data.allRegistrations;
    this.tournamentTeams = data.tournamentTeams;
    this.tournamentTeamRegistrations = data.tournamentTeamRegistrations;
  }

  ngOnInit() {
    this.initForm();
    this.handleError();
    this.listenOnTeamTournamentCheckbox();
  }

  initForm() {
    const initialBeginDate = moment().weekday(6).hours(10).minutes(0).add(1, 'week').format(this.dateFormat);
    const initialEndDate = moment().weekday(6).hours(20).minutes(0).add(1, 'week').format(this.dateFormat);

    this.tournamentForm = new FormGroup({
      name: new FormControl(this.tournament.name, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])),
      location: new FormControl(this.tournament.location, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(30)])),
      beginDate: new FormControl(this.tournament.beginDate ?
        moment(this.tournament.beginDate).format(this.dateFormat) :
        initialBeginDate, Validators.required),
      endDate:  new FormControl(this.tournament.endDate ?
        moment(this.tournament.endDate).format(this.dateFormat) :
        initialEndDate, Validators.required),

      teamTournament: new FormControl( {value: this.tournament.teamSize > 0,
        disabled:  (this.allActualTournamentPlayers.length > 0 ||
                    this.allRegistrations.length > 0 ||
                    this.tournamentTeams > 0 ||
                    this.tournamentTeamRegistrations > 0)
      }),
      teamSize: new FormControl(this.tournament.teamSize),
      dailyMail: new FormControl(this.tournament.dailyMail),
      maxParticipants: new FormControl(this.tournament.maxParticipants,
        Validators.compose([Validators.required, CustomValidators.min(2), CustomValidators.max(9999)])),
      description: new FormControl(this.tournament.description),
      payLink: new FormControl(this.tournament.payLink)
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
      actualRound: this.tournament.actualRound,
      visibleRound: this.tournament.visibleRound,
      maxParticipants: formModel.maxParticipants as number,
      actualParticipants: this.tournament.actualParticipants,
      teamSize: formModel.teamSize as number,
      creatorUid: this.tournament.creatorUid,
      creatorMail: this.tournament.creatorMail,
      dailyMail: formModel.dailyMail,
      finished: false,
      uploaded: false,
      payLink: formModel.payLink ? formModel.payLink as string : '',
      description:  formModel.description ? formModel.description as string : '',
      coOrganizators: this.tournament.coOrganizators ? this.tournament.coOrganizators : []
    };
  }

  saveTournament() {
    const tournament = this.prepareSaveTournament();
    this.onSaveTournament.emit(tournament);
  }

  openCoOrganizatorDialog() {
    const dialogRef = this.dialog.open(AddCoOrganizatorDialogComponent, {
      data: {
        tournament: this.tournament,
        emails: this.tournament.coOrganizators
      },
      width: '800px'
    });

    const saveCoOperatorSubscribe = dialogRef.componentInstance.onAddCoOrganizator
      .subscribe(coOrganizatorPush => {
        if (coOrganizatorPush) {
          this.onAddCoOrganizator.emit(coOrganizatorPush);
        }
      });

    const deleteCoOperatorSubscribe = dialogRef.componentInstance.onDeleteCoOrganizator
      .subscribe(coOrganizatorPush => {
        if (coOrganizatorPush) {
          this.onDeleteCoOrganizator.emit(coOrganizatorPush);
        }
      });
    dialogRef.afterClosed().subscribe(() => {

      saveCoOperatorSubscribe.unsubscribe();
      deleteCoOperatorSubscribe.unsubscribe();
    });
  }
}
