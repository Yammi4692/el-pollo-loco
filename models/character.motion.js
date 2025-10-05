/**
 * Move right.
 * @returns {void}
 */
Character.prototype.goRight = function () {
  this.x += this.speed;
  if (!this.moving) this.stopSnore?.();
  this.moving = true;
};

/**
 * Move left.
 * @returns {void}
 */
Character.prototype.goLeft = function () {
  this.x -= this.speed;
  if (!this.moving) this.stopSnore?.();
  this.moving = true;
};

/**
 * Jump if on ground.
 * @returns {void}
 */
Character.prototype.doJump = function () {
  if (!this.onAir()) {
    this.speedY = 25;
    this.stopSnore?.();
    window.audioManager?.stop?.('walking');
    window.audioManager?.play?.('jumping');
    this.jumping = true;
    this.jumpFrame = 0;
  }
};

/**
 * Main movement loop (60 FPS).
 * @returns {void}
 */
Character.prototype.moveAnim = function () {
  setInterval(() => {
    if (this.deadNow()) { this.stopSnore?.(); return; }
    this.throwAction();
    this.jumpAction();
    this.horizMove();
    this.idleCheck();
    this.camUpdate();
  }, 1000 / 60);
};

/**
 * Trigger throw action when F is pressed and bottles are available.
 * @returns {void}
 */
Character.prototype.throwAction = function () {
  if (this.world?.keyboard?.F && this.flasks > 0) {
    this.lastThrow = Date.now();
    this.idleSince = Date.now();
    this.stopSnore?.();
  }
};

/**
 * Trigger jump action when SPACE is pressed and character is grounded.
 * @returns {void}
 */
Character.prototype.jumpAction = function () {
  if (this.world?.keyboard?.SPACE && !this.onAir()) {
    this.doJump();
    this.idleSince = Date.now();
  }
};

/**
 * Dispatch horizontal movement based on keyboard state.
 * @returns {void}
 */
Character.prototype.horizMove = function () {
  const wasMoving = this.moving;
  this.moving = false;
  this.checkRight(wasMoving);
  this.checkLeft(wasMoving);
};

/**
 * Check right movement and update state.
 * @param {boolean} wasMoving - Whether the character was moving in previous tick.
 * @returns {void}
 */
Character.prototype.checkRight = function (wasMoving) {
  if (this.world?.keyboard?.RIGHT && this.x < 2200) {
    this.goRight();
    this.otherDirection = false;
    this.moveStart(wasMoving);
    this.walkSound();
  }
};

/**
 * Check left movement and update state.
 * @param {boolean} wasMoving - Whether the character was moving in previous tick.
 * @returns {void}
 */
Character.prototype.checkLeft = function (wasMoving) {
  if (this.world?.keyboard?.LEFT && this.x > -100) {
    this.goLeft();
    this.otherDirection = true;
    this.moveStart(wasMoving);
    this.walkSound();
  }
};

/**
 * Mark the start of movement and reset idle state if needed.
 * @param {boolean} wasMoving - Whether the character was moving in previous tick.
 * @returns {void}
 */
Character.prototype.moveStart = function (wasMoving) {
  if (!wasMoving) {
    this.idleSince = Date.now();
    this.stopSnore?.();
  }
};

/**
 * Play walking loop if on ground and not already playing.
 * @returns {void}
 */
Character.prototype.walkSound = function () {
  if (this.onAir()) return;
  const a = window.audioManager?.sounds?.walking;
  if (a && a.paused) window.audioManager.playLoop('walking');
};

/**
 * Update camera based on character position.
 * @returns {void}
 */
Character.prototype.camUpdate = function () {
  if (this.world) this.world.camera_x = -this.x + 100;
};

/**
 * Check landing transition and update flags.
 * @param {boolean} wasAir - Whether the character was airborne in previous tick.
 * @returns {boolean} True if still airborne after the check.
 */
Character.prototype.landCheck = function (wasAir) {
  if (wasAir && !this.onAir()) {
    this.jumping = false;
    this.idleSince = Date.now();
    this.stopSnore?.();
    return false;
  }
  if (this.onAir()) return true;
  return wasAir;
};

/**
 * Evaluate idle state, manage snore and walking audio.
 * @returns {void}
 */
Character.prototype.idleCheck = function () {
  if (!this.moving && !this.onAir() && !this.jumping) {
    window.audioManager?.stop?.('walking');
    if (this.lastActionWasMovingOrJumping) {
      this.idleSince = Date.now();
      this.lastActionWasMovingOrJumping = false;
    }
  } else {
    this.stopSnore?.();
    this.lastActionWasMovingOrJumping = true;
  }
};
