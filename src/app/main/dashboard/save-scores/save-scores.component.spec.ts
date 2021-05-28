import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveScoresComponent } from './save-scores.component';

describe('SaveScoresComponent', () => {
  let component: SaveScoresComponent;
  let fixture: ComponentFixture<SaveScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveScoresComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
