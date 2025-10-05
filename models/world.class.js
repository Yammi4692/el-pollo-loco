/**
 * Central game world.
 * Manages level, character, rendering, input, and game loops.
 * @file
 */

/**
 * World controller class.
 * Handles all core game logic including rendering, physics, and state.
 * @class
 */
class World {
  /** @type {Character} Main player character instance. */
  character = new Character();

  /** @type {Level|undefined} Current level definition. */
  level = undefined;

  /** @type {HTMLCanvasElement|undefined} Rendering canvas element. */
  canvas = undefined;

  /** @type {CanvasRenderingContext2D|undefined} 2D rendering context. */
  ctx = undefined;

  /** @type {Keyboard|undefined} Keyboard input instance. */
  keyboard = undefined;

  /** @type {number} Camera offset for side-scrolling. */
  camera_x = 0;

  /** @type {StatusBar} Global health/status bar. */
  statusBar = new StatusBar();

  /** @type {BottleBar} Ammo bar for bottles. */
  bottleBar = new BottleBar();

  /** @type {CoinBar} Coin counter bar. */
  coinBar = new CoinBar();

  /** @type {EndbossBar} Endboss health bar. */
  endbossBar = new EndbossBar();

  /** @type {ThrowableObject[]} Active projectile objects (bottles). */
  throwableObjects = [];

  /** @type {number[]} Active interval IDs (for cleanup). */
  gameIntervals = [];

  /** @type {number} Last timestamp a bottle was thrown (ms). */
  lastBottleThrowTime = 0;

  /** @type {number} Timestamp of last character activity. */
  idleSince = Date.now();

  /** @type {boolean} Whether snore sound is active. */
  isSleeping = false;

  /** @type {number} Last known X position for idle detection. */
  lastPosX = 0;

  /** @type {number} Last known Y position for idle detection. */
  lastPosY = 0;

  /** @type {number} Idle timeout (ms) before character goes to sleep. */
  IDLE_TO_SLEEP_MS = 6000;

  /**
   * Construct a new world and initialize everything.
   * - Sets up rendering context and input
   * - Loads level data
   * - Starts draw loop and game logic
   * - Spawns enemies and bottle pickups
   * - Starts background music
   * @param {HTMLCanvasElement} canvas - The canvas element to render on.
   * @param {Keyboard} keyboard - The keyboard input controller.
   * @constructor
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level1;

    this.setWorld();
    this.draw();
    this.run();
    this.spawnNewEnemies();
    this.spawnBottlePickups();

    window.audioManager?.playLoop?.('background');

    this.lastPosX = this.character.x;
    this.lastPosY = this.character.y;
  }
}
