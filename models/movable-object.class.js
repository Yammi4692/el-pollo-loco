/**
 * Movable object base class.
 * Extends DrawableObject with physics, gravity, collision, and health handling.
 * @file
 */

/**
 * Base for objects that can move, collide, and be affected by gravity.
 * Provides movement, collision detection, and health logic.
 * @class
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /** @type {number} Horizontal movement speed factor. */
  speed = 0.15;

  /** @type {boolean} If true, object is mirrored (facing left). */
  otherDirection = false;

  /** @type {number} Current vertical speed (for gravity/jumps). */
  speedY = 0;

  /** @type {number} Gravity acceleration per tick. */
  acceleration = 2.5;

  /** @type {number} Hit points / health value. */
  energy = 100;

  /** @type {number} Timestamp of last damage taken in ms. */
  lastHit = 0;

  /**
   * Start gravity loop (25 ticks per second).
   * Clears any existing loop before starting a new one.
   * @returns {void}
   */
  applyGravity() {
    if (this._grav) clearInterval(this._grav);
    this._grav = setInterval(() => this.gravityTick(), 1000 / 25);
  }

  /**
   * Alias for applyGravity() to keep older callers compatible.
   * @returns {void}
   */
  useGravity() {
    this.applyGravity();
  }

  /**
   * Stop gravity loop if currently running.
   * @returns {void}
   */
  clearGravity() {
    if (this._grav) {
      clearInterval(this._grav);
      this._grav = null;
    }
  }

  /**
   * Single gravity tick:
   * - resolve ground level
   * - apply gravity step if above ground or moving vertically
   * - snap to ground if necessary
   * @returns {void}
   */
  gravityTick() {
    const g = this.getGround();
    if (this.shouldApplyStep(g)) {
      this.applyGravityStep();
      this.snapToGround(g);
    }
  }

  /**
   * Resolve the ground Y value for this object.
   * @returns {number} Ground Y coordinate.
   */
  getGround() {
    return (typeof this.y_ground === 'number') ? this.y_ground : 150;
  }

  /**
   * Decide if gravity should be applied this tick.
   * Throwable objects are always treated as above ground.
   * @param {number} g - Ground Y coordinate.
   * @returns {boolean} True if gravity step should run.
   */
  shouldApplyStep(g) {
    return this.isAboveGround(g) || this.speedY > 0;
  }

  /**
   * Apply one step of gravity integration (position + velocity).
   * @returns {void}
   */
  applyGravityStep() {
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
  }

  /**
   * Snap object to ground if it should land.
   * @param {number} g - Ground Y coordinate.
   * @returns {void}
   */
  snapToGround(g) {
    if (this.y >= g && this.speedY <= 0) {
      this.y = g;
      this.speedY = 0;
    }
  }

  /**
   * Check whether object is above the ground.
   * Throwable objects are always considered above ground.
   * @param {number} [g] - Optional ground Y coordinate.
   * @returns {boolean} True if above ground.
   */
  isAboveGround(g) {
    if (this instanceof ThrowableObject) return true;
    const ground = g ?? this.getGround();
    return this.y < ground;
  }

  /**
   * Axis-aligned bounding-box collision check with offsets.
   * @param {MovableObject} mo - Other object to test collision with.
   * @returns {boolean} True if collision detected.
   */
  collidesWith(mo) {
    return (
      this.x + this.offset.x + this.width - this.offset.width > mo.x + mo.offset.x &&
      this.y + this.offset.y + this.height - this.offset.height > mo.y + mo.offset.y &&
      this.x + this.offset.x < mo.x + mo.offset.x + mo.width - mo.offset.width &&
      this.y + this.offset.y < mo.y + mo.offset.y + mo.height - mo.offset.height
    );
  }

  /**
   * Apply damage and update lastHit timestamp.
   * @param {number} [dmg=5] - Damage amount.
   * @returns {void}
   */
  hit(dmg = 5) {
    this.energy -= dmg;
    if (this.energy < 0) this.energy = 0;
    else this.lastHit = Date.now();
  }

  /**
   * Check if object is still in hurt cooldown (1s).
   * @returns {boolean} True if hurt cooldown active.
   */
  isHurt() {
    return (Date.now() - this.lastHit) / 1000 < 1;
  }

  /**
   * Check if object has no energy left.
   * @returns {boolean} True if dead.
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Move object to the right by its speed.
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Move object to the left by its speed.
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Make the object jump by setting vertical speed upward.
   * @returns {void}
   */
  jump() {
    this.speedY = 30;
  }
}
