/**
 * Projectile handling for the game world.
 * Manages throwable bottles, cooldowns, collisions, and splash effects.
 * @file
 */

/**
 * Handle bottle throw input and cooldown timing.
 * @returns {void}
 */
World.prototype.checkThrowObjects = function () {
  const now = Date.now(), cd = 500;
  if (this.canThrowBottle(now, cd)) {
    this.createAndThrowBottle();
    this.lastBottleThrowTime = now;
  }
};

/**
 * Determine if a bottle can be thrown at the current time.
 * Requires available ammo, key press, and cooldown passed.
 * @param {number} now - Current timestamp.
 * @param {number} cd - Cooldown in milliseconds.
 * @returns {boolean} True if bottle can be thrown.
 */
World.prototype.canThrowBottle = function (now, cd) {
  return this.keyboard.F &&
    this.character.flasks > 0 &&
    now - this.lastBottleThrowTime >= cd;
};

/**
 * Create and launch a new bottle projectile.
 * Decreases ammo and updates the bottle bar.
 * @returns {void}
 */
World.prototype.createAndThrowBottle = function () {
  const dir = this.character.otherDirection ? 'left' : 'right';
  const xOff = dir === 'right' ? 100 : -50;
  const b = new ThrowableObject(this.character.x + xOff, this.character.y + 100, dir);
  b.world = this;
  this.throwableObjects.push(b);
  this.character.flasks--;
  this.bottleBar.setLevel(this.character.flasks);
};

/**
 * Check all projectile hits against enemies and ground.
 * @returns {void}
 */
World.prototype.checkBottleHitsEndboss = function () {
  this.throwableObjects.forEach(b => {
    this.checkBottleHitsEnemies(b);
    this.checkBottleHitsGround(b);
  });
};

/**
 * Check collisions between a bottle and all enemies.
 * @param {ThrowableObject} b - The bottle to test.
 * @returns {void}
 */
World.prototype.checkBottleHitsEnemies = function (b) {
  this.level.enemies.forEach(e => {
    if (this.isBottleHittingEnemy(b, e)) this.handleBottleHitEnemy(b, e);
  });
};

/**
 * Axis-aligned bounding box collision check.
 * @param {ThrowableObject} b - The bottle.
 * @param {MovableObject} e - Enemy object.
 * @returns {boolean} True if bottle collides with enemy.
 */
World.prototype.isBottleHittingEnemy = function (b, e) {
  return b.collidesWith(e) && !b.hasSplashed;
};

/**
 * Handle bottle impact on an enemy.
 * Routes to boss or small enemy handling.
 * @param {ThrowableObject} b - The bottle.
 * @param {MovableObject} e - Enemy hit.
 * @returns {void}
 */
World.prototype.handleBottleHitEnemy = function (b, e) {
  if (e instanceof BossChicken) {
    this.handleBossHit(b, e);
  } else if (e instanceof NormalChicken || e instanceof SmallChicken) {
    this.handleSmallEnemyHit(b, e);
  }
};

/**
 * Handle bottle hitting the boss enemy.
 * Applies damage, triggers splash, and updates boss health bar.
 * @param {ThrowableObject} b - The bottle.
 * @param {BossChicken} e - The boss enemy.
 * @returns {void}
 */
World.prototype.handleBossHit = function (b, e) {
  e.takeHit?.(25);
  b.doSplash();
  this.endbossBar.setValue(e.energy);
};

/**
 * Handle bottle hitting small or normal chickens.
 * Kills enemy, removes from level, and triggers splash.
 * @param {ThrowableObject} b - The bottle.
 * @param {MovableObject} e - Enemy hit.
 * @returns {void}
 */
World.prototype.handleSmallEnemyHit = function (b, e) {
  if (typeof e.kill === 'function') e.kill();
  else { e.energy = 0; e.speed = 0; }

  const i = this.level.enemies.indexOf(e);
  if (i > -1) this.level.enemies.splice(i, 1);

  b.doSplash();
};

/**
 * Trigger bottle splash when it reaches the ground.
 * @param {ThrowableObject} b - The bottle to check.
 * @returns {void}
 */
World.prototype.checkBottleHitsGround = function (b) {
  if (b.y >= 370 && !b.hasSplashed) b.doSplash();
};
