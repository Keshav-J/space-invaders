export class Bullet {
    height: number;
    width: number;
    x: number;
    y: number;
    dy: number;
    ref: HTMLImageElement;
    isFired: boolean;
  
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
        this.isFired = false;
    }
  
    draw(context: CanvasRenderingContext2D): void {
        context.drawImage(this.ref, this.x, this.y, this.width, this.height);
    }
  
    update(context: CanvasRenderingContext2D): void {
        if(this.isFired) {
            this.draw(context);
    
            if(0 < this.y + this.height - this.dy) {
                this.y -= this.dy;
            } else {
                this.isFired = false;
            }
        }
    }
}
