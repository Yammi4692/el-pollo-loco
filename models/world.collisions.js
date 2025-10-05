/**
 * Collision handling for the game world.
 * Extends World prototype with collision detection and responses.
 * @file
 */

/**
 * Setup frequent checks for collisions with enemies and boundaries.
 * Registers its own interval and stores it for cleanup.
 * @returns {void}
 */
World.prototype.checkCollisions = function () {
  const itv = setInterval(() => {
    if (!this.character) return;
    this.checkEnemyCollisions();
    this.enforceWorldBoundaries();
  }, 50);
  this.gameIntervals.push(itv);
};

/**
 * Iterate enemies and test for collisions with the character.
 * @returns {void}
 */
World.prototype.checkEnemyCollisions = function () {
  this.level.enemies.forEach(e => {
    if (this.character.collidesWith(e) && !this.character.deadNow()) {
      this.handleCollisionWithEnemy(e);
    }
  });
};

/**
 * Handle outcome of collision with an enemy.
 * Decides between stomp kill vs. taking damage.
 * @param {MovableObject} e - Enemy object.
 * @returns {void}
 */
World.prototype.handleCollisionWithEnemy = function (e) {
  const bottom = this.character.y + this.character.height;
  const top = e.y;
  const cx = this.character.x + this.character.width / 2;
  const ex = e.x + e.width / 2;

  if (this.isJumpingOnEnemy(bottom, top, cx, ex)) {
    this.handleJumpOnEnemy(e);
    return;
  }
  this.handleDamageFromEnemy(e, cx, ex);
};

/**
 * Check if character is stomping an enemy from above while descending.
 * @param {number} bottom - Character bottom Y.
 * @param {number} top - Enemy top Y.
 * @param {number} cx - Character center X.
 * @param {number} ex - Enemy center X.
 * @returns {boolean} True if stomp attack applies.
 */
World.prototype.isJumpingOnEnemy = function (bottom, top, cx, ex) {
  return this.character.speedY < 0 &&
    bottom >= top &&
    bottom <= top + 50 &&
    Math.abs(cx - ex) < 50;
};

/**
 * Kill chicken enemy and bounce character upward.
 * @param {MovableObject} e - Enemy (small/normal chicken).
 * @returns {void}
 */
World.prototype.handleJumpOnEnemy = function (e) {
  if (e instanceof NormalChicken || e instanceof SmallChicken) {
    e.takeHit();
    const i = this.level.enemies.indexOf(e);
    if (i > -1) this.level.enemies.splice(i, 1);
    this.character.speedY = 15;
  }
};

/**
 * Apply damage from enemy collision.
 * Handles knockback on boss hits, updates status bar, and checks death.
 * @param {MovableObject} e - Enemy object.
 * @param {number} cx - Character center X.
 * @param {number} ex - Enemy center X.
 * @returns {void}
 */
World.prototype.handleDamageFromEnemy = function (e, cx, ex) {
  if (this.character.hurtNow()) return;
  if (e instanceof NormalChicken) this.character.takeHit(10);
  else if (e instanceof SmallChicken) this.character.takeHit(5);
  else if (e instanceof BossChicken && e.attacking) {
    this.character.takeHit(25);
    this.applyKnockbackEffect(cx, ex);
  }
  this.statusBar.setValue(this.character.energy);
  this.checkForCharacterDeath();
};

/**
 * Push character horizontally away from enemy center.
 * @param {number} cx - Character center X.
 * @param {number} ex - Enemy center X.
 * @returns {void}
 */
World.prototype.applyKnockbackEffect = function (cx, ex) {
  if (cx < ex) this.character.x -= 20;
  else this.character.x += 20;
};

/**
 * If character is dead, run death animation and show "lost" screen.
 * @returns {void}
 */
World.prototype.checkForCharacterDeath = function () {
  if (!this.character.deadNow()) return;
  this.character.deathAnim();
  setTimeout(() => this.showLostScreen(), 1000);
};

/**
 * Clamp character X position within world bounds.
 * @returns {void}
 */
World.prototype.enforceWorldBoundaries = function () {
  if (this.character.x < -100) this.character.x = -100;
  if (this.character.x > 2200) this.character.x = 2200;
};

/**
 * Check collisions with coins and collect them.
 * @returns {void}
 */
World.prototype.checkCollisionWithCoins = function () {
  this.level.coins.forEach((c, i) => {
    if (this.character.collidesWith(c)) this.collectCoin(i);
  });
};

/**
 * Remove coin, increase token count, update coin bar.
 * @param {number} i - Index of coin to collect.
 * @returns {void}
 */
World.prototype.collectCoin = function (i) {
  this.level.coins.splice(i, 1);
  this.character.tokens++;
  this.coinBar.setCount(this.character.tokens);
};

/**
 * Check collisions with bottle pickups and collect them.
 * @returns {void}
 */
World.prototype.checkBottleCollisions = function () {
  this.level.bottles.forEach((b, i) => {
    if (this.character.collidesWith(b)) this.collectBottle(i);
  });
};

/**
 * Remove bottle pickup, increase ammo, and update bottle bar.
 * @param {number} i - Index of bottle to collect.
 * @returns {void}
 */
World.prototype.collectBottle = function (i) {
  this.level.bottles.splice(i, 1);
  this.character.flasks++;
  this.bottleBar.setLevel(this.character.flasks);
};
