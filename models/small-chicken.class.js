/**
 * Small chicken enemy.
 * Walks left at constant speed until defeated.
 * @file
 */

/**
 * Smaller chicken enemy variant.
 * Extends MovableObject with walking and death behavior.
 * @class
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
  /** @type {number} Ground Y-position of the small chicken. */
  y = 360;

  /** @type {number} Render height. */
  height = 60;

  /** @type {number} Render width. */
  width = 60;

  /** @type {string[]} Walking animation frames. */
  framesWalk = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
  ];

  /** @type {string[]} Dead sprite frame. */
  framesDead = ['img/3_enemies_chicken/chicken_small/2_dead/dead.png'];

  /**
   * Create a new small chicken.
   * Randomizes position, preloads frames, and starts animations.
   * @constructor
   */
  constructor() {
    super().loadImage(this.framesWalk[0]);
    this.loadImages(this.framesWalk);
    this.loadImages(this.framesDead);

    this.offset = { x: 6, y: 6, width: 12, height: 12 };

    this.x = 300 + Math.random() * 1300;
    this.speed = 0.36;

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
   * Kill the chicken by reducing energy to 0 and playing death animation.
   * @returns {void}
   */
  takeHit() {
    this.energy = 0;
    window.audioManager.play('chickenDie');
    this.playAnimation(this.framesDead);
  }

  /**
   * Instantly kill the chicken:
   * - Load dead frame
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
