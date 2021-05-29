import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ROUTES } from '../../constants/urlconstants';
import { ScoresService } from '../../services/scores/scores.service';

@Injectable({
  providedIn: 'root',
})
export class SaveScoreGuard implements CanActivate {
  constructor(private scoresService: ScoresService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isNewHighScore = this.scoresService.getIsNewHighScore();

    // If application is not in a state to save score, redirect to highscores page
    if (!isNewHighScore) {
      return this.router.createUrlTree([ROUTES.HIGHSCORES]);
    }

    return true;
  }
}
