export class Ufo {
    height: number;
    width: number;
    x: number;
    y: number;
    dx: number;
    dy: number;
    ref: HTMLImageElement;
  
    constructor(height: number,
                width: number,
                dy: number) {
        this.height = height;
        this.width = width;
        this.x = (Math.random()*(window.innerWidth*0.8) + window.innerWidth*0.05);
        this.y = -this.height;
        this.dy = dy;
        this.ref = document.getElementById('ufo') as HTMLImageElement;
    }
  
    draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.ref, this.x, this.y, this.width, this.height);
    }
  
    update(context: CanvasRenderingContext2D): void {
        this.draw(context);

        this.y += this.dy;
    }
}
