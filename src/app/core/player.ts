export class Player {
    height: number;
    width: number;
    x: number;
    y: number;
    speed: number;
    dx: number;
    dy: number;
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
        this.ref = document.getElementById('player') as HTMLImageElement;
    }

    draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.ref, this.x, this.y, this.width, this.height);
    }

    update(context: CanvasRenderingContext2D): void {
        this.draw(context);

        if(25 < (this.x + this.dx) && ((this.x+this.width) + this.dx) < (window.innerWidth - 25)) {
            this.x += this.dx;
        }
        if(30 < (this.y + this.dy) && ((this.y + this.dy) < (window.innerHeight - 70))) {
            this.y += this.dy;
        }
    }
}
