/**
 * Enemy and item spawning logic for the game world.
 * Handles periodic enemy and bottle spawns with limits.
 * @file
 */

/**
 * Periodically spawn roaming chickens while the character is alive.
 * Caps maximum enemy count to avoid performance issues.
 * @returns {void}
 */
World.prototype.spawnNewEnemies = function () {
  const itv = setInterval(() => {
    if (!this.character.deadNow && this.level.enemies.length < 15) {
      if (Math.random() < 0.4) this.spawnRandomEnemy();
    }
  }, 1500);
  this.gameIntervals.push(itv);
};

/**
 * Periodically spawn bottle pickups ahead of the character.
 * Caps maximum bottle count to prevent clutter.
 * @returns {void}
 */
World.prototype.spawnBottlePickups = function () {
  const itv = setInterval(() => {
    const MAX = 17;
    if (this.level.bottles.length >= MAX) return;
    const x = this.character.x + 300 + Math.random() * 600;
    const b = new Bottle();
    b.x = Math.min(x, this.level.level_end_x - 200);
    b.y = 340;
    this.level.bottles.push(b);
  }, 4000);
  this.gameIntervals.push(itv);
};

/**
 * Spawn a random enemy (normal or small chicken).
 * Sets position and links to world.
 * @returns {void}
 */
World.prototype.spawnRandomEnemy = function () {
  const e = Math.random() < 0.5 ? new NormalChicken() : new SmallChicken();
  e.x = this.calculateEnemySpawnPosition();
  e.world = this;
  this.level.enemies.push(e);
};

/**
 * Calculate enemy spawn position on the X axis.
 * Ensures spawn is ahead of player but within level bounds.
 * @returns {number} Spawn X coordinate.
 */
World.prototype.calculateEnemySpawnPosition = function () {
  const dMin = 400, dMax = 800;
  const x = this.character.x + dMin + Math.random() * (dMax - dMin);
  return Math.min(x, this.level.level_end_x - 500);
};
