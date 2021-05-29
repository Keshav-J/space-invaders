export class Player {
  height: number;
  width: number;
  x: number;
  y: number;
  speed: number;
  dx: number;
  dy: number;
  ref: HTMLImageElement;

  constructor(
    height: number,
    width: number,
    x: number,
    y: number,
    speed: number
  ) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.speed = Math.min(5, speed * 1.5);
    this.dx = 0;
    this.dy = 0;
    this.ref = document.getElementById('player') as HTMLImageElement;
  }

  /**
   * Draw Player in the HTML Canvas
   * @param context Context of the HTML Canvas
   */
  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.ref, this.x, this.y, this.width, this.height);
  }

  /**
   * Update the position of the Player
   * @param context Context of the HTML Canvas
   */
  update(context: CanvasRenderingContext2D): void {
    this.draw(context);

    // Check if Player goes out of page and move the Player to the other end
    if (this.x + this.width / 2 < 0) {
      this.x = window.innerWidth - this.width / 2;
    } else if (window.innerWidth < this.x + this.width / 2) {
      this.x = -this.width / 2;
    }

    this.x += this.dx;
    if (this.dy < 0) {
      this.y = Math.max(30, this.y + this.dy);
    } else {
      this.y = Math.min(window.innerHeight - 70, this.y + this.dy);
    }
  }
}
