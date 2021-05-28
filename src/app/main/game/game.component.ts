import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Bullet } from 'src/app/core/models/bullet';
import { Player } from 'src/app/core/models/player';
import { Ufo } from 'src/app/core/models/ufo';
import { ScoresService } from 'src/app/core/services/scores/scores.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  private canvas: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D;

  private player: Player;
  private ufoList: Ufo[];
  private bulletList: Bullet[];

  private canvasCounter: number;

  private difficulty = 2;
  private sprintSpeed = 2.5;
  private controls = {
    left: false,
    up: false,
    right: false,
    down: false,
    shoot: false,
    sprint: 1,
  };

  score = 0;
  life = 3;
  level = -1;

  constructor(private scoresService: ScoresService, private router: Router) {}

  ngOnInit(): void {
    this.canvas.nativeElement.height = window.innerHeight;
    this.canvas.nativeElement.width = window.innerWidth;
    this.context = this.canvas.nativeElement.getContext('2d');

    this.canvasCounter = 1;

    this.startNewGame();
    this.animate();

    if (this.scoresService.getScores().length === 0) {
      this.scoresService.getHighScores();
    }
  }

  startNewGame() {
    this.initDifficulty();
    this.startNewLife();
    this.life = 3;
  }

  startNewLife() {
    this.player = new Player(
      20,
      30,
      window.innerWidth / 2 - 15,
      window.innerHeight - 70,
      this.difficulty
    );
    this.bulletList = [];
    this.ufoList = [];
  }

  newUfo(): void {
    this.ufoList.push(
      new Ufo(30, 40, this.difficulty * this.level, this.difficulty)
    );
  }

  newBullet(): void {
    this.bulletList.push(
      new Bullet(10, 2, this.player.x + 14, this.player.y, this.difficulty * 4)
    );
  }

  dead() {
    this.bulletList = [];
    this.ufoList = [];
    this.life--;

    if (this.life >= 1) {
      this.startNewLife();
      return;
    }

    if (this.scoresService.checkHighScore(this.score)) {
      this.scoresService.setIsNewHighScore(true);
      this.router.navigate(['save']);
    } else {
      this.router.navigate(['highscores']);
    }
  }

  initDifficulty() {
    const nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const x = prompt('Enter difficulty (1-10): ', '2');
    if (nums.includes(x)) {
      this.difficulty = parseInt(x, 10);
    } else {
      this.difficulty = 2;
    }
  }

  isCollided(aT, aB, aL, aR, bT, bB, bL, bR) {
    if (
      (aT <= bT &&
        bT <= aB &&
        ((aL <= bL && bL <= aR) || (aL <= bR && bR <= aR))) ||
      (aT <= bB &&
        bB <= aB &&
        ((aL <= bL && bL <= aR) || (aL <= bR && bR <= aR)))
    ) {
      return true;
    }
    return false;
  }

  clear(): void {
    this.context.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
  }

  animate() {
    this.clear();
    this.canvasCounter++;

    if (Math.floor(this.score / 100) > this.level) {
      this.level++;
      document.getElementById('level-banner').style.opacity = '1';
      setTimeout(() => {
        document.getElementById('level-banner').style.opacity = '0';
      }, 1500);
    }
    this.player.update(this.context);

    this.ufoList.forEach((ufo, i) => {
      if (
        this.isCollided(
          ufo.y,
          ufo.y + ufo.height,
          ufo.x,
          ufo.x + ufo.width,
          this.player.y,
          this.player.y + this.player.height,
          this.player.x,
          this.player.x + this.player.width
        )
      ) {
        this.dead();
      } else if (ufo.y < window.innerHeight - 40) {
        ufo.update(this.context);
      } else {
        this.ufoList.splice(i, 1);
      }
    });

    this.bulletList.forEach((bullet, i) => {
      this.ufoList.forEach((ufo, j) => {
        if (
          this.isCollided(
            ufo.y,
            ufo.y + ufo.height,
            ufo.x,
            ufo.x + ufo.width,
            bullet.y,
            bullet.y + bullet.height,
            bullet.x,
            bullet.x + bullet.width
          )
        ) {
          this.controls.shoot = false;
          this.score += this.difficulty;
          this.bulletList.splice(i, 1);
          this.ufoList.splice(j, 1);
        }
      });

      if (0 < bullet.y + bullet.height) {
        bullet.update(this.context);
      } else {
        this.bulletList.splice(i, 1);
      }
    });

    if (this.canvasCounter % (100 / this.difficulty) === 0) {
      this.newUfo();
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  moveLeft(): void {
    this.player.dx = -this.controls.sprint * this.player.speed;
  }
  moveUp(): void {
    this.player.dy = -this.controls.sprint * this.player.speed;
  }
  moveRight(): void {
    this.player.dx = this.controls.sprint * this.player.speed;
  }
  moveDown(): void {
    this.player.dy = this.controls.sprint * this.player.speed;
  }

  resetX(): void {
    this.player.dx = 0;
  }
  resetY(): void {
    this.player.dy = 0;
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
      this.controls.left = true;
      this.moveLeft();
    } else if (event.key === 'ArrowUp' || event.key === 'w') {
      this.controls.up = true;
      this.moveUp();
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
      this.controls.right = true;
      this.moveRight();
    } else if (event.key === 'ArrowDown' || event.key === 's') {
      this.controls.down = true;
      this.moveDown();
    } else if (event.key === ' ' || event.key === 'Enter') {
      if (!this.controls.shoot && this.bulletList.length < 5) {
        this.newBullet();
      }
      this.controls.shoot = true;
    } else if (event.key === 'Shift') {
      this.controls.sprint = this.sprintSpeed;
      this.player.dx = Math.max(
        -this.sprintSpeed * this.player.speed,
        Math.min(
          this.sprintSpeed * this.player.speed,
          this.sprintSpeed * this.player.dx
        )
      );
      this.player.dy = Math.max(
        -this.sprintSpeed * this.player.speed,
        Math.min(
          this.sprintSpeed * this.player.speed,
          this.sprintSpeed * this.player.dy
        )
      );
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
      this.controls.left = false;
      if (this.controls.right) {
        this.moveRight();
      } else {
        this.resetX();
      }
    } else if (event.key === 'ArrowUp' || event.key === 'w') {
      this.controls.up = false;
      if (this.controls.down) {
        this.moveDown();
      } else {
        this.resetY();
      }
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
      this.controls.right = false;
      if (this.controls.left) {
        this.moveLeft();
      } else {
        this.resetX();
      }
    } else if (event.key === 'ArrowDown' || event.key === 's') {
      this.controls.down = false;
      if (this.controls.up) {
        this.moveUp();
      } else {
        this.resetY();
      }
    } else if (event.key === ' ' || event.key === 'Enter') {
      this.controls.shoot = false;
    } else if (event.key === 'Shift') {
      this.controls.sprint = 2;
      this.player.dx = Math.max(
        -this.player.speed,
        Math.min(this.player.speed, this.player.dx)
      );
      this.player.dy = Math.max(
        -this.player.speed,
        Math.min(this.player.speed, this.player.dy)
      );
    }
  }

  @HostListener('window:resize', ['$event'])
  resize(event: Event) {
    const ratio = this.player.x / this.canvas.nativeElement.width;
    this.canvas.nativeElement.height = window.innerHeight;
    this.canvas.nativeElement.width = window.innerWidth;
    this.player.x = Math.min(
      Math.max(30, ratio * this.canvas.nativeElement.width),
      window.innerWidth - 30 - this.player.width
    );
  }
}
