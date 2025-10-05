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
    MobileControls.addButton('button-left', keyboard, 'A');
    MobileControls.addButton('button-right', keyboard, 'D');
    MobileControls.addButton('button-jump', keyboard, 'SPACE');
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
    button.addEventListener('mousedown', () => MobileControls.setKey(keyboard, keyName, true));
    button.addEventListener('mouseup', () => MobileControls.setKey(keyboard, keyName, false));
    button.addEventListener('mouseleave', () => MobileControls.setKey(keyboard, keyName, false));
  }

  /**
   * Bind touch events.
   * @param {HTMLElement} button
   * @param {Keyboard} keyboard
   * @param {string} keyName
   * @returns {void}
   */
  static bindTouch(button, keyboard, keyName) {
    button.addEventListener('touchstart', (event) => {
      event.preventDefault(); MobileControls.setKey(keyboard, keyName, true);
    }, { passive: false });
    button.addEventListener('touchend', (event) => {
      event.preventDefault(); MobileControls.setKey(keyboard, keyName, false);
    }, { passive: false });
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
}

window.MobileControls = MobileControls;
