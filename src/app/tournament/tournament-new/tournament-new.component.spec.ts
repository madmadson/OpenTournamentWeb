import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {TournamentNewComponent} from "./tournament-new.component";

describe('TournamentNewComponent', () => {
  let component: TournamentNewComponent;
  let fixture: ComponentFixture<TournamentNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
