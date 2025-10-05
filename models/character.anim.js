/**
 * Character animation loops (movement and image frame cycles).
 * Prototype extensions for Character.
 * @file
 */

/**
 * Start animation loops (movement + image cycles).
 * @returns {void}
 */
Character.prototype.startAnim = function () {
  this.moveAnim();
  this.imageAnim();
};

/**
 * Cycle image frames depending on current state.
 * @returns {void}
 */
Character.prototype.imageAnim = function () {
  let wasAir = false;
  setInterval(() => {
    if (this.deadNow()) { this.deathAnim(); return; }
    if (this.pickAnim()) return;
    wasAir = this.landCheck(wasAir);
    this.idleAnim();
  }, 150);
};

/**
 * Select which animation to play for this frame.
 * @returns {boolean} True if an animation was played.
 */
Character.prototype.pickAnim = function () {
  if (this.walkAnim() || this.hurtAnim() || this.jumpAnim() || this.throwAnim()) {
    window.audioManager?.stop?.('snore');
    return true;
  }
  return false;
};

/**
 * Play walking animation when moving on ground.
 * @returns {boolean} True if walking animation played.
 */
Character.prototype.walkAnim = function () {
  if (this.moving && !this.onAir()) {
    this.stopSnore?.();
    this.playAnimation(this.IMAGES_WALK);
    return true;
  }
  return false;
};

/**
 * Play hurt animation when recently damaged.
 * @returns {boolean} True if hurt animation played.
 */
Character.prototype.hurtAnim = function () {
  if (this.hurtNow()) {
    this.stopSnore?.();
    this.playAnimation(this.IMAGES_HURT);
    return true;
  }
  return false;
};

/**
 * Play jump animation while airborne.
 * @returns {boolean} True if jump animation played.
 */
Character.prototype.jumpAnim = function () {
  if (this.onAir()) {
    this.stopSnore?.();
    this.jumping = true;
    const i = this.jumpFrame % this.IMAGES_JUMP.length;
    const path = this.IMAGES_JUMP[i];
    this.img = this.imageCache[path];
    this.jumpFrame++;
    return true;
  }
  return false;
};

/**
 * Play throw animation while throwing.
 * @returns {boolean} True if throw animation played.
 */
Character.prototype.throwAnim = function () {
  if (this.throwNow()) {
    this.stopSnore?.();
    this.playAnimation(this.IMAGES_IDLE);
    return true;
  }
  return false;
};

/**
 * Handle idle or long-idle (snore) animation.
 * @returns {void}
 */
Character.prototype.idleAnim = function () {
  const idleTime = (Date.now() - this.idleSince) / 1000;
  const canSnore = idleTime > 4 && !this.onAir() && !this.moving && !this.throwNow();
  if (canSnore) {
    this.playAnimation(this.IMAGES_LONGIDLE);
    this.startSnore();
  } else {
    this.playAnimation(this.IMAGES_IDLE);
    this.stopSnore();
  }
};

/**
 * Stop snore sound if currently playing.
 * @returns {void}
 */
Character.prototype.stopSnore = function () {
  if (this.isSnoring) {
    this.isSnoring = false;
    window.audioManager?.stop?.('snore');
  }
};

/**
 * Start snore loop if long idle and not muted.
 * @returns {void}
 */
Character.prototype.startSnore = function () {
  if (!this.isSnoring && !window.audioManager?.isMutedGlobally?.()) {
    this.isSnoring = true;
    window.audioManager?.playLoop?.('snore');
  }
};

/**
 * Trigger death animation sequence once.
 * @returns {void}
 */
Character.prototype.deathAnim = function () {
  if (this.deathPlayed) return;
  this.deathPlayed = true;
  this.stopSnore();
  window.audioManager?.stop?.('walking');
  this.deathFrames();
};

/**
 * Iterate through death frames until completed.
 * @returns {void}
 */
Character.prototype.deathFrames = function () {
  let frame = 0;
  const itv = setInterval(() => {
    if (frame < this.IMAGES_DEAD.length) {
      this.loadImage(this.IMAGES_DEAD[frame]);
      frame++;
    } else {
      clearInterval(itv);
      this.deathDone();
    }
  }, 200);
};

/**
 * Callback invoked after death animation finishes.
 * @returns {void}
 */
Character.prototype.deathDone = function () {
  this.world?.showLostScreen?.();
};
