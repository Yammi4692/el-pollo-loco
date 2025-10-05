/**
 * Normal chicken enemy.
 * Walks left until defeated, can be stomped or hit by bottles.
 * @file
 */

/**
 * Standard walking chicken enemy class.
 * Extends MovableObject with walking and death behavior.
 * @class
 * @extends MovableObject
 */
class NormalChicken extends MovableObject {
  /** @type {number} Vertical ground position of the chicken. */
  y = 350;

  /** @type {number} Render height of the chicken. */
  height = 75;

  /** @type {number} Render width of the chicken. */
  width = 75;

  /** @type {string[]} Walking animation frames. */
  framesWalk = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
  ];

  /** @type {string[]} Dead sprite frame. */
  framesDead = ['img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];

  /**
   * Create a new normal chicken.
   * Randomizes position and speed, preloads frames, and starts animations.
   * @constructor
   */
  constructor() {
    super().loadImage(this.framesWalk[0]);
    this.loadImages(this.framesWalk);
    this.loadImages(this.framesDead);

    this.offset = { x: 6, y: 6, width: 12, height: 12 };

    this.x = 600 + Math.random() * 1800;
    this.speed = 0.35 + Math.random() * 0.8;

    this.startAnim();
  }

  /**
   * Start walking and animation loops.
   * - Movement at 60fps.
   * - Frame switch every 150ms.
   * @returns {void}
   */
  startAnim() {
    setInterval(() => {
      if (this.energy > 0) this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      if (this.energy > 0) this.playAnimation(this.framesWalk);
      else this.playAnimation(this.framesDead);
    }, 150);
  }

  /**
   * Reduce energy to 0, play death sound, and show dead frame.
   * @returns {void}
   */
  takeHit() {
    this.energy = 0;
    window.audioManager.play('chickenDie');
    this.playAnimation(this.framesDead);
  }

  /**
   * Instantly kill the chicken:
   * - Load dead image
   * - Stop movement
   * - Play sound
   * @returns {void}
   */
  kill() {
    this.loadImage(this.framesDead[0]);
    window.audioManager.play('chickenDie');
    this.speed = 0;
  }
}
