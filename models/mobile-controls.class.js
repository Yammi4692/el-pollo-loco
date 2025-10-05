/**
 * Mobile controls → Keyboard mapper.
 * Connects on-screen buttons with the Keyboard object.
 * @file
 */

/**
 * Simple touch/mouse bindings for mobile buttons.
 * @class
 */
class MobileControls {
  /**
   * Initialize all mobile buttons.
   * @param {Keyboard} keyboard - The active keyboard object.
   * @returns {void}
   */
  static init(keyboard) {
    if (!keyboard) return;
    MobileControls.addButton('button-left',  keyboard, 'A');
    MobileControls.addButton('button-right', keyboard, 'D');
    MobileControls.addButton('button-jump',  keyboard, 'SPACE');
    MobileControls.addButton('button-throw', keyboard, 'F');
  }

  /**
   * Bind one button to a keyboard flag.
   * @param {string} elementId
   * @param {Keyboard} keyboard
   * @param {'A'|'D'|'SPACE'|'F'} keyName
   * @returns {void}
   */
  static addButton(elementId, keyboard, keyName) {
    const button = document.getElementById(elementId);
    if (!button) return;
    MobileControls.bindMouse(button, keyboard, keyName);
    MobileControls.bindTouch(button, keyboard, keyName);
  }

  /**
   * Bind mouse events.
   * @param {HTMLElement} button
   * @param {Keyboard} keyboard
   * @param {string} keyName
   * @returns {void}
   */
  static bindMouse(button, keyboard, keyName) {
    button.addEventListener('mousedown', () => {
      MobileControls.setKey(keyboard, keyName, true);
      window.audioManager?.stop('snore');
    });
    const up = () => { MobileControls.setKey(keyboard, keyName, false); MobileControls.stopWalkIfIdle(keyboard); };
    button.addEventListener('mouseup', up);
    button.addEventListener('mouseleave', up);
  }

  /**
   * Bind touch events.
   * @param {HTMLElement} button
   * @param {Keyboard} keyboard
   * @param {string} keyName
   * @returns {void}
   */
  static bindTouch(button, keyboard, keyName) {
    button.addEventListener('touchstart', (e) => {
      e.preventDefault();
      MobileControls.setKey(keyboard, keyName, true);
      window.audioManager?.stop('snore');
    }, { passive: false });
    const up = (e) => { e.preventDefault(); MobileControls.setKey(keyboard, keyName, false); MobileControls.stopWalkIfIdle(keyboard); };
    button.addEventListener('touchend', up, { passive: false });
    button.addEventListener('touchcancel', up, { passive: false });
  }

  /**
   * Set keyboard flag and LEFT/RIGHT aliases.
   * @param {Keyboard} keyboard
   * @param {string} keyName
   * @param {boolean} value
   * @returns {void}
   */
  static setKey(keyboard, keyName, value) {
    if (keyboard.blocked) return;
    keyboard[keyName] = value;
    if (keyName === 'A') keyboard.LEFT = value;
    if (keyName === 'D') keyboard.RIGHT = value;
  }

  /**
   * Stop walking SFX if neither A nor D are pressed.
   * @param {Keyboard} keyboard
   * @returns {void}
   */
  static stopWalkIfIdle(keyboard) {
    if (!keyboard.A && !keyboard.D) window.audioManager?.stop('walking');
  }
}

window.MobileControls = MobileControls;
