import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { DBullet, DGameControls, DGameDifficulty, DGameLevel, DGameLife, DGameScore, DGameSprintSpeed, DMousePointer, DPlayer, DUfo } from 'src/app/core/constants/defaults';
import { ROUTES } from 'src/app/core/constants/urlconstants';
import { CommonHelpers } from 'src/app/core/helpers/common.helper';
import { Bullet } from 'src/app/core/models/bullet';
import { IGameControls, IMousePointer } from 'src/app/core/models/models';
import { Player } from 'src/app/core/models/player';
import { Ufo } from 'src/app/core/models/ufo';
import { ScoresService } from 'src/app/core/services/scores/scores.service';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvas: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D;

  private player: Player;
  private ufoList: Ufo[];
  private bulletList: Bullet[];

  private canvasCounter: number;

  private difficulty: number;
  private sprintSpeed: number;
  private controls: IGameControls;
  private mousePosition: IMousePointer;

  score: number;
  life: number;
  level: number;

  private isDestroyed: boolean;
  private isClicked: boolean;
  private isMobile: boolean;

  constructor(private scoresService: ScoresService, private router: Router) {
    this.difficulty = DGameDifficulty;
    this.sprintSpeed = DGameSprintSpeed;
    this.controls = DGameControls;
    this.mousePosition = DMousePointer;
    this.score = DGameScore;
    this.life = DGameLife;
    this.level = DGameLevel;
    this.isDestroyed = false;
    this.isClicked = false;
    this.isMobile = CommonHelpers.isMobileDevice();
  }

  ngOnInit(): void {
    this.canvas.nativeElement.height = window.innerHeight;
    this.canvas.nativeElement.width = window.innerWidth;
    this.context = this.canvas.nativeElement.getContext('2d');

    this.canvasCounter = 1;

    this.startNewGame();
    this.animate();

    if (this.scoresService.getScores().length === 0) {
      this.scoresService.getHighScores().pipe(take(1)).subscribe();
    }
  }

  /**
   * Start a new Game
   */
  startNewGame(): void {
    this.initDifficulty();
    this.startNewLife();
    this.life = 3;
  }

  /**
   * Start a new life.
   * Called when starting new game or Player get hit by UFO
   */
  startNewLife(): void {
    this.player = new Player(
      DPlayer.height,
      DPlayer.width,
      window.innerWidth / 2 - 15,
      window.innerHeight - 70,
      this.difficulty
    );
    this.bulletList = [];
    this.ufoList = [];
  }

  /**
   * Create and add new UFO into the Canvas
   */
  newUfo(): void {
    this.ufoList.push(
      new Ufo(DUfo.height, DUfo.width, this.difficulty * this.level, this.difficulty)
    );
  }

  /**
   * Create and add new Bullet into the screen based on Player position
   */
  newBullet(): void {
    this.bulletList.push(
      new Bullet(DBullet.height, DBullet.width, this.player.x + 14, this.player.y, this.difficulty * 4)
    );
  }

  /**
   * Reset list of bullets, UFOs, update life.
   * When life becomes 0,
   *   If score gets into leaderboard, navigate to SaveScores page.
   *   Else navigate to Highscores page
   */
  dead(): void {
    this.bulletList = [];
    this.ufoList = [];
    this.life--;

    if (this.life >= 1) {
      this.startNewLife();
      return;
    }

    if (this.scoresService.checkHighScore(this.score)) {
      this.scoresService.setIsNewHighScore(true);
      this.router.navigate(['/', ROUTES.SAVE_SCORES]);
    } else {
      this.router.navigate(['/', ROUTES.HIGHSCORES]);
    }
  }

  /**
   * Initialize difficulty of the game from User input
   */
  initDifficulty() {
    const difficultyList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const selectedDifficulty = prompt('Enter difficulty (1-10): ', '2');
    if (difficultyList.includes(selectedDifficulty)) {
      this.difficulty = parseInt(selectedDifficulty, 10);
    } else {
      this.difficulty = 2;
    }
  }

  /**
   * Clear the HTML Canvas
   */
  clear(): void {
    this.context.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
  }

  /**
   * Animate method that Renders the HTML Canvas contents
   */
  animate() {
    this.clear();
    this.canvasCounter++;

    // Check if there's a level update
    if (Math.floor(this.score / 100) > this.level) {
      this.level++;
      document.getElementById('level-banner').style.opacity = '1';
      setTimeout(() => {
        document.getElementById('level-banner').style.opacity = '0';
      }, 1500);
    }

    // Shoot new Bullet when Mouse is used
    if (this.isClicked && this.isMobile && this.canvasCounter % 30 === 0) {
      if (this.bulletList.length < 5) {
        this.newBullet();
      }
      this.controls.shoot = true;
    }

    // Update the player
    if (this.isClicked) {
      const maxSpeed = this.player.speed * this.sprintSpeed;
      this.player.dx = (this.mousePosition.x - (this.player.x + DPlayer.width / 2)) / maxSpeed;
      this.player.dy = (this.mousePosition.y - (this.player.y + DPlayer.height / 2)) / maxSpeed;
    }
    this.player.update(this.context);

    // Update each UFO
    this.ufoList.forEach((ufo, i) => {
      // Check if the UFO is hit by the Player
      if (
        CommonHelpers.isCollided(
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

    // Check if the Bullet hits any of the UFOs
    this.bulletList.forEach((bullet, i) => {
      this.ufoList.forEach((ufo, j) => {
        if (
          CommonHelpers.isCollided(
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

      // Update the bullet if bullet is still in the screen
      if (0 < bullet.y + bullet.height) {
        bullet.update(this.context);
      } else {
        this.bulletList.splice(i, 1);
      }
    });

    // Launch new UFOs into the screen periodically
    if (this.canvasCounter % (100 / this.difficulty) === 0) {
      this.newUfo();
    }

    // Stop rendering when component is destroyed
    if (!this.isDestroyed) {
      requestAnimationFrame(this.animate.bind(this));
    }
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
    if (this.isClicked) {
      return;
    }
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

  @HostListener('document:mousedown', ['$event'])
  mouseDown(event: MouseEvent) { this.dragStart(event.clientX, event.clientY); }
  @HostListener('document:mouseup', ['$event'])
  mouseUp(event: MouseEvent) { this.dragStop(); }
  @HostListener('document:mousemove', ['$event'])
  mouseMove(event: MouseEvent) { this.setMousePosition(event.clientX, event.clientY); }


  @HostListener('document:touchstart', ['$event'])
  touchStart(event: TouchEvent) { this.dragStart(event.touches[0].clientX, event.touches[0].clientY); }
  @HostListener('document:touchend', ['$event'])
  touchEnd(event: TouchEvent) { this.dragStop();  }
  @HostListener('document:touchcancel', ['$event'])
  touchCancel(event: TouchEvent) { this.dragStop(); }
  @HostListener('document:touchmove', ['$event'])
  touchMove(event: TouchEvent) { this.setMousePosition(event.touches[0].clientX, event.touches[0].clientY); }

  dragStart(clientX: number, clientY: number): void {
    this.isClicked = true;
    this.controls.left = false;
    this.controls.up = false;
    this.controls.right = false;
    this.controls.down = false;
    this.setMousePosition(clientX, clientY);
  }

  dragStop(): void {
    this.isClicked = false;
    this.controls.shoot = false;
    this.resetX();
    this.resetY();
  }

  setMousePosition(clientX: number, clientY: number): void {
    if (this.isClicked) {
      this.mousePosition.x = clientX;
      this.mousePosition.y = clientY;
    }
  }

  @HostListener('window:orientationchange', ['$event'])
  deviceOrientation(event: DeviceOrientationEvent) {
    if (window.innerHeight < window.innerWidth) {
      alert('device orientation changed. Restarting the game...');
      location.reload();
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

  ngOnDestroy(): void {
    this.isDestroyed = true;
  }
}
