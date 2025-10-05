/**
 * Status bar that visualizes the player's available bottles.
 * @file
 */

/**
 * Bottle status bar sprite with discrete frames for 0–100%.
 * @extends DrawableObject
 * @class
 */
class BottleBar extends DrawableObject {
  /**
   * Ordered image frames from 0% to 100%.
   * @type {string[]}
   */
  frames = [
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
    'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
  ];

  /**
   * Current discrete level (0..maxLevel).
   * @type {number}
   */
  level = 0;

  /**
   * Maximum discrete level mapping to 100%.
   * @type {number}
   */
  maxLevel = 5;

  /**
   * Preload frames, position the bar, and set initial frame.
   * @returns {void}
   */
  constructor() {
    super();
    this.loadImages(this.frames);
    this.x = 490;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setLevel(0);
  }

  /**
   * Update level and displayed frame.
   * @param {number} value - New discrete level (clamped to [0, maxLevel]).
   * @returns {void}
   */
  setLevel(value) {
    this.level = Math.max(0, Math.min(this.maxLevel, value | 0));
    const idx = this.frameIndexFromValue(this.levelPercent());
    this.img = this.imageCache[this.frames[idx]];
  }

  /**
   * Compute percent value (0..100) from current level.
   * @returns {number} Percentage in range [0, 100].
   */
  levelPercent() {
    if (this.maxLevel <= 0) return 0;
    return Math.round((this.level / this.maxLevel) * 100);
  }

  /**
   * Pick the frame index based on the current percentage.
   * @returns {number} Frame array index.
   */
  pickFrame() {
    return this.frameIndexFromValue(this.levelPercent());
  }
}
