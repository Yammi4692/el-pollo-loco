/**
 * Cloud background object that scrolls slowly across the screen.
 * @file
 */

/**
 * Cloud sprite that drifts horizontally across the sky.
 * @extends MovableObject
 * @class
 */
class Cloud extends MovableObject {
  /** Vertical position for all clouds. @type {number} */
  y = 20;

  /** Cloud render height. @type {number} */
  height = 250;

  /** Cloud render width. @type {number} */
  width = 500;

  /** Horizontal scroll speed (randomized per cloud). @type {number} */
  speed = 0.2 + Math.random() * 0.2;

  /**
   * Create a new cloud, randomize start X, and start its movement loop.
   * @returns {void}
   */
  constructor() {
    super().loadImage('img/5_background/layers/4_clouds/1.png');
    this.x = Math.random() * 500;

    setInterval(() => {
      this.x -= this.speed;
      if (this.x < -this.width) this.x = 3000;
    }, 1000 / 60);
  }
}
