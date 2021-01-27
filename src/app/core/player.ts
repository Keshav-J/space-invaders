import { Bullet } from './bullet';

export class Player {
    height: number;
    width: number;
    x: number;
    y: number;
    speed: number;
    dx: number;
    dy: number;
    bullet: Bullet;
    ref: HTMLImageElement;

    constructor(height: number,
                width: number,
                x: number,
                y: number,
                speed: number) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.speed = Math.min(5, speed * 1.5);
        this.dx = 0;
        this.dy = 0;
        this.bullet = new Bullet(10, 2, this.x + 14, this.y, speed * 2);
        this.ref = document.getElementById('player') as HTMLImageElement;
    }

    draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.ref, this.x, this.y, this.width, this.height);
    }

    fireBullet(x: number, y: number) {
        if(this.bullet.isFired) return;

        this.bullet.x = x;
        this.bullet.y = y;
        this.bullet.isFired = true;
    }

    update(context: CanvasRenderingContext2D): void {
        this.bullet.update(context);
        this.draw(context);

        if(25 < (this.x + this.dx) && ((this.x+this.width) + this.dx) < (window.innerWidth - 25)) {
            this.x += this.dx;
        }
        if(30 < (this.y + this.dy) && ((this.y + this.dy) < (window.innerHeight - 70))) {
            this.y += this.dy;
        }
    }
}
