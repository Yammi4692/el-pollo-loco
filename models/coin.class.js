/**
 * Rotating collectible coin that animates through two frames.
 * @file
 */

/**
 * Coin sprite that can be collected by the player.
 * @extends MovableObject
 * @class
 */
class Coin extends MovableObject {
  /** Render height. @type {number} */
  height = 80;

  /** Render width. @type {number} */
  width = 80;

  /** Default vertical placement. @type {number} */
  y = 290;

  /** Animation frames for rotation. @type {string[]} */
  frames = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  /**
   * Initialize coin with random position and start rotation animation.
   * @returns {void}
   */
  constructor() {
    super().loadImage(this.frames[0]);
    this.loadImages(this.frames);
    this.x = 200 + Math.random() * 2000;
    this.y = 60 + Math.random() * 170;
    this.offset = { x: 12, y: 12, width: 24, height: 24 };
    this.startAnim();
  }

  /**
   * Play coin rotation animation in a loop.
   * @returns {void}
   */
  startAnim() {
    setInterval(() => {
      this.playAnimation(this.frames);
    }, 200);
  }
}
