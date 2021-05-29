import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { DScores } from 'src/app/core/constants/defaults';
import { ROUTES } from 'src/app/core/constants/urlconstants';
import { IScore } from 'src/app/core/models/models';
import { ScoresService } from 'src/app/core/services/scores/scores.service';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.scss'],
})
export class HighscoresComponent implements OnInit {
  scores: IScore[] = DScores;
  isInstructions = false;
  gameRoute = ROUTES.GAME;

  constructor(private scoresService: ScoresService) {}

  ngOnInit(): void {
    // Get the local Highscores list
    this.scores = this.scoresService.getScores();
    // Get new Highscores list from Backend API
    this.scoresService.getHighScores()
      .pipe(take(1))
      .subscribe((scores: IScore[]) => {
        this.scores = scores;
      });
  }

  /**
   * Toggle between Highscores and Instructions
   */
  toggle(): void {
    this.isInstructions = !this.isInstructions;
  }
}
