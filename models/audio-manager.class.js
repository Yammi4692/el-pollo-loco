/**
 * Centralized audio controller for SFX and music.
 * Keeps a registry of HTMLAudioElements and provides play/stop/mute/loop helpers.
 * @file
 */

/**
 * Audio manager singleton controlling all game sounds.
 * @class
 */
class AudioManager {
  /**
   * Create audio elements, set preload and initial volumes.
   */
  constructor() {
    /** @type {Record<string, HTMLAudioElement>} */
    this.sounds = {
      background: new Audio('audio/audio_start_screen.mp3'),
      walking: new Audio('audio/character_walk_on_sand.mp3'),
      jumping: new Audio('audio/character_jumping.mp3'),
      hurt: new Audio('audio/pepe_hurting.mp3'),
      characterDead: new Audio('audio/pepe_dying.mp3'),
      chickenDie: new Audio('audio/dying_chicken.mp3'),
      throwBottle: new Audio('audio/get_bottle.mp3'),
      bottleSplash: new Audio('audio/bottle_splash.mp3'),
      gameOver: new Audio('audio/game_over.mp3'),
      gameWin: new Audio('audio/game_won.mp3'),
      endbossAttack: new Audio('audio/endboss_angry.mp3'),
      endbossDie: new Audio('audio/endboss_dying.mp3'),
      snore: new Audio('audio/pepe_snoring.mp3')
    };

    Object.values(this.sounds).forEach((a) => {
      a.preload = 'auto';
    });

    this.setVolumes({
      background: 0.05,
      walking: 1.0,
      jumping: 0.5,
      hurt: 0.5,
      characterDead: 0.4,
      chickenDie: 0.4,
      throwBottle: 0.2,
      bottleSplash: 0.5,
      gameOver: 0.5,
      gameWin: 0.5,
      endbossAttack: 1.0,
      endbossDie: 1.0,
      snore: 1.0
    });

    /** @type {boolean} */
    this.isMuted = false;
  }

  /**
   * Set volumes for multiple named sounds. Values are clamped to [0, 1].
   * @param {Record<string, number>} volumeMap - Map of soundName → volume.
   * @returns {void}
   */
  setVolumes(volumeMap) {
    Object.entries(volumeMap).forEach(([name, vol]) => {
      const a = this.sounds[name];
      if (!a) return;
      const v = Math.max(0, Math.min(1, Number(vol)));
      a.volume = v;
    });
  }

  /**
   * Get a sound element by name.
   * @param {string} soundName - Registered sound key.
   * @returns {HTMLAudioElement|undefined} Audio element if found.
   */
  getSound(soundName) {
    return this.sounds?.[soundName];
  }

  /**
   * Mute/unmute all sounds at once. When unmuting, resume looped sounds.
   * @param {boolean} muted - Desired mute state.
   * @returns {void}
   */
  setMute(muted) {
    this.isMuted = Boolean(muted);

    Object.values(this.sounds).forEach((a) => {
      a.muted = this.isMuted;
    });

    if (!this.isMuted) {
      Object.values(this.sounds).forEach((a) => {
        if (a.loop && a.paused) {
          const p = a.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        }
      });
    }
  }

  /**
   * Play a sound once if available and not muted.
   * @param {string} soundName - Registered sound key.
   * @returns {void}
   */
  play(soundName) {
    const a = this.getSound(soundName);
    if (!a || this.isMuted) return;
    const p = a.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }

  /**
   * Stop a sound and reset its playback position.
   * @param {string} soundName - Registered sound key.
   * @returns {void}
   */
  stop(soundName) {
    const a = this.getSound(soundName);
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  }

  /**
   * Stop all registered sounds and reset their positions.
   * @returns {void}
   */
  stopAll() {
    Object.values(this.sounds).forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
  }

  /**
   * Start or continue looping a sound by name.
   * Does nothing if muted; does not restart an already playing loop.
   * @param {string} soundName - Registered sound key.
   * @returns {void}
   */
  playLoop(soundName) {
    const a = this.getSound(soundName);
    if (!a) return;
    a.loop = true;
    if (this.isMuted) return;
    if (a.paused) {
      const p = a.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
  }

  /**
   * Check global mute considering external `muted` flag if present.
   * @returns {boolean} True if globally muted.
   */
  isMutedGlobally() {
    return this.isMuted || (typeof muted !== 'undefined' && muted);
  }

  /**
   * Convenience alias for play().
   * @param {string} soundName - Registered sound key.
   * @returns {void}
   */
  startSound(soundName) { this.play(soundName); }

  /**
   * Convenience alias for stop().
   * @param {string} soundName - Registered sound key.
   * @returns {void}
   */
  haltSound(soundName) { this.stop(soundName); }

  /**
   * Convenience alias for stopAll().
   * @returns {void}
   */
  haltAll() { this.stopAll(); }

  /**
   * Convenience alias for playLoop().
   * @param {string} soundName - Registered sound key.
   * @returns {void}
   */
  loopSound(soundName) { this.playLoop(soundName); }

  /**
   * Toggle mute state and return the new state.
   * @returns {boolean} New mute state.
   */
  switchMute() {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Force a specific mute state.
   * @param {boolean} shouldBeMuted - Desired mute state.
   * @returns {void}
   */
  forceMute(shouldBeMuted) {
    this.setMute(Boolean(shouldBeMuted));
  }
}

/**
 * Global singleton instance.
 * @type {AudioManager}
 */
window.audioManager = new AudioManager();
