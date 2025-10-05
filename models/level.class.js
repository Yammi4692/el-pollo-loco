/**
 * Level configuration.
 * Represents a game stage with enemies, clouds, backgrounds, coins, and bottles.
 * @file
 */

/**
 * Holds all objects needed to render and play through a level.
 * @class
 */
class Level {
  /** @type {MovableObject[]} Enemies in the level (normal, small, boss). */
  enemies;

  /** @type {Cloud[]} Decorative cloud objects. */
  clouds;

  /** @type {BackgroundObject[]} Scrolling background layers. */
  backgroundObjects;

  /** @type {Coin[]} Collectible coins. */
  coins;

  /** @type {Bottle[]} Collectible bottles. */
  bottles;

  /** @type {number} The x-coordinate where the level ends. */
  level_end_x = 3000;

  /**
   * Create a new Level instance.
   * @param {MovableObject[]} [enemies=[]] - Array of enemies.
   * @param {Cloud[]} [clouds=[]] - Array of clouds.
   * @param {BackgroundObject[]} [backgroundObjects=[]] - Array of background layers.
   * @param {Coin[]} [coins=[]] - Array of collectible coins.
   * @param {Bottle[]} [bottles=[]] - Array of collectible bottles.
   */
  constructor(enemies = [], clouds = [], backgroundObjects = [], coins = [], bottles = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
