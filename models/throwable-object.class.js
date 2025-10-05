/**
 * Throwable salsa bottle object.
 * Flies in the chosen direction, falls with gravity, and splashes on impact.
 * @file
 */

/**
 * Salsa bottle projectile class.
 * Extends MovableObject with throwing, gravity, and splash behavior.
 * @class
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /** @type {string[]} Splash animation frames. */
  splashFrames = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
  ];

  /** @type {boolean} Whether the bottle has already splashed. */
  hasSplashed = false;

  /** @type {number} Ground Y specifically for bottles (Canvas 480px → ~370). */
  y_ground = 370;

  /** @type {'left'|'right'} Direction of throw. */
  direction = 'right';

  /**
   * Create a throwable bottle at a given position and direction.
   * @param {number} x - Initial X position.
   * @param {number} y - Initial Y position.
   * @param {'left'|'right'} [dir='right'] - Throw direction.
   */
  constructor(x, y, dir = 'right') {
    super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.loadImages(this.splashFrames);
    this.x = x;
    this.y = y;
    this.height = 100;
    this.width = 80;
    this.offset = { x: 8, y: 8, width: 16, height: 16 };
    this.direction = dir;
    this.launch();
  }

  /**
   * Launch the bottle forward and apply gravity.
   * Plays throw sound and moves horizontally until splash.
   * @returns {void}
   */
  launch() {
    this.speedY = 30;
    this.applyGravity();
    window.audioManager?.play?.('throwBottle');

    this._fly = setInterval(() => {
      if (!this.hasSplashed) {
        this.x += (this.direction === 'right' ? 6 : -6);
      }
    }, 25);
  }

  /**
   * Override: snap to ground and trigger splash on impact.
   * @param {number} g - Ground Y coordinate.
   * @returns {void}
   */
  snapToGround(g) {
    const ground = this.y_ground ?? g;
    if (this.y >= ground && this.speedY <= 0) {
      this.y = ground;
      this.speedY = 0;
      if (!this.hasSplashed) this.doSplash();
    }
  }

  /**
   * Trigger splash animation and remove object after completion.
   * Plays splash sound, iterates frames, then removes from world.
   * @returns {void}
   */
  doSplash() {
    this.hasSplashed = true;
    window.audioManager?.play?.('bottleSplash');

    if (this._fly) {
      clearInterval(this._fly);
      this._fly = null;
    }

    let currentFrame = 0;
    const splashInterval = setInterval(() => {
      if (currentFrame < this.splashFrames.length) {
        this.img = this.imageCache[this.splashFrames[currentFrame]];
        currentFrame++;
      } else {
        clearInterval(splashInterval);

        if (this.world) {
          const index = this.world.throwableObjects.indexOf(this);
          if (index > -1) this.world.throwableObjects.splice(index, 1);
        }
      }
    }, 100);
  }
}
