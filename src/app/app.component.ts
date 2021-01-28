import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title:string = 'space-invaders';
  isGame:Boolean = false;
  isHighscores:Boolean = true;
  isSaveScore:Boolean = false;

  highscores = [];
  curScore = 0;
  curName = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getHighScores();
  }

  getHighScores() {
    this.http.get<any>(`https://mean-space-invaders.herokuapp.com/getScores/`, {})
      .subscribe(
        data => {
          this.highscores = data;
        },
        error => {
          console.log(error.error.text);
        }
      );
  }

  updateHighscores() {
    const params = {
      name: this.curName,
      score: this.curScore
    };

    this.http.put<any>(`https://mean-space-invaders.herokuapp.com/setScores/`, params)
      .subscribe(
        data => {
          this.highscores = data;
        },
        error => {
          console.log(error.error.text);
        }
      );
  }

  play() {
    this.isHighscores = false;
    setTimeout(() => {
      this.isGame = true;

    }, 50);
  }

  getName() {
    this.isGame = false;
    setTimeout(() => {
      this.isSaveScore = true;
    }, 50);
  }

  showLeaderBoard() {
    this.isGame = false;
    this.isSaveScore = false;
    setTimeout(() => {
      this.isHighscores = true;
    }, 50);
  }

  updateLeaderBoard(name: string) {
    this.curName = name;

    this.updateHighscores();

    this.showLeaderBoard();
  }

  checkScores(score:number) {
    this.curScore = score;

    if(this.highscores.length<10 || (this.curScore >= this.highscores[this.highscores.length-1].score))
      this.getName();
    else {
      this.getHighScores();
      this.showLeaderBoard();
    }
  }
}
