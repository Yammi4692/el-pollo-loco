/**
 * Coin status bar that visualizes the player's collected coins.
 * @file
 */

/**
 * Coin status bar sprite with discrete frames for 0–100%.
 * @extends DrawableObject
 * @class
 */
class CoinBar extends DrawableObject {
  /**
   * Ordered image frames from 0% to 100%.
   * @type {string[]}
   */
  frames = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
  ];

  /** Current coin count. @type {number} */
  count = 0;

  /** Maximum coins mapped to 100%. @type {number} */
  maxCount = 5;

  /**
   * Preload frames, position the bar and show initial state.
   * @returns {void}
   */
  constructor() {
    super();
    this.loadImages(this.frames);
    this.x = 250;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setCount(0);
  }

  /**
   * Update count and displayed frame based on maxCount.
   * @param {number} value - New coin count (integer).
   * @returns {void}
   */
  setCount(value) {
    this.count = Math.max(0, value | 0);
    const pct = Math.max(0, Math.min(100, Math.round((this.count / this.maxCount) * 100)));
    const idx = this.frameIndexFromValue(pct);
    this.img = this.imageCache[this.frames[idx]];
  }

  /**
   * Pick frame index for current coin progress/value.
   * @returns {number} Frame array index.
   */
  pickFrame() {
    const pct = Math.max(0, Math.min(100, Math.round((this.count / this.maxCount) * 100)));
    return this.frameIndexFromValue(pct);
  }
}
