import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DScores } from '../../constants/defaults';
import { routeConstants } from '../../constants/routeConstants';
import { IScore, IUser } from '../../models/models';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {
  private scores: IScore[] = DScores;
  private isNewHighScore = false;

  constructor(private http: HttpClient, private userService: UserService) {}

  /**
   * Function to get list of Highscores from Backend API
   * @returns List of Highscores (Top 10)
   */
  getHighScores(): Observable<IScore[]> {
    return this.http
      .get<IScore[]>(environment.baseURL + routeConstants.getScores, {})
      .pipe(
        map((response) => {
          this.scores = response;
          return response;
        })
      );
  }

  /**
   * Function to update Highscores and get updated list of Highscores from backend API
   * @returns List of updated Highscores (Top 10)
   */
  updateHighscores(): Observable<IScore[]> {
    // Get User name and score of current user from UserService
    const currentUser: IUser = this.userService.getUser();
    const params = {
      name: currentUser.name,
      score: currentUser.score,
    };
    return this.http
      .put<IScore[]>(environment.baseURL + routeConstants.setScores, params)
      .pipe(
        map((response) => {
          this.scores = response;
          this.setIsNewHighScore(false);
          this.userService.setUserScore(0);
          return response;
        })
      );
  }

  /**
   * Check if the score will get a place in the Highscores board
   * @param score Score to check
   * @returns True if the score will get a place in Highscores board
   */
  checkHighScore(score: number): boolean {
    this.userService.setUserScore(score);
    if (this.scores.length < 10 || score >= this.scores[this.scores.length - 1].score) {
      return true;
    }
    return false;
  }

  /**
   * Get the list of Highscores stored in the ScoresService
   * @returns List of Highscores
   */
  getScores(): IScore[] {
    return this.scores;
  }

  /**
   * Get the boolean value to check if new highscore is to be set
   * @returns True, if new higscore is to be set
   */
  getIsNewHighScore(): boolean {
    return this.isNewHighScore;
  }

  /**
   * Set the IsNewHighScore variable True/False.
   * Set True if new highscore is to be set
   * @param state New state of IsNewHighScore
   */
  setIsNewHighScore(state: boolean): void {
    this.isNewHighScore = state;
  }

}
