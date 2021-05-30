import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { DScores } from 'src/app/core/constants/defaults';
import { ROUTES } from 'src/app/core/constants/urlconstants';
import { CommonHelpers } from 'src/app/core/helpers/common.helper';
import { IScore } from 'src/app/core/models/models';
import { ScoresService } from 'src/app/core/services/scores/scores.service';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.scss'],
})
export class HighscoresComponent implements OnInit {
  scores: IScore[];
  isInstructions: boolean;
  isMobile: boolean;
  gameRoute: string;
  isNewUser: boolean;
  isLoading: boolean;

  constructor(private scoresService: ScoresService) {
    this.scores = DScores;
    this.isInstructions = !CommonHelpers.isOldUser();
    this.gameRoute = ROUTES.GAME;
    this.isMobile = CommonHelpers.isMobileDevice();
    this.isLoading = false;
    if (this.isInstructions) {
      CommonHelpers.setOldUser();
    }
  }

  ngOnInit(): void {
    // Get the local Highscores list
    this.scores = this.scoresService.getScores();
    // Get new Highscores list from Backend API
    this.isLoading = true;
    this.scoresService.getHighScores()
      .pipe(take(1))
      .subscribe((scores: IScore[]) => {
        this.scores = scores;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      });
  }

  /**
   * Toggle between Highscores and Instructions
   */
  toggle(): void {
    this.isInstructions = !this.isInstructions;
  }
}
