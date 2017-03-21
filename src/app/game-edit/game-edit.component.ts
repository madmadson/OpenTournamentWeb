import {Component, OnInit, OnChanges, Input} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {MdSnackBar} from "@angular/material";
import {Game} from "./game";
import {AngularFire} from "angularfire2";

@Component({
  selector: 'game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css']
})
export class GameEditComponent implements OnInit, OnChanges {

  @Input() game: Game;

  gameForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private af: AngularFire,public snackBar: MdSnackBar) {
    this.createForm();

    if(this.game == null){
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

    this.af.database.list("games").push(this.game);
    this.snackBar.open("Game was created", "", {
      duration: 2000,
    });

    this.ngOnChanges();
  }
}
