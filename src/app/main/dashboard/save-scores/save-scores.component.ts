import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ROUTES } from 'src/app/core/constants/urlconstants';
import { IUser } from 'src/app/core/models/models';
import { ScoresService } from 'src/app/core/services/scores/scores.service';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-save-scores',
  templateUrl: './save-scores.component.html',
  styleUrls: ['./save-scores.component.scss'],
})
export class SaveScoresComponent implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private scoresService: ScoresService
  ) {}

  ngOnInit() {
    const user: IUser = this.userService.getUser();
    this.form = new FormGroup({
      name: new FormControl(user.name, Validators.required),
      score: new FormControl(user.score, Validators.required),
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    this.userService.setUserName(this.form.controls.name.value);
    this.scoresService
      .updateHighscores()
      .pipe(take(1))
      .subscribe(() => {
        this.scoresService.setIsNewHighScore(false);
        this.router.navigate([ROUTES.HIGHSCORES]);
      });
  }
}
