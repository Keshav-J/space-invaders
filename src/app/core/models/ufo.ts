export class Ufo {
  height: number;
  width: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  ref: HTMLImageElement;

  constructor(height: number, width: number, dx: number, dy: number) {
    this.height = height;
    this.width = width;
    this.x = Math.random() * (window.innerWidth - width);
    this.y = -this.height;
    this.dx = -dx + Math.floor(Math.random() * (2 * dx + 1));
    this.dy = dy;
    this.ref = document.getElementById('ufo') as HTMLImageElement;
  }

  /**
   * Draw UFO in the HTML Canvas
   * @param context Context of the HTML Canvas
   */
  draw(context: CanvasRenderingContext2D): void {
    if (!this.ref) {
      return;
    }
    context.drawImage(this.ref, this.x, this.y, this.width, this.height);
  }

  /**
   * Update the position of the UFO
   * @param context Context of the HTML Canvas
   */
  update(context: CanvasRenderingContext2D): void {
    this.draw(context);

    // Reverse the direction of the UFO when hitting the horizontal ends
    if (this.x < 0 || window.innerWidth < this.x + this.width + this.dx) {
      this.dx = -this.dx;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}
