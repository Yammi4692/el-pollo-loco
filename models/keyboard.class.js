/**
 * Keyboard input controller.
 * Tracks pressed keys and provides LEFT/RIGHT aliases.
 * @file
 */

/**
 * Handles keyboard and mapped touch input states.
 * Provides A/D as well as LEFT/RIGHT flags for compatibility.
 * @class
 */
class Keyboard {
  /** Whether the A key (or left button) is held. */
  A = false;

  /** Whether the D key (or right button) is held. */
  D = false;

  /** Whether the SPACE key (jump) is held. */
  SPACE = false;

  /** Whether the F key (throw) is held. */
  F = false;

  /**
   * Get "LEFT" state (alias for A).
   * @returns {boolean} True if left movement is active.
   */
  get LEFT() {
    return this.A;
  }

  /**
   * Set "LEFT" state (also sets A).
   * @param {boolean} v - New state for left movement.
   * @returns {void}
   */
  set LEFT(v) {
    this.A = v;
  }

  /**
   * Get "RIGHT" state (alias for D).
   * @returns {boolean} True if right movement is active.
   */
  get RIGHT() {
    return this.D;
  }

  /**
   * Set "RIGHT" state (also sets D).
   * @param {boolean} v - New state for right movement.
   * @returns {void}
   */
  set RIGHT(v) {
    this.D = v;
  }
}
