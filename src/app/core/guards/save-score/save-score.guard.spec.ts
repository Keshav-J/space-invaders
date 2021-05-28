import { TestBed } from '@angular/core/testing';

import { SaveScoreGuard } from './save-score.guard';

describe('SaveScoreGuard', () => {
  let guard: SaveScoreGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SaveScoreGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
