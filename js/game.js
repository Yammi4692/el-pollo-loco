/**
 * Main game bootstrap and UI binding.
 * @file
 */

let canvas;
let gameWorld;
let controls = new Keyboard();
let timers = [];
let muted = false;
let fullscreen;

/**
 * Load persisted mute setting from localStorage and apply it.
 * @returns {void}
 */
function loadPersistedMute() {
  const saved = localStorage.getItem('elPolloMute');
  if (saved !== null) muted = saved === 'true';
  window.audioManager?.forceMute(muted);
}

/**
 * Initialize the game and bind UI elements.
 * @returns {void}
 */
function setupGame() {
  loadPersistedMute();
  canvas = document.getElementById('canvas');

  window.StartScreenUI?.init();
  window.MobileControls?.init(controls);
  bindMuteButton();

  if (window.FullscreenManager) {
    const container = document.getElementById('game-container') || document.querySelector('.canvas-wrap');
    if (container && !container.id) container.id = 'game-container';
    fullscreen = new FullscreenManager({ containerId: 'game-container', buttonId: 'fullscreen' });
    fullscreen.init();
  }

  refreshMuteIcon();
}

/**
 * Start flow used by the start button (called by StartScreenUI).
 * @param {boolean} hideAll - If true, hide all overlays first.
 * @returns {void}
 */
function startGameFlow(hideAll = false) {
  window.audioManager?.forceMute(muted);
  window.audioManager?.playLoop('background');
  if (hideAll) hideAllScreens();
  document.body.classList.add('game-running');
  initLevel();
  gameWorld = new World(canvas, controls);
  gameWorld.toggleSound?.(muted);
}

/**
 * Restart session and return to start screen.
 * @returns {void}
 */
function restartGame() {
  stopAllIntervals();
  hideEndScreens();
  resetWorld();
  wipeCanvas();
  initLevel();
  startGameFlow(true); 
}

/**
 * Hide all overlay screens (start, over, won).
 * @returns {void}
 */
function hideAllScreens() {
  ['start-screen', 'game-over', 'game-won'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add('d-none');
  });
}

/**
 * Show start UI again after restart.
 * @returns {void}
 */
function displayStartUI() {
  const start = document.getElementById('start-screen');
  if (start) start.classList.remove('d-none');
  const cc = document.querySelector('.controls-container');
  if (cc) cc.style.display = 'flex';
  const sb = document.getElementById('start-button');
  if (sb) sb.style.display = 'block';
  const ib = document.getElementById('impressum-btn');
  if (ib) ib.style.display = 'block';
}

/**
 * Display "Game Over" overlay.
 * @returns {void}
 */
function displayGameOver() {
  const el = document.getElementById('game-over');
  if (el) el.classList.remove('d-none');
}

/**
 * Display "Game Won" overlay.
 * @returns {void}
 */
function displayGameWon() {
  const el = document.getElementById('game-won');
  if (el) el.classList.remove('d-none');
}

/**
 * Reset world and stop audio/loops.
 * @returns {void}
 */
function resetWorld() {
  if (!gameWorld) return;
  window.audioManager?.haltAll?.();
  if (typeof gameWorld.stopGame === 'function') gameWorld.stopGame();
  if (typeof gameWorld.reset === 'function') gameWorld.reset();
  gameWorld = null;
}

/**
 * Clear canvas fully.
 * @returns {void}
 */
function wipeCanvas() {
  const c = document.getElementById('canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
}

/**
 * Hide both end screens.
 * @returns {void}
 */
function hideEndScreens() {
  const over = document.getElementById('game-over');
  const won = document.getElementById('game-won');
  if (over) over.classList.add('d-none');
  if (won) won.classList.add('d-none');
}

/**
 * Stop all active intervals on the page.
 * @returns {void}
 */
function stopAllIntervals() {
  const highestId = window.setInterval(() => {}, 0);
  for (let i = 0; i <= highestId; i++) window.clearInterval(i);
}

/**
 * Create tracked interval and save its ID.
 * @param {Function} fn - Function to run.
 * @param {number} time - Interval in ms.
 * @returns {number} Interval ID.
 */
function createTrackedInterval(fn, time) {
  const id = setInterval(fn, time);
  timers.push(id);
  return id;
}

/**
 * Bind mute button handler.
 * @returns {void}
 */
function bindMuteButton() {
  const el = document.getElementById('mute');
  if (!el) return;
  el.onclick = null;
  el.addEventListener('click', switchMute);
}

/**
 * Toggle mute, persist, and sync AudioManager.
 * @returns {void}
 */
function switchMute() {
  muted = !muted;
  localStorage.setItem('elPolloMute', String(muted));
  refreshMuteIcon();

  if (window.audioManager) {
    window.audioManager.forceMute(muted);
    if (!muted && !window.gameWorld && window.audioManager.playLoop) {
      window.audioManager.playLoop('background');
    }
  }

  gameWorld?.toggleSound?.(muted);
  document.getElementById('mute')?.blur();
}

/**
 * Update mute icon to match state.
 * @returns {void}
 */
function refreshMuteIcon() {
  const el = document.getElementById('mute');
  if (!el) return;
  const useEl = el.querySelector && el.querySelector('use');
  if (useEl) { useEl.setAttribute('href', muted ? '#icon-volume-off' : '#icon-volume-on'); return; }
  if (el.tagName === 'IMG') {
    el.src = muted ? 'img/7_statusbars/3_icons/mute.png' : 'img/7_statusbars/3_icons/unmute.png';
  }
}

/**
 * Bootstrap minimal UI on DOM ready.
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {
  loadPersistedMute();
  bindMuteButton();
  refreshMuteIcon();
});

/**
 * Bridge for World.showLostScreen().
 * @returns {void}
 */
function showGameOver() { displayGameOver(); }

/**
 * Bridge for World.showWonScreen().
 * @returns {void}
 */
function showGameWon() { displayGameWon(); }

/**
 * Keyboard input handling.
 * @event keydown
 */
window.addEventListener('keydown', (event) => {
  if (event.keyCode === 65 || event.keyCode === 37) { controls.A = true; controls.LEFT = true; }
  if (event.keyCode === 68 || event.keyCode === 39) { controls.D = true; controls.RIGHT = true; }
  if (event.keyCode === 32) { event.preventDefault(); controls.SPACE = true; }
  if (event.keyCode === 70) controls.F = true;
  window.audioManager?.stop('snore');
});

/**
 * Keyboard input release handling.
 * @event keyup
 */
window.addEventListener('keyup', (event) => {
  if (event.keyCode === 65 || event.keyCode === 37) { controls.A = false; controls.LEFT = false; }
  if (event.keyCode === 68 || event.keyCode === 39) { controls.D = false; controls.RIGHT = false; }
  if (event.keyCode === 32) controls.SPACE = false;
  if (event.keyCode === 70) controls.F = false;
  if (!controls.A && !controls.D && window.audioManager?.stop) window.audioManager.stop('walking');
});


window.startGameFlow = startGameFlow;
