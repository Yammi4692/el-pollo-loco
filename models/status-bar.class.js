/**
 * Character health status bar.
 * Displays different frames based on current health value (0–100).
 * @file
 */

/**
 * Health status bar for the player character.
 * Extends DrawableObject with value-based frame switching.
 * @class
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  /** @type {string[]} Preloaded frame images for different health values. */
  frames = [
    'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
  ];

  /** @type {number} Current health value (0–100). */
  value = 100;

  /**
   * Create and position the health bar.
   * Preloads frames and initializes with full value.
   * @constructor
   */
  constructor() {
    super();
    this.loadImages(this.frames);
    this.x = 10;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setValue(100);
  }

  /**
   * Update the numeric value and displayed frame.
   * @param {number} val - New health value (0–100).
   * @returns {void}
   */
  setValue(val) {
    this.value = val;
    const path = this.frames[this.pickFrame()];
    this.img = this.imageCache[path];
  }

  /**
   * Pick the frame index based on current value.
   * @returns {number} Index of the selected frame.
   */
  pickFrame() {
    return this.frameIndexFromValue(this.value);
  }
}
