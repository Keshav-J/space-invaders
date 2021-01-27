import { Component, OnInit, HostListener, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { Bullet } from '../core/bullet';
import { Player } from '../core/player';
import { Ufo } from '../core/ufo';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  @ViewChild('canvas', { static: true }) 
  private canvas: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D;

  private player: Player;
  private ufoList: Ufo[];
  private bulletList: Bullet[];
  
  private canvasCounter: number;
  
  private difficulty: number = 2;
  private controls = {
    left: false,
    up: false,
    right: false,
    down: false,
    shoot: false
  };

  score: number = 0;
  life: number = 3;

  @Output() onGameOver = new EventEmitter();

  ngOnInit() {
    this.canvas.nativeElement.height = window.innerHeight;
    this.canvas.nativeElement.width = window.innerWidth;
    this.context = this.canvas.nativeElement.getContext('2d');

    this.canvasCounter = 1;

    this.startNewGame();
    this.animate();
  }

  startNewGame() {
    this.initDifficulty();
    this.startNewLife();
    this.life = 3;
  }

  startNewLife() {
    this.player = new Player(20, 30, window.innerWidth / 2 - 15, window.innerHeight - 70, this.difficulty);
    this.bulletList = [];
    this.ufoList = [];
  }

  newUfo(): void {
    this.ufoList.push(new Ufo(30, 40, this.difficulty));
  }

  newBullet(): void {
    this.bulletList.push(new Bullet(10, 2, this.player.x + 14, this.player.y, this.difficulty * 2));
  }

  dead() {
    // console.log('dead');
    this.bulletList = [];
    this.ufoList = [];
    this.player = null;
    this.life--;

    if(this.life < 1) {
      this.onGameOver.emit(Math.ceil(this.score));
    } else {
      this.startNewLife();
    }
  }

  initDifficulty() {
    var nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    var x = prompt('Enter difficulty (1-10): ', '2');
    if(nums.includes(x))
      this.difficulty = parseInt(x);
    else
      this.difficulty = 2;
  }

  isCollided(aT, aB, aL, aR, bT, bB, bL, bR) {
    if(((aT <= bT && bT <= aB) && ((aL <= bL && bL <= aR) || (aL <= bR && bR <= aR)))
      || ((aT <= bB && bB <= aB) && ((aL <= bL && bL <= aR) || (aL <= bR && bR <= aR))))
      return true;
    return false;
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  animate() {
    this.clear();
    this.canvasCounter++;

    this.player.update(this.context);

    this.ufoList.forEach((ufo, i) => {
      if(this.isCollided(ufo.y, ufo.y+ufo.height, ufo.x, ufo.x+ufo.width,
          this.player.y, this.player.y+this.player.height, this.player.x, this.player.x+this.player.width)) {
        // console.log('collision');
        this.dead();
      } else if(ufo.y < window.innerHeight - 70) {
        ufo.update(this.context);
      } else {
        this.ufoList.splice(i, 1);
      }
    });

    this.bulletList.forEach((bullet, i) => {
      this.ufoList.forEach((ufo, j) => {
        if(this.isCollided(ufo.y, ufo.y+ufo.height, ufo.x, ufo.x+ufo.width,
            bullet.y, bullet.y+bullet.height, bullet.x, bullet.x+bullet.width)) {
          // console.log('hit');
          this.controls.shoot = false;
          this.score += this.difficulty;
          this.bulletList.splice(i, 1);
          this.ufoList.splice(j, 1);
        }
      });

      if(0 < bullet.y + bullet.height) {
        bullet.update(this.context);
      } else {
        this.bulletList.splice(i, 1);
      }
    });

    if(this.canvasCounter % 50 == 0) {
      this.newUfo();
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  moveLeft(): void  { this.player.dx = -this.player.speed; }
  moveUp(): void    { this.player.dy = -this.player.speed; }
  moveRight(): void { this.player.dx = this.player.speed; }
  moveDown(): void  { this.player.dy = this.player.speed; }
  
  resetX(): void { this.player.dx = 0; }
  resetY(): void { this.player.dy = 0; }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if(event.key === 'ArrowLeft' || event.key === 'a') {
      this.controls.left = true;
      this.moveLeft();
    } else if(event.key === 'ArrowUp' || event.key === 'w') {
      this.controls.up = true;
      this.moveUp();
    } else if(event.key === 'ArrowRight' || event.key === 'd') {
      this.controls.right = true;
      this.moveRight();
    } else if(event.key === 'ArrowDown' || event.key === 's') {
      this.controls.down = true;
      this.moveDown();
    } else if(event.key === ' ' || event.key === 'Enter') {
      if(!this.controls.shoot && this.bulletList.length < 5)
        this.newBullet();
      this.controls.shoot = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    if(event.key === 'ArrowLeft' || event.key === 'a') {
      this.controls.left = false;
      if(this.controls.right) this.moveRight();
      else                    this.resetX();
    } else if(event.key === 'ArrowUp' || event.key === 'w') {
      this.controls.up = false;
      if(this.controls.down)  this.moveDown();
      else                    this.resetY();
    } else if(event.key === 'ArrowRight' || event.key === 'd') {
      this.controls.right = false;
      if(this.controls.left)  this.moveLeft();
      else                    this.resetX();
    } else if(event.key === 'ArrowDown' || event.key === 's') {
      this.controls.down = false;
      if(this.controls.up)    this.moveUp();
      else                    this.resetY();
    } else if(event.key === ' ' || event.key === 'Enter') {
      this.controls.shoot = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  resize(event: Event) {
    console.log('resize');
    const ratio = this.player.x / this.canvas.nativeElement.width;
    this.canvas.nativeElement.height = window.innerHeight;
    this.canvas.nativeElement.width = window.innerWidth;
    this.player.x = Math.min(Math.max(30, ratio * this.canvas.nativeElement.width),
                              window.innerWidth - 30 - this.player.width);
  }
}
