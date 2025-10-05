/**
 * Static parallax/background layer that scrolls with the world camera.
 * @file
 */

/**
 * Background layer sprite.
 * @extends MovableObject
 * @class
 */
class BackgroundObject extends MovableObject {
  /**
   * Create a background sprite anchored at a world X position.
   * @param {string} imgPath - Path to the background image asset.
   * @param {number} x - World X coordinate where this tile starts.
   */
  constructor(imgPath, x) {
    super().loadImage(imgPath);
    this.x = x;
    this.y = 0;
    this.width = 720;
    this.height = 480;
  }
}
