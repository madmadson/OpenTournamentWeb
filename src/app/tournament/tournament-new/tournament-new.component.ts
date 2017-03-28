import {Component, Input, OnChanges, OnInit} from "@angular/core";
import {TournamentVM} from "../tournament.vm";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFire} from "angularfire2";
import {MdSnackBar} from "@angular/material";

import * as moment from "moment";

@Component({
  selector: 'tournament-new',
  templateUrl: './tournament-new.component.html',
  styleUrls: ['./tournament-new.component.css']
})
export class TournamentNewComponent implements OnInit, OnChanges {

  @Input() tournament: TournamentVM;
  tournamentForm: FormGroup;


  constructor(private formBuilder: FormBuilder, private af: AngularFire, public snackBar: MdSnackBar) {
    this.createForm();

    if (this.tournament == null) {
      this.tournament = {
        name: 'InitialTournament',
        location: 'Karlsruhe',
        beginDate: moment('2017-03-12').format(),
        endDate: moment('2017-03-12').format(),
        actualRound: 0,
        maxParticipants: 16,
        teamSize: 1,
        creatorUid: '1'};
    }
  }

  ngOnInit() {
  }

  createForm() {
    this.tournamentForm = this.formBuilder.group({
      name: ['', Validators.required ],
    });
  }

  ngOnChanges(): void {

    this.tournamentForm.reset({
      name: this.tournament.name
    });
  }
  prepareSaveTournament(): TournamentVM {
    const formModel = this.tournamentForm.value;

    const saveTournament: TournamentVM = {
      name: formModel.name as string,
      location: 'Karlsruhe',
      beginDate: moment('2017-03-12').format(),
      endDate: moment('2017-03-12').format(),
      actualRound: 0,
      maxParticipants: 16,
      teamSize: 1,
      creatorUid: '1'
    };
    return saveTournament;
  }

  revert(): void {
    this.ngOnChanges();
  }

  onSubmit() {
    this.tournament = this.prepareSaveTournament();

    this.af.database.list('tournaments').push(this.tournament);
    this.snackBar.open('Tournament was created', '', {
      duration: 2000,
    });

    this.ngOnChanges();
  }
}
