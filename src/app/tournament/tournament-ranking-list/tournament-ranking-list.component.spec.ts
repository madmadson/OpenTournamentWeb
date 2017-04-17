import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentRankingListComponent } from './tournament-ranking-list.component';

describe('TournamentRankingListComponent', () => {
  let component: TournamentRankingListComponent;
  let fixture: ComponentFixture<TournamentRankingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentRankingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentRankingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
