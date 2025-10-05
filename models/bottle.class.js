/**
 * Collectible salsa bottle (ammo) that idles on the ground and animates.
 * @file
 */

/**
 * Collectible salsa bottle (ammo).
 * @extends MovableObject
 * @class
 */
class Bottle extends MovableObject {
  /**
   * Rendered height in pixels.
   * @type {number}
   */
  height = 90;

  /**
   * Rendered width in pixels.
   * @type {number}
   */
  width = 64;

  /**
   * Sprite frames for idle animation.
   * @type {string[]}
   */
  frames = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
  ];

  /**
   * Create a bottle at a random ground position and start animation.
   * @returns {void}
   */
  constructor() {
    super().loadImage(this.frames[0]);
    this.loadImages(this.frames);
    this.x = 200 + Math.random() * 2000;
    this.y = 340;
    this.offset = { x: 10, y: 10, width: 20, height: 20 };
    this.runAnimation();
  }

  /**
   * Run the idle animation by cycling through frames.
   * @returns {void}
   */
  runAnimation() {
    setInterval(() => {
      this.playAnimation(this.frames);
    }, 220);
  }
}
