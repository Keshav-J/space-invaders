import { Component, OnInit, HostListener } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';

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

  reset() {
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
      alert('Game over.');
      this.life = 3;
    }
    this.reset();
  }

  ngOnInit() {
    this.reset();
  }

  deleteBullet() {
    document.getElementById('bullet').remove();
    this.bulletY = this.windowHeight - 75;
    this.bullet = false;
  }

  incrementBulletHeight = setInterval(() => {
    if(!this.bullet) return;

    this.bulletY -= 2;

    if(this.bulletY <= 0) {
      this.deleteBullet();
      return;
    }

    document.getElementById('bullet').style.top = this.bulletY + 'px';
  }, 10-this.difficulty);

  DescrementUfoHeight = setInterval(() => {

    var temp = [];

    for(var i=0 ; i<this.ufos.length ; ++i)
    {
      document.getElementById(this.ufos[i]).style.top = (parseInt(document.getElementById(this.ufos[i]).style.top.slice(0, -2)) + 5) + 'px';
      var uB = parseInt(document.getElementById(this.ufos[i]).style.top.slice(0, -2));
      var uT = uB + 30;
      var uL = parseInt(document.getElementById(this.ufos[i]).style.marginLeft.slice(0, -2));
      var uR = uL + 40;

      if(!this.bullet){
        if(uB <= this.windowHeight-80)
          temp.push(this.ufos[i]);
        else {
          this.dead();
          break;
        }
        continue;
      }
      if(uB > this.windowHeight-80) {
        this.dead();
        break;
      }

      var bB = parseInt(document.getElementById('bullet').style.top.slice(0, -2));
      var bT = bB + 10;
      var bL = parseInt(document.getElementById('bullet').style.marginLeft.slice(0, -2));
      var bR = bL + 2;

      if(((uB<=bT && bT<=uT) && ((uL<=bL && bL<=uR) || (uL<=bR && bR<=uR))) ||
        ((uB<=bB && bB<=uT) && ((uL<=bL && bL<=uR) || (uL<=bR && bR<=uR))))
      {
        this.score += 10*this.difficulty;
        document.getElementById(this.ufos[i]).remove();
        this.deleteBullet();
      }
      else
        temp.push(this.ufos[i]);
    }

    // console.log(this.ufos, temp)
    this.ufos = temp;
  }, 100/this.difficulty);

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

  launchUfos = setInterval(() => {
    if(this.life < 0)
      clearInterval(this.launchUfos);

    this.createUfo();
  }, 3000/this.difficulty);

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
    this.bulletY = this.windowHeight - 75;
    this.bullet = true;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event.keyCode);
    if(event.keyCode == 39 && this.shooterX < (window.innerWidth-50))
      this.shooterX += 10;
    if(event.keyCode == 37 && this.shooterX > 50)
      this.shooterX -= 10;
    if(event.keyCode == 32 && !this.bullet)
      this.shootBullet(this.shooterX);
  }
}
