import {Component, Input, OnChanges, OnInit} from "@angular/core";
import {TournamentVM} from "../tournament.vm";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {MdSnackBar} from "@angular/material";


import {Store} from "@ngrx/store";
import {ApplicationState} from "../../store/application-state";


import * as moment from "moment";


@Component({
  selector: 'tournament-new',
  templateUrl: './tournament-new.component.html',
  styleUrls: ['./tournament-new.component.css']
})
export class TournamentNewComponent implements OnInit, OnChanges {

  @Input() tournament: TournamentVM;
  tournamentForm: FormGroup;
  beginDate: any;
  endDate: any;

  teamSize: number;
  isTeamTournament: boolean;

  creatorId: string;

  constructor(private formBuilder: FormBuilder, private store: Store<ApplicationState>, public snackBar: MdSnackBar) {
    this.createForm();

    this.store.select(state => state.uiState.currentUserId).subscribe(currentUserId => this.creatorId = currentUserId);

    this.teamSize = 0;
    this.beginDate = moment().weekday(6).hours(10).minutes(0);
    this.endDate = moment().weekday(6).hours(20).minutes(0);
  }
  setBeginDate(start: any): any {

    this.beginDate = start;
    // Do whatever you want to the return object 'moment'
  }

  setEndDate(end: any): any {
    this.endDate = end;
    // Do whatever you want to the return object 'moment'
  }

  ngOnInit() {
  }

  createForm() {
    this.tournamentForm = this.formBuilder.group({
      name: ['', Validators.required ],
      location: ['', Validators.required ],
      beginDate: ['', Validators.required ],
      endDate: ['', Validators.required ],
      teamSize: [''],
      maxParticipants: ['', Validators.required ],
    });
  }

  ngOnChanges(): void {

    this.tournamentForm.reset({
      name: this.tournament.name,
      location: this.tournament.location,
      beginDate: this.tournament.beginDate,
      endDate: this.tournament.endDate,
      teamSize: this.tournament.teamSize,
      maxParticipants: this.tournament.maxParticipants,
    });
  }
  prepareSaveTournament(): TournamentVM {
    const formModel = this.tournamentForm.value;

    const saveTournament: TournamentVM = {
      name: formModel.name as string,
      location: formModel.location as string,
      beginDate: formModel.beginDate as string,
      endDate: formModel.endDate as string,
      actualRound: 0,
      maxParticipants: formModel.maxParticipants as number,
      teamSize: formModel.teamSize as number,
      creatorUid: this.creatorId
    };
    return saveTournament;
  }

  revert(): void {
    this.ngOnChanges();
  }

  onSubmit() {
    this.tournament = this.prepareSaveTournament();

    console.log('tournament: ' + JSON.stringify(this.tournament));

    // this.af.database.list('tournaments').push(this.tournament);
    this.snackBar.open('Tournament was created', '', {
      duration: 2000,
    });

    this.ngOnChanges();
  }

  toggleTeamTournament(){
      this.isTeamTournament = !this.isTeamTournament;
  }
}
