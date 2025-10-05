/**
 * Controllable hero with state, damage handling, and simple helpers.
 * Motion and animation loops are split into companion files.
 * @file
 */

/**
 * Main player character.
 * @extends MovableObject
 * @class
 */
class Character extends MovableObject {
  /** Rendered height in pixels. @type {number} */
  height = 280;

  /** World Y position (top-left). @type {number} */
  y = 60;

  /** Horizontal movement speed (px/tick). @type {number} */
  speed = 10;

  /** Collected bottles (ammo). @type {number} */
  flasks = 0;

  /** Collected coins. @type {number} */
  tokens = 0;

  /** Timestamp of last idle start (ms). @type {number} */
  idleSince = Date.now();

  /** Whether the character currently snores. @type {boolean} */
  isSleeping = false;

  /** Idle time before sleep in ms. @type {number} */
  IDLE_TO_SLEEP_MS = 6000;

  /** Owning world instance (injected by World). @type {World} */
  world;

  /** Keyboard controller (injected by World). @type {Keyboard} */
  keyboard;

  /** Flag to ensure death animation runs once. @type {boolean} */
  deathPlayed = false;

  /** True while airborne jump animation should play. @type {boolean} */
  jumping = false;

  /** True while moving horizontally. @type {boolean} */
  moving = false;

  /** True for a short throw window. @type {boolean} */
  throwing = false;

  /** Last throw timestamp (ms). @type {number} */
  lastThrow = 0;

  /**
   * Create a new character, load assets and enable gravity.
   * @returns {void}
   */
  constructor() {
    super().loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_JUMP);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONGIDLE);

    this.y_ground = 150;
    this.idleSince = Date.now();
    this.offset = { x: 20, y: 95, width: 40, height: 110 };
    this.applyGravity();
  }

  /**
   * Check if the character is currently above ground.
   * @returns {boolean} True if airborne.
   */
  onAir() {
    return this.y < this.y_ground;
  }

  /**
   * Check short invulnerability window after a hit.
   * @returns {boolean} True if still considered "hurt now".
   */
  hurtNow() {
    return ((Date.now() - this.lastHit) / 1000) < 1;
  }

  /**
   * Check if the character has no energy left.
   * @returns {boolean} True if dead.
   */
  deadNow() {
    return this.energy <= 0;
  }

  /**
   * Check if a throw action is still active.
   * @returns {boolean} True if within throw window.
   */
  throwNow() {
    return ((Date.now() - this.lastThrow) / 1000) < 0.5;
  }

  /**
   * Reset character to default state (stats, flags, audio).
   * @returns {void}
   */
  reset() {
    this.resetStats();
    this.resetFlags();
    this.resetAudio();
  }

  /**
   * Reset numerical stats and position.
   * @returns {void}
   */
  resetStats() {
    this.energy = 100;
    this.tokens = 0;
    this.flasks = 0;
    this.x = 120;
    this.y = 80;
    this.speed = 10;
  }

  /**
   * Reset runtime flags and timers.
   * @returns {void}
   */
  resetFlags() {
    this.deathPlayed = false;
    this.jumping = false;
    this.moving = false;
    this.idleSince = Date.now();
    this.lastActionWasMovingOrJumping = false;
    this.lastThrow = 0;
  }

  /**
   * Stop ambient sounds such as snoring and walking.
   * @returns {void}
   */
  resetAudio() {
    this.stopSnore?.();
    window.audioManager?.stop?.('walking');
  }

  /**
   * Apply damage, set invulnerability window, and play SFX.
   * @param {number} dmg - Damage points to subtract from energy.
   * @returns {void}
   */
  takeHit(dmg) {
    if (this.hurtNow()) return;
    this.energy = Math.max(0, (this.energy ?? 100) - dmg);
    this.lastHit = Date.now();
    this.stopSnore?.();
    window.audioManager?.play?.(this.energy <= 0 ? 'characterDead' : 'hurt');
  }
}
