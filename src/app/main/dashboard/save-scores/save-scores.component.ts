import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { User } from 'src/app/core/models/models';
import { ScoresService } from 'src/app/core/services/scores/scores.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-save-scores',
  templateUrl: './save-scores.component.html',
  styleUrls: ['./save-scores.component.scss'],
})
export class SaveScoresComponent implements OnInit {
  user: User;

  constructor(
    private router: Router,
    private userService: UserService,
    private scoresService: ScoresService
  ) {}

  ngOnInit() {
    this.user = this.userService.getUser();
    this.scoresService.getHighScores().pipe(take(1)).subscribe();
    if (!this.scoresService.getIsNewHighScore()) {
      alert('You have to play the game to save your score...!');
      this.router.navigate(['highscores']);
    }
  }

  submit() {
    if (this.user.name) {
      this.router.navigate(['highscores']);
      this.userService.setUserName(this.user.name);
      this.scoresService
        .updateHighscores()
        .pipe(take(1))
        .subscribe(() => {
          this.scoresService.setIsNewHighScore(false);
          this.router.navigate(['highscores']);
        });
    }
  }
}
