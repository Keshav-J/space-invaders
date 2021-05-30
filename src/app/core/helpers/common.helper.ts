export class CommonHelpers {

  /**
   * Check if the current device is a Mobile device
   * @returns True, if the device is Mobile
   */
  public static isMobileDevice(): boolean {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }

  /**
   * Check if two objects collide using their coordinates (pixels)
   * @param aT Top pixel of Object A
   * @param aB Bottom Pixel of Object A
   * @param aL Left Pixel of Object A
   * @param aR Right Pixel of Object A
   * @param bT Top pixel of Object B
   * @param bB Bottom Pixel of Object B
   * @param bL Left Pixel of Object B
   * @param bR Right Pixel of Object B
   * @returns True, if the two objects are colliding
   */
   public static isCollided(aT: number, aB: number, aL: number, aR: number, bT: number, bB: number, bL: number, bR: number) {
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

  /**
   * Set user is old user in localStorage
   */
  public static setOldUser(): void {
    localStorage.setItem('old_user', 'true');
  }

  /**
   * Check if user is a returning user
   * @returns True, if the User is a returning user
   */
  public static isOldUser(): boolean {
    if (localStorage.getItem('old_user')) {
      return true;
    }
    return false;
  }

}
