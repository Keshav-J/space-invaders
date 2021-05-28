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

  updateHighscores(): Observable<IScore[]> {
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
          this.userService.setUserScore(0);
          return response;
        })
      );
  }

  checkHighScore(score: number): boolean {
    this.userService.setUserScore(score);
    if (
      this.scores.length < 10 ||
      score >= this.scores[this.scores.length - 1].score
    ) {
      return true;
    }
    return false;
  }

  getScores(): IScore[] {
    return this.scores;
  }

  getIsNewHighScore(): boolean {
    return this.isNewHighScore;
  }

  setIsNewHighScore(state: boolean): void {
    this.isNewHighScore = state;
  }
}
