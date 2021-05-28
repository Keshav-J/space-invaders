import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { Score } from 'src/app/core/models/models';
import { ScoresService } from 'src/app/core/services/scores/scores.service';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.scss'],
})
export class HighscoresComponent implements OnInit {
  scores: Score[] = [];
  isInstructions = false;

  constructor(private scoresService: ScoresService) {}

  ngOnInit() {
    this.scores = this.scoresService.getScores();
    this.scoresService
      .getHighScores()
      .pipe(take(1))
      .subscribe((scores: Score[]) => {
        this.scores = scores;
      });
  }

  toggle(): void {
    this.isInstructions = !this.isInstructions;
  }
}
