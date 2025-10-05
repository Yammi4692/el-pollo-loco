/**
 * Manage fullscreen behavior for the game container and UI icon.
 * Ensures overlays stay inside the fullscreen container.
 * @file
 */

/**
 * Fullscreen manager controlling container fullscreen and button sync.
 * @class
 */
class FullscreenManager {
  /**
   * Create a fullscreen manager.
   * @param {{ containerId?: string, buttonId?: string }} [opts] - Config options.
   * @param {string} [opts.containerId='game-container'] - ID of the container to toggle.
   * @param {string} [opts.buttonId='fullscreen'] - ID of the toggle button.
   */
  constructor(opts = {}) {
    this.containerId = opts.containerId || 'game-container';
    this.buttonId = opts.buttonId || 'fullscreen';
    this.container = null;
    this.button = null;
    this.boundOnChange = () => this.onChange();
  }

  /**
   * Initialize DOM references and event listeners.
   * @returns {void}
   */
  init() {
    this.container = document.getElementById(this.containerId);
    this.button = document.getElementById(this.buttonId);
    if (!this.container) return;
    this.ensureOverlaysInsideContainer();
    this.bindButton();
    this.bindFullscreenEvents();
    this.syncButtonIcon();
  }

  /**
   * Bind the click handler for toggling fullscreen.
   * @returns {void}
   */
  bindButton() {
    if (!this.button) return;
    this.button.addEventListener('click', () => this.toggle());
  }

  /**
   * Register browser fullscreen change events.
   * @returns {void}
   */
  bindFullscreenEvents() {
    document.addEventListener('fullscreenchange', this.boundOnChange);
    document.addEventListener('webkitfullscreenchange', this.boundOnChange);
  }

  /**
   * Toggle fullscreen for the configured container.
   * @returns {void}
   */
  toggle() {
    if (!this.container) return;
    if (!this.isFullscreen()) {
      if (this.container.requestFullscreen) this.container.requestFullscreen();
      else if (this.container.webkitRequestFullscreen) this.container.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
  }

  /**
   * Check whether fullscreen is currently active.
   * @returns {boolean} True if fullscreen is active.
   */
  isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  /**
   * Handle fullscreen change events by syncing the icon.
   * @returns {void}
   */
  onChange() {
    this.syncButtonIcon();
  }

  /**
   * Update the button icon according to the fullscreen state.
   * @returns {void}
   */
  syncButtonIcon() {
    if (!this.button) return;
    this.button.textContent = this.isFullscreen() ? '×' : '⛶';
  }

  /**
   * Move overlay elements inside the container to keep them visible.
   * @returns {void}
   */
  ensureOverlaysInsideContainer() {
    ['game-over', 'game-won', 'start-screen'].forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.parentElement !== this.container) {
        this.container.appendChild(el);
      }
    });
  }
}

window.FullscreenManager = FullscreenManager;
