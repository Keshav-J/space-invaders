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

  getHighScores() {
    this.http.post<any>(`https://cors-anywhere.herokuapp.com/https://mean-space-invaders.herokuapp.com/getScores/`, {})
      .subscribe(
        data => {
          console.log(data);
          this.highscores = data;
        },
        error => {
          console.log(error.error.text);
        }
      );
  }

  ngOnInit() {
    this.getHighScores();
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

    if(this.highscores.length != 0) {
      var flag:Boolean = false;
      for(var i=0 ; i<this.highscores.length ; ++i) {
        if(this.curScore >= this.highscores[i].score) {
          this.curName;
          this.highscores.splice(i, 0, {
            name: this.curName,
            score: this.curScore
          });
          flag = true;
          break;
        }
      }
      if(this.highscores.length > 10)
        this.highscores.pop();
      if(!flag && this.highscores.length<10) {
        this.highscores.push({
          name: this.curName,
          score: this.curScore
        });
      }
    }
    else {
      this.highscores.push({
        name: this.curName,
        score: this.curScore
      });
    }

    this.showLeaderBoard();
  }

  checkScores(score:number) {
    this.curScore = score;
    console.log(this.curScore);

    if(this.highscores.length<10 || (this.curScore >= this.highscores[this.highscores.length-1].score))
      this.getName();
    else
      this.showLeaderBoard();
  }
}
