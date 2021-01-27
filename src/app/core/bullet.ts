export class Bullet {
    height: number;
    width: number;
    x: number;
    y: number;
    dy: number;
    ref: HTMLImageElement;
  
    constructor(height: number,
                width: number,
                x: number,
                y: number,
                dy: number) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.dy = dy;
        this.ref = document.getElementById('bullet') as HTMLImageElement;
    }
  
    draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.ref, this.x, this.y, this.width, this.height);
    }
  
    update(context: CanvasRenderingContext2D): void {
        this.draw(context);

        this.y -= this.dy;
    }
}
