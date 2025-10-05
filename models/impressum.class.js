/**
 * Impressum overlay controller (open/close behavior).
 * @file
 */

/**
 * Handles the Impressum overlay open/close behavior.
 * @class
 */
class ImpressumManager {
  /**
   * Wire up all handlers (idempotent).
   * @returns {void}
   */
  static init() {
    const btn = document.getElementById('impressum-btn');
    const overlay = document.getElementById('impressum');
    const closeBtn = document.getElementById('impressum-close');
    if (!btn || !overlay || !closeBtn) return;

    if (btn._impBound) return;
    btn._impBound = true;

    btn.addEventListener('click', () => {
      overlay.classList.remove('d-none');
      overlay.setAttribute('aria-hidden', 'false');
    });

    closeBtn.addEventListener('click', () => ImpressumManager.close(overlay));

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) ImpressumManager.close(overlay);
    });
  }

  /**
   * Close overlay and update accessibility attributes.
   * @param {HTMLElement} overlay - The Impressum overlay element.
   * @returns {void}
   */
  static close(overlay) {
    overlay.classList.add('d-none');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ImpressumManager.init());
} else {
  ImpressumManager.init();
}
