/**
 * Start screen user interface.
 * Manages start button, instructions modal, and orientation handling.
 * @file
 */

/**
 * Start screen UI controller.
 * Handles initialization, modal logic, and responsive orientation behavior.
 * @class
 */
class StartScreenUI {
  /**
   * Initialize start screen bindings and show UI.
   * @returns {void}
   */
  static init() {
    this.#wireStartButton();
    this.#wireInstructions();
    this.#verifyOrientation();
    window.addEventListener('resize', () => this.#verifyOrientation());
    window.addEventListener('orientationchange', () => this.#verifyOrientation());
    this.show();
  }

  /**
   * Show start screen elements and Impressum button.
   * @returns {void}
   */
  static show() {
    const ss = document.getElementById('start-screen');
    const hint = document.querySelector('.controls-container');
    const btn = document.getElementById('start-button');
    const imp = document.getElementById('impressum-btn');
    if (ss) ss.style.display = 'flex';
    if (hint) hint.style.display = 'flex';
    if (btn) btn.style.display = 'block';
    if (imp) imp.style.display = 'block';
  }

  /**
   * Open the "How to Play" modal.
   * @returns {void}
   */
  static openInstructions() {
    const m = document.getElementById('modal-instructions');
    if (!m) return;
    m.classList.remove('d-none');
    m.setAttribute('aria-hidden', 'false');
  }

  /**
   * Close the "How to Play" modal.
   * @returns {void}
   */
  static closeInstructions() {
    const m = document.getElementById('modal-instructions');
    if (!m) return;
    m.classList.add('d-none');
    m.setAttribute('aria-hidden', 'true');
  }

  /**
   * Attach start button click handler.
   * Hides start UI and launches the game flow.
   * @private
   * @returns {void}
   */
  static #wireStartButton() {
    const ss = document.getElementById('start-screen');
    const sb = document.getElementById('start-button');
    if (!ss || !sb) return;

    sb.onclick = () => {
      ss.style.display = 'none';
      const hint = document.querySelector('.controls-container');
      if (hint) hint.style.display = 'none';
      document.getElementById('impressum-btn')?.style && (document.getElementById('impressum-btn').style.display = 'none');
      window.startGameFlow?.(false);
    };

    // Fallback: if start button is rebound externally
    if (!sb.onclick) sb.addEventListener('click', () => window.startGameFlow?.(true));
  }

  /**
   * Bind instructions modal open/close events.
   * Supports click, escape key, and outside-click closing.
   * @private
   * @returns {void}
   */
  static #wireInstructions() {
    const btn = document.getElementById('btn-instructions');
    const modal = document.getElementById('modal-instructions');
    const closeBtn = document.getElementById('modal-instructions-close');
    if (!btn || !modal || !closeBtn) return;

    btn.addEventListener('click', () => StartScreenUI.openInstructions());
    closeBtn.addEventListener('click', () => StartScreenUI.closeInstructions());
    modal.addEventListener('click', (e) => {
      if (e.target && e.target.getAttribute('data-close') === 'true') StartScreenUI.closeInstructions();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('d-none')) StartScreenUI.closeInstructions();
    });
  }

  /**
   * Verify screen orientation and enable/disable start button.
   * Blocks start in portrait on narrow devices.
   * @private
   * @returns {void}
   */
  static #verifyOrientation() {
    const hint = document.getElementById('orientation-hint');
    const startBtn = document.getElementById('start-button');
    if (!hint || !startBtn) return;
    const portrait = window.innerHeight > window.innerWidth;
    const narrow = window.innerWidth < 600;
    const block = portrait && narrow;
    hint.style.display = block ? 'flex' : 'none';
    startBtn.disabled = !!block;
  }
}

window.StartScreenUI = StartScreenUI;
