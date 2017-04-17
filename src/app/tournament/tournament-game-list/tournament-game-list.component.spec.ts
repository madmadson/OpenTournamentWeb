import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentGameListComponent } from './tournament-game-list.component';

describe('TournamentGameListComponent', () => {
  let component: TournamentGameListComponent;
  let fixture: ComponentFixture<TournamentGameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentGameListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentGameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
