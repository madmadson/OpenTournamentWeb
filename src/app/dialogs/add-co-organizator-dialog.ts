import {Component, EventEmitter, Inject, Output} from '@angular/core';

import {MD_DIALOG_DATA, MdDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import {CoOrganizatorPush} from '../../../shared/dto/co-organizator-push';
import {Tournament} from '../../../shared/model/tournament';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'add-co-organizators-dialog',
  templateUrl: './add-co-organizator-dialog.html'
})
export class AddCoOrganizatorDialogComponent {

  @Output() onAddCoOrganizator = new EventEmitter<CoOrganizatorPush>();
  @Output() onDeleteCoOrganizator = new EventEmitter<CoOrganizatorPush>();

  coOrganizatorEmailFormControl = new FormControl('', [
    Validators.pattern(EMAIL_REGEX)
  ]);

  emails: string[];
  tournament: Tournament;

  constructor(public dialogRef: MdDialogRef<AddCoOrganizatorDialogComponent>,
              @Inject(MD_DIALOG_DATA) public data: any) {


    this.emails = data.emails;
    this.tournament = data.tournament;
  }

  deleteCoOrganizator(email: string) {

    this.onDeleteCoOrganizator.emit({
      tournament: this.tournament,
      coOrganizatorEmail: email
    });
  }

  addCoOrganizator() {

    this.onAddCoOrganizator.emit({
      tournament: this.tournament,
      coOrganizatorEmail: this.coOrganizatorEmailFormControl.value
    });
  }

}
