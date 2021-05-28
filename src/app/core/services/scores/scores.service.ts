import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Score, User } from '../../models/models';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {
  private scores: Score[] = [];
  private isNewHighScore = false;

  constructor(private http: HttpClient, private userService: UserService) {}

  getHighScores(): Observable<Score[]> {
    return this.http
      .get<Score[]>(`https://mean-space-invaders.herokuapp.com/getScores/`, {})
      .pipe(
        map((response) => {
          this.scores = response;
          return response;
        })
      );
  }

  updateHighscores(): Observable<Score[]> {
    const currentUser: User = this.userService.getUser();
    const params = {
      name: currentUser.name,
      score: currentUser.score,
    };
    return this.http
      .put<Score[]>(
        `https://mean-space-invaders.herokuapp.com/setScores/`,
        params
      )
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

  getScores(): Score[] {
    return this.scores;
  }

  getIsNewHighScore(): boolean {
    return this.isNewHighScore;
  }

  setIsNewHighScore(state: boolean): void {
    this.isNewHighScore = state;
  }
}
