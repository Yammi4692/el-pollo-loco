/**
 * Core world logic.
 * Handles global references, idle state updates, and recurring game loops.
 * @file
 */

/**
 * Wire up world references so character and enemies can access global state.
 * Starts character animations and boss animations if present.
 * @returns {void}
 */
World.prototype.setWorld = function () {
  this.character.world = this;
  this.character.keyboard = this.keyboard;
  this.character.startAnim();
  this.level.enemies.forEach(e => {
    e.world = this;
    if (e instanceof BossChicken) e.startAnim();
  });
};

/**
 * Start periodic logic loops.
 * Handles collisions, bottle checks, idle updates, and throw actions.
 * Stores interval IDs for cleanup.
 * @returns {void}
 */
World.prototype.run = function () {
  const logic = setInterval(() => {
    this.checkCollisions();
    this.checkBottleCollisions();
    this.checkCollisionWithCoins();
    this.checkBottleHitsEndboss();
    this.updateIdle();
  }, 200);

  const throws = setInterval(() => this.checkThrowObjects(), 100);
  this.gameIntervals.push(logic, throws);
};

/**
 * Update idle/snoring state.
 * Resets or starts snoring depending on activity.
 * @returns {void}
 */
World.prototype.updateIdle = function () {
  if (this.isActiveNow()) {
    this.resetIdle();
  } else {
    this.checkIdleTimeout();
  }
  this.saveLastPos();
};

/**
 * Check if character is currently active.
 * Considers position changes and keyboard input.
 * @returns {boolean} True if character is moving or keys are pressed.
 */
World.prototype.isActiveNow = function () {
  const kb = this.keyboard || {};
  const moving =
    this.character.x !== this.lastPosX ||
    this.character.y !== this.lastPosY ||
    this.character.speedY > 0;
  const keys = kb.A || kb.D || kb.LEFT || kb.RIGHT || kb.SPACE || kb.F;
  return !!(moving || keys);
};

/**
 * Reset idle timer and stop snoring if active again.
 * @returns {void}
 */
World.prototype.resetIdle = function () {
  this.idleSince = Date.now();
  if (this.isSleeping) {
    this.isSleeping = false;
    window.audioManager?.stop('snore');
  }
};

/**
 * Check idle timeout.
 * Starts snoring audio if idle duration exceeded.
 * @returns {void}
 */
World.prototype.checkIdleTimeout = function () {
  if (!this.isSleeping && Date.now() - this.idleSince >= this.IDLE_TO_SLEEP_MS) {
    this.isSleeping = true;
    window.audioManager?.playLoop('snore');
  }
};

/**
 * Save last character position for idle detection.
 * @returns {void}
 */
World.prototype.saveLastPos = function () {
  this.lastPosX = this.character.x;
  this.lastPosY = this.character.y;
};
