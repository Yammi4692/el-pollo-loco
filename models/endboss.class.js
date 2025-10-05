/**
 * Boss enemy ("BossChicken") that patrols, pressures the player when near,
 * performs dash attacks, and triggers the win screen on death.
 * Tuned for 5 bottle hits to kill (20 dmg each).
 * @file
 */

/**
 * Boss enemy with aggressive movement and attack windows.
 * @extends MovableObject
 * @class
 */
class BossChicken extends MovableObject {
  /** Total HP; 20 dmg per hit => 5 hits. @type {number} */
  MAX_ENERGY = 100;

  /** Base horizontal speed. @type {number} */
  BASE_SPEED = 15;

  /** Distance to start aggro/attacks. @type {number} */
  AGGRO_RANGE = 820;

  /** Attack window (ms). @type {number} */
  ATTACK_WINDOW_MS = 1200;

  /** Attack cooldown (ms). @type {number} */
  ATTACK_COOLDOWN_MS = 800;

  /** Walk advance multiplier. @type {number} */
  WALK_ADVANCE = 1.25;

  /** Attack sprint multiplier. @type {number} */
  ATTACK_SPRINT = 1.8;

  /** Enrage threshold HP. @type {number} */
  ENRAGE_AT = 40;

  /** Enraged cooldown (ms). @type {number} */
  ENRAGE_COOLDOWN_MS = 600;

  /** Enraged walk advance multiplier. @type {number} */
  ENRAGE_WALK_ADVANCE = 1.45;

  /** Enraged sprint multiplier. @type {number} */
  ENRAGE_SPRINT = 2.0;

  /** Probability to chain a second attack when enraged. @type {number} */
  ENRAGE_CHAIN_PROB = 0.35;

  /** Delay before chained attack (ms). @type {number} */
  ENRAGE_CHAIN_DELAY_MS = 220;

  /** Render height. @type {number} */
  height = 400;

  /** Render width. @type {number} */
  width = 250;

  /** World Y position. @type {number} */
  y = 55;

  /** Current HP. @type {number} */
  energy = this.MAX_ENERGY;

  /** Base speed used by movement helpers. @type {number} */
  speed = this.BASE_SPEED;

  /** Death flag. @type {boolean} */
  dead = false;

  /** Currently inside an attack window. @type {boolean} */
  attacking = false;

  /** Timestamp of last attack start (ms). @type {number} */
  lastAttackAt = 0;

  /** Walk frames. @type {string[]} */
  framesWalk = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png'
  ];

  /** Attack frames. @type {string[]} */
  framesAttack = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png'
  ];

  /** Hurt frames. @type {string[]} */
  framesHurt = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img/4_enemie_boss_chicken/4_hurt/G23.png'
  ];

  /** Death frames. @type {string[]} */
  framesDead = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png'
  ];

  /**
   * Construct the boss, preload frames, set position and hitbox.
   * @returns {void}
   */
  constructor() {
    super().loadImage('img/4_enemie_boss_chicken/2_alert/G5.png');
    this.loadImages(this.framesWalk);
    this.loadImages(this.framesAttack);
    this.loadImages(this.framesHurt);
    this.loadImages(this.framesDead);
    this.x = 2500;
    this.offset = { x: 10, y: 70, width: 15, height: 90 };
  }

  /**
   * Start AI + animation loop.
   * @returns {void}
   */
  startAnim() {
    setInterval(() => {
      if (this.dead) return;
      this.updateAnim();
      this.maybeAttack();
    }, 120);
  }

  /**
   * Check if character is inside aggro radius.
   * @returns {boolean} True if player is near.
   */
  charNear() {
    const c = this.world?.character;
    if (!c) return false;
    return Math.abs(c.x - this.x) < this.AGGRO_RANGE;
  }

  /**
   * Attempt to start an attack considering cooldown and enrage.
   * @returns {void}
   */
  maybeAttack() {
    if (this.attacking || !this.charNear()) return;
    const now = Date.now();
    const enraged = this.energy <= this.ENRAGE_AT;
    const cd = enraged ? this.ENRAGE_COOLDOWN_MS : this.ATTACK_COOLDOWN_MS;
    if (now - this.lastAttackAt >= cd) this.attack(enraged);
  }

  /**
   * Enter an attack window, play SFX, dash, then schedule end/chain.
   * @param {boolean} [enraged=false] - Use enraged sprint values.
   * @returns {void}
   */
  attack(enraged = false) {
    this.attacking = true;
    this.lastAttackAt = Date.now();
    window.audioManager?.play?.('endbossAttack');
    const mult = enraged ? this.ENRAGE_SPRINT : this.ATTACK_SPRINT;
    this.moveToChar(this.speed * mult);
    this.scheduleAttackEnd(enraged);
  }

  /**
   * End attack after window and optionally chain a second one.
   * @param {boolean} enraged - Whether boss is enraged.
   * @returns {void}
   */
  scheduleAttackEnd(enraged) {
    setTimeout(() => {
      this.attacking = false;
      if (this.canChain(enraged)) {
        setTimeout(() => {
          if (!this.dead && !this.attacking && this.charNear()) this.attack(true);
        }, this.ENRAGE_CHAIN_DELAY_MS);
      }
    }, this.ATTACK_WINDOW_MS);
  }

  /**
   * Decide if a chained enraged attack should trigger.
   * @param {boolean} enraged - Whether boss is enraged.
   * @returns {boolean} True if a chain attack should happen.
   */
  canChain(enraged) {
    return enraged && Math.random() < this.ENRAGE_CHAIN_PROB && this.charNear() && !this.dead;
  }

  /**
   * Apply a hit (−20 HP). Kills boss at 0 or below.
   * @returns {void}
   */
  takeHit() {
    if (this.dead) return;
    this.energy -= 20;
    if (this.energy <= 0) this.kill();
    else this.lastHit = Date.now();
  }

  /**
   * Kill boss: play SFX and start death animation.
   * @returns {void}
   */
  kill() {
    this.energy = 0;
    this.dead = true;
    window.audioManager?.play?.('endbossDie');
    this.deathAnim();
  }

  /**
   * Iterate through death frames; then notify world to show win screen.
   * @returns {void}
   */
  deathAnim() {
    let frame = 0;
    const itv = setInterval(() => {
      if (frame < this.framesDead.length) {
        this.loadImage(this.framesDead[frame++]);
      } else {
        clearInterval(itv);
        this.winScreen();
      }
    }, 200);
  }

  /**
   * Trigger win screen shortly after death.
   * @returns {void}
   */
  winScreen() {
    if (this.world) setTimeout(() => this.world.showWonScreen(), 1000);
  }

  /**
   * Choose animation + movement (with enrage scaling).
   * @returns {void}
   */
  updateAnim() {
    const enraged = this.energy <= this.ENRAGE_AT;

    if (this.isHurt?.()) {
      this.playAnimation(this.framesHurt);
      return;
    }

    if (this.attacking) {
      this.playAnimation(this.framesAttack);
      this.moveToChar(this.speed * (enraged ? this.ENRAGE_SPRINT : this.ATTACK_SPRINT));
      return;
    }

    this.playAnimation(this.framesWalk);
    if (this.charNear()) {
      const push = this.speed * (enraged ? this.ENRAGE_WALK_ADVANCE : this.WALK_ADVANCE);
      this.moveToChar(push);
    }
  }

  /**
   * Move horizontally toward the character by a given step.
   * @param {number} [step=this.speed] - Horizontal step size.
   * @returns {void}
   */
  moveToChar(step = this.speed) {
    const c = this.world?.character;
    if (!c) return;
    if (c.x < this.x) {
      this.x -= step;
      this.otherDirection = false;
    } else {
      this.x += step;
      this.otherDirection = true;
    }
  }
}
