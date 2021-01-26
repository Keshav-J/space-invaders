import { Component, OnInit, HostListener, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
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

  private canvasCounter: number;

  private difficulty: number = 2;
  
  score: number = 0;
  life: number = 3;

  @Output() onGameOver = new EventEmitter();

  ngOnInit() {
    this.canvas.nativeElement.height = window.innerHeight;
    this.canvas.nativeElement.width = window.innerWidth;
    this.context = this.canvas.nativeElement.getContext('2d');

    this.canvasCounter = 0;

    this.startNewGame();
    this.animate();
  }

  startNewGame() {
    this.initDifficulty();
    this.startNewLife();
    this.life = 3;
  }

  startNewLife() {
    this.player = new Player(20, 30, window.innerWidth / 2 - 15, window.innerHeight - 70, this.difficulty, 0);
    this.ufoList = [];
  }

  newUfo(): void {
    this.ufoList.push(new Ufo(30, 40, (Math.random()*(window.innerWidth*0.8) + window.innerWidth*0.05), 0, this.difficulty));
  }

  dead() {
    // console.log('dead');
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
    var x = prompt('Enter difficulty (1-9): ', '2');
    if(x in nums)
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
      if(this.player.bullet.isFired && this.isCollided(ufo.y, ufo.y+ufo.height, ufo.x, ufo.x+ufo.width,
          this.player.bullet.y, this.player.bullet.y+this.player.bullet.height, this.player.bullet.x, this.player.bullet.x+this.player.bullet.width)) {
        // console.log('hit');
        this.ufoList.splice(i, 1);
        this.score += 5.5*this.difficulty;
        this.player.bullet.isFired = false;
      } else if(this.isCollided(ufo.y, ufo.y+ufo.height, ufo.x, ufo.x+ufo.width,
                          this.player.y, this.player.y+this.player.height, this.player.x, this.player.x+this.player.width)) {
        // console.log('collision');
        this.dead();
      } else if(ufo.y < window.innerHeight - 70) {
        ufo.update(this.context);
      } else {
        this.ufoList.splice(i, 1);
      }
    });

    if(this.canvasCounter % 50 == 0) {
      this.newUfo();
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if((event.key === 'ArrowRight' || event.key === 'd') && (this.player.x+30) < (window.innerWidth-30))
      this.player.dx = 5;
    else if((event.key === 'ArrowLeft' || event.key === 'a') && this.player.x > 30)
      this.player.dx = -5;
    else if(event.key === ' ')
      this.player.fireBullet(this.player.x + 14, this.player.y);
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    if(['ArrowRight', 'd', 'ArrowLeft', 'a'].includes(event.key))
      this.player.dx = 0;
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
