/**
 * World rendering and end-of-run UI logic.
 * Handles drawing, overlays, audio toggling, and resets.
 * @file
 */

/**
 * Main render loop.
 * Clears canvas, draws world objects and UI, then requests next frame.
 * @returns {void}
 */
World.prototype.draw = function () {
  this.clearCanvas();
  this.drawWorldObjects();
  this.drawUIElements();
  this.requestNextFrame();
};

/**
 * Clear the entire canvas.
 * @returns {void}
 */
World.prototype.clearCanvas = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * Draw background, player, enemies, coins, bottles with camera transform.
 * @returns {void}
 */
World.prototype.drawWorldObjects = function () {
  this.ctx.translate(this.camera_x, 0);

  this.addObjectsToMap(this.level.backgroundObjects);
  this.addObjectsToMap(this.level.clouds);
  this.addObjectsToMap(this.level.bottles);
  this.addToMap(this.character);
  this.addObjectsToMap(this.level.enemies);
  this.addObjectsToMap(this.level.coins);
  this.addObjectsToMap(this.throwableObjects);

  this.ctx.translate(-this.camera_x, 0);
};

/**
 * Draw fixed-position UI elements (status bars, boss bar if in range).
 * @returns {void}
 */
World.prototype.drawUIElements = function () {
  this.addToMap(this.statusBar);
  this.addToMap(this.bottleBar);
  this.addToMap(this.coinBar);

  const boss = this.level.enemies.find(e => e instanceof BossChicken);
  if (boss && !boss.dead && Math.abs(this.character.x - boss.x) < 600) {
    this.endbossBar.setValue(boss.energy);
    this.addToMap(this.endbossBar);
  }
};

/**
 * Schedule the next render pass with requestAnimationFrame.
 * @returns {void}
 */
World.prototype.requestNextFrame = function () {
  requestAnimationFrame(() => this.draw());
};

/**
 * Draw an array of drawable objects to the canvas.
 * @param {DrawableObject[]} arr - Objects to draw.
 * @returns {void}
 */
World.prototype.addObjectsToMap = function (arr) {
  arr.forEach(o => this.addToMap(o));
};

/**
 * Draw a single object; flip horizontally if facing left.
 * @param {DrawableObject} mo - Object to draw.
 * @returns {void}
 */
World.prototype.addToMap = function (mo) {
  if (mo.otherDirection) this.flipImage(mo);

  mo.draw(this.ctx);
  mo.drawFrame(this.ctx);
  mo.drawOffsetFrame(this.ctx);

  if (mo.otherDirection) this.flipImageBack(mo);
};

/**
 * Prepare the canvas transform to draw a mirrored object.
 * @param {DrawableObject} mo - Object to flip.
 * @returns {void}
 */
World.prototype.flipImage = function (mo) {
  this.ctx.save();
  this.ctx.translate(mo.width, 0);
  this.ctx.scale(-1, 1);
  mo.x = -mo.x;
};

/**
 * Restore position/transform after mirrored draw.
 * @param {DrawableObject} mo - Object to unflip.
 * @returns {void}
 */
World.prototype.flipImageBack = function (mo) {
  mo.x = -mo.x;
  this.ctx.restore();
};

/**
 * Show the "You Won" overlay, stop the game and play sound.
 * @returns {void}
 */
World.prototype.showWonScreen = function () {
  this.stopGame();
  this.playGameWonSound();
  this.displayGameWonUI();
  displayGameWon?.();
};

/**
 * Reveal the "game-won" overlay element.
 * @returns {void}
 */
World.prototype.displayGameWonUI = function () {
  const el = document.getElementById('game-won');
  if (!el) return;
  el.classList.remove('d-none');
  el.style.display = 'flex';
};

/**
 * Stop background sound and play the victory sound.
 * @returns {void}
 */
World.prototype.playGameWonSound = function () {
  if (!window.audioManager) return;
  window.audioManager.stop('background');
  window.audioManager.play('gameWin');
};

/**
 * Show the "Game Over" overlay, stop the game and play sound.
 * @returns {void}
 */
World.prototype.showLostScreen = function () {
  this.stopGame();
  this.playGameOverSound();
  this.displayGameOverUI();
  displayGameOver?.();
};

/**
 * Reveal the "game-over" overlay element.
 * @returns {void}
 */
World.prototype.displayGameOverUI = function () {
  const el = document.getElementById('game-over');
  if (!el) return;
  el.classList.remove('d-none');
  el.style.display = 'flex';
};

/**
 * Play the game over sound (if audio manager exists).
 * @returns {void}
 */
World.prototype.playGameOverSound = function () {
  window.audioManager?.play?.('gameOver');
};

/**
 * Toggle global mute via AudioManager.
 * @param {boolean} muted - True to mute, false to unmute.
 * @returns {void}
 */
World.prototype.toggleSound = function (muted) {
  window.audioManager?.forceMute?.(muted);
};

/**
 * Make the restart button visible and bind its action.
 * @returns {void}
 */
World.prototype.showRestartButton = function () {
  const btn = document.getElementById('restartButton');
  if (!btn) return;
  btn.classList.remove('d-none');
  btn.onclick = () => restartGame(); 
};

/**
 * Stop all audio, clear intervals, and freeze entities.
 * Used for end-of-run cleanup.
 * @returns {void}
 */
World.prototype.stopGame = function () {
  window.audioManager?.stopAll?.();
  this.clearAllGameIntervals();
  this.freezeAll();
  this.stopAllEnemies();
};

/**
 * Clear all stored intervals.
 * @returns {void}
 */
World.prototype.clearAllGameIntervals = function () {
  this.gameIntervals.forEach(clearInterval);
  this.gameIntervals = [];
};

/**
 * Mark boss enemies as dead/idle so they stop acting.
 * @returns {void}
 */
World.prototype.stopAllEnemies = function () {
  this.level.enemies.forEach(e => {
    if (e instanceof BossChicken) {
      e.dead = true;
      e.attacking = false;
    }
  });
};

/**
 * Reset world state: character, enemies, UI, objects, and camera.
 * Also halts audio.
 * @returns {void}
 */
World.prototype.reset = function () {
  this.resetCharacter();
  this.resetEnemies();
  this.resetUI();
  this.resetGameObjects();
  this.resetCamera();
  window.audioManager?.haltAll?.();
};

/**
 * Reset character to default values.
 * @returns {void}
 */
World.prototype.resetCharacter = function () {
  this.character?.reset?.();
};

/**
 * Reset boss enemies to alive with full energy.
 * @returns {void}
 */
World.prototype.resetEnemies = function () {
  this.level.enemies.forEach(e => {
    if (e instanceof BossChicken) {
      e.dead = false;
      e.attacking = false;
      e.energy = 100;
    }
  });
};

/**
 * Reset all UI bars to initial values.
 * @returns {void}
 */
World.prototype.resetUI = function () {
  this.statusBar.setValue(100);
  this.bottleBar.setLevel(0);
  this.coinBar.setCount(0);
  this.endbossBar.setValue(100);
};

/**
 * Clear transient objects like thrown bottles.
 * @returns {void}
 */
World.prototype.resetGameObjects = function () {
  this.throwableObjects = [];
};

/**
 * Re-center camera.
 * @returns {void}
 */
World.prototype.resetCamera = function () {
  this.camera_x = 0;
};

/**
 * Freeze character, enemies, and projectiles.
 * Blocks input and disables motion/animations.
 * @returns {void}
 */
World.prototype.freezeAll = function () {
  this.isFrozen = true;
  this.blockKeyboardInput();
  this.freezeObject(this.character);
  this.level.enemies.forEach(e => this.freezeObject(e));
  this.throwableObjects.forEach(b => this.freezeObject(b));
};

/**
 * Block all keyboard input by resetting flags and locking state.
 * @returns {void}
 */
World.prototype.blockKeyboardInput = function () {
  if (!this.keyboard) return;
  Object.keys(this.keyboard).forEach(k => {
    if (typeof this.keyboard[k] === 'boolean') this.keyboard[k] = false;
  });
  this.keyboard.blocked = true;
};

/**
 * Disable motion, gravity, and animations for an object.
 * @param {MovableObject} o - Object to freeze.
 * @returns {void}
 */
World.prototype.freezeObject = function (o) {
  if (!o) return;
  o.speed = 0; o.speedX = 0; o.speedY = 0; o.acceleration = 0;

  o.applyGravity = function () { };
  o.moveLeft = () => { }; o.moveRight = () => { };
  o.jump = () => { };

  if (typeof o.stopAnim === 'function') o.stopAnim();
  if (typeof o.stop === 'function') o.stop();
};
