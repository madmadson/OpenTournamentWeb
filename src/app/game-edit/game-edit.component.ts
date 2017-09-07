import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import {Game} from './game';
import {AngularFireDatabase} from 'angularfire2/database';


@Component({
  selector: 'game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css']
})
export class GameEditComponent implements OnInit, OnChanges {

  @Input() game: Game;

  gameForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private db: AngularFireDatabase, public snackBar: MdSnackBar) {
    this.createForm();

    if (this.game == null){
      this.game = new Game(null, '');
    }
  }

  createForm() {
    this.gameForm = this.formBuilder.group({
      name: ['', Validators.required ],
    });
  }

  ngOnInit() {
  }
  ngOnChanges(): void {

    this.gameForm.reset({
      name: this.game.name
    });
  }
  prepareSaveGame(): Game {
    const formModel = this.gameForm.value;

    const saveGame: Game = {
      id: this.game.id,
      name: formModel.name as string
    };
    return saveGame;
  }

  revert(): void {
     this.ngOnChanges();
  }

  onSubmit() {
    this.game = this.prepareSaveGame();

    this.db.list('games').push(this.game);
    this.snackBar.open('Game was created', '', {
      duration: 2000,
    });

    this.ngOnChanges();
  }
}
