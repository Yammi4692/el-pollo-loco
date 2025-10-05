/**
 * Endboss HUD bar that displays the boss' remaining energy.
 * Uses discrete frame images for 0–100% in 20% steps.
 * @file
 */

/**
 * Endboss health/energy status bar.
 * @extends DrawableObject
 * @class
 */
class EndbossBar extends DrawableObject {
  /**
   * Ordered image frames from 0% to 100%.
   * @type {string[]}
   */
  frames = [
    'img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
    'img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
  ];

  /**
   * Current boss health value (0–100).
   * @type {number}
   */
  value = 100;

  /**
   * Preload frames, position the bar on the HUD, and set initial value.
   * @returns {void}
   */
  constructor() {
    super();
    this.loadImages(this.frames);
    this.x = 510;
    this.y = 60;
    this.width = 200;
    this.height = 60;
    this.setValue(100);
  }

  /**
   * Update the bar value and swap to the matching frame image.
   * @param {number} val - New boss health in [0, 100].
   * @returns {void}
   */
  setValue(val) {
    this.value = Math.max(0, Math.min(100, val | 0));
    const path = this.frames[this.pickFrame()];
    this.img = this.imageCache[path];
  }

  /**
   * Pick frame index corresponding to the current value percentage.
   * @returns {number} Frame index.
   */
  pickFrame() {
    return this.frameIndexFromValue(this.value);
  }
}
