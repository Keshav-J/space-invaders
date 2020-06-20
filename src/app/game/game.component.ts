import { Component, OnInit, HostListener, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  windowHeight:number = window.innerHeight;
  difficulty:number = 2;

  score:number = 0;
  life:number = 3;

  shooter:boolean = false;
  shooterX:number = 0;

  bullet:boolean = false;
  bulletY:number = this.windowHeight - 75;

  ufoCnt:number = 0;
  ufos = [];

  @Output() onGameOver = new EventEmitter();

  incrementBulletHeight = setInterval(() => {
    if(!this.bullet) return;

    this.bulletY -= this.difficulty;

    if(this.bulletY <= 0) {
      this.deleteBullet();
      return;
    }

    document.getElementById('bullet').style.top = this.bulletY + 'px';
  }, 10);

  descrementUfoHeight = setInterval(() => {
    var temp = [];
    for(var i=0 ; i<this.ufos.length ; ++i)
    {
      document.getElementById(this.ufos[i]).style.top = (this.getInteger(this.ufos[i], 'top') + 5) + 'px';

      var uB = this.getInteger(this.ufos[i], 'top');
      var uT = uB + 30;
      var uL = this.getInteger(this.ufos[i], 'marginLeft');
      var uR = uL + 40;

      // UFO out of screen
      if(uB > this.windowHeight-65) {
        document.getElementById(this.ufos[i]).remove();
        continue;
      }

      var sB = this.windowHeight - 50;
      var sT = sB + 30;
      var sL = this.shooterX;
      var sR = sL + 30;

      // UFO - Shooter collision
      if(this.isCollided(uT, uB, uL, uR, sT, sB, sL, sR)) {
        this.dead();
        break;
      }

      if(this.bullet)
      {
        var bB = this.getInteger('bullet', 'top');
        var bT = bB + 10;
        var bL = this.getInteger('bullet', 'marginLeft');
        var bR = bL + 2;

        // UFO - Bullet collision
        if(this.isCollided(uT, uB, uL, uR, bT, bB, bL, bR)) {
          (new Audio('assets/game/smash-sound.mp3')).play();
          this.score += 5.5*this.difficulty;

          document.getElementById(this.ufos[i]).remove();
          this.deleteBullet();
          continue;
        }
      }

      temp.push(this.ufos[i]);
    }
    this.ufos = temp;
  }, 100/this.difficulty);

  launchUfos = setInterval(() => {
    this.createUfo();
  }, 3000/this.difficulty);
  ngOnInit() {

    this.startNewGame();

  }

  startNewGame() {
    this.initDifficulty();
    this.startNewLife();
    this.life = 3;
  }

  startNewLife() {
    this.shooter = true;
    this.shooterX = window.innerWidth*0.9 / 2 - 15;

    if(this.bullet)
      this.deleteBullet();
    for(var i=0 ; i<this.ufos.length ; ++i)
      document.getElementById(this.ufos[i]).remove();
    this.ufos = [];
  }

  dead() {
    console.log('dead');
    this.life--;
    if(this.life < 0) {
      this.onGameOver.emit(this.score);
      clearInterval(this.incrementBulletHeight);
      clearInterval(this.descrementUfoHeight);
      clearInterval(this.launchUfos);
    }
    else
      this.startNewLife();
  }

  deleteBullet() {
    document.getElementById('bullet').remove();
    this.bulletY = this.windowHeight - 75;
    this.bullet = false;
  }

  initDifficulty() {
    var num1to10 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    var x = prompt('Enter difficulty (1-10): ', '2');
    console.log(x);
    if(x in num1to10)
      this.difficulty = parseInt(x);
    else
      this.difficulty = 2;
  }

  isCollided(aT, aB, aL, aR, bT, bB, bL, bR) {
    if(((aB<=bT && bT<=aT) && ((aL<=bL && bL<=aR) || (aL<=bR && bR<=aR))) ||
      ((aB<=bB && bB<=aT) && ((aL<=bL && bL<=aR) || (aL<=bR && bR<=aR))))
      return true;
    return false;
  }
  getInteger(id, property) {
    return parseInt(document.getElementById(id).style[property].slice(0, -2));
  }

  createUfo() {
    var posX = Math.random() * (window.innerWidth*0.8);
    this.ufoCnt++;

    var ufo = document.createElement('img');
    ufo.src = "assets/game/ufo1.png";
    ufo.id = 'ufo' + this.ufoCnt;
    ufo.className = 'ufo';
    ufo.alt = "UFO";
    ufo.style.position = 'absolute';
    ufo.style.marginLeft = (posX + window.innerWidth*0.05) + 'px';
    ufo.style.top = '-20px';
    ufo.style.height = '30px';
    ufo.style.width = '40px';

    document.getElementById('ufo-container').appendChild(ufo);

    this.ufos.push(ufo.id);
    // console.log(this.ufos);
  }

  shootBullet(pos: number) {
    var bullet = document.createElement('img');
    bullet.src = "assets/game/bullet.png";
    bullet.id = 'bullet';
    bullet.alt = "bullet";
    bullet.style.position = 'absolute';
    bullet.style.marginLeft = (pos + 14) + 'px';
    bullet.style.top = this.windowHeight - 75 + 'px';
    bullet.style.height = '10px';
    bullet.style.width = '2px';

    document.getElementById('bullet-container').appendChild(bullet);

    (new Audio('assets/game/firing-sound.mp3')).play();

    this.bulletY = this.windowHeight - 75;
    this.bullet = true;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event.keyCode);
    if(event.keyCode == 39 && this.shooterX < (window.innerWidth-50))
      this.shooterX += (10 + this.difficulty);
    if(event.keyCode == 37 && this.shooterX > 50)
      this.shooterX -= (10 + this.difficulty);
    if(event.keyCode == 32 && !this.bullet)
      this.shootBullet(this.shooterX);
  }
}
