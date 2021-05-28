import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ScoresService } from '../../services/scores/scores.service';

@Injectable({
  providedIn: 'root',
})
export class SaveScoreGuard implements CanActivate {
  constructor(private scoresService: ScoresService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isNewHighScore = this.scoresService.getIsNewHighScore();

    if (!isNewHighScore) {
      return this.router.createUrlTree(['highscores']);
    }

    return true;
  }
}
