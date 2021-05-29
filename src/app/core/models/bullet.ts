export class Bullet {
  height: number;
  width: number;
  x: number;
  y: number;
  dy: number;
  ref: HTMLImageElement;

  constructor(height: number, width: number, x: number, y: number, dy: number) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
    this.dy = Math.min(25, dy);
    this.ref = document.getElementById('bullet') as HTMLImageElement;
  }

  /**
   * Draw Bullet in the HTML Canvas
   * @param context Context of the HTML Canvas
   */
  draw(context: CanvasRenderingContext2D): void {
    context.drawImage(this.ref, this.x, this.y, this.width, this.height);
  }

  /**
   * Update the position of the Bullet
   * @param context Context of the HTML Canvas
   */
  update(context: CanvasRenderingContext2D): void {
    this.draw(context);

    // Move the bullet 'dy' pixels upwards
    this.y -= this.dy;
  }
}
