/**
 * Default level definition and legacy API expected by World/game.
 * @file
 */

/**
 * Global reference to the default level used by the World.
 * @type {Level}
 */
let level1;

/**
 * Build the default level (enemies, clouds, backgrounds, coins, bottles)
 * and assign it to the global `level1` variable. Called before creating
 * a new World(canvas, keyboard).
 * @returns {void}
 */
function initLevel() {
  level1 = new Level(
    /** @type {(NormalChicken|SmallChicken|BossChicken)[]} */ ([
      new NormalChicken(),
      new NormalChicken(),
      new NormalChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new BossChicken()
    ]),

    /** @type {Cloud[]} */ ([
      new Cloud()
    ]),

    /** @type {BackgroundObject[]} */ ([
      new BackgroundObject('img/5_background/layers/air.png', -719),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

      new BackgroundObject('img/5_background/layers/air.png', 0),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

      new BackgroundObject('img/5_background/layers/air.png', 719),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

      new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),

      new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3)
    ]),

    /** @type {Coin[]} */ ([
      new Coin('img/8_coin/coin_1.png'),
      new Coin('img/8_coin/coin_1.png'),
      new Coin('img/8_coin/coin_1.png'),
      new Coin('img/8_coin/coin_1.png'),
      new Coin('img/8_coin/coin_1.png')
    ]),

    /** @type {Bottle[]} */ ([
      new Bottle('img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
      new Bottle('img/6_salsa_bottle/2_salsa_bottle_on_ground.png'),
      new Bottle('img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
      new Bottle('img/6_salsa_bottle/2_salsa_bottle_on_ground.png'),
      new Bottle('img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
      new Bottle('img/6_salsa_bottle/2_salsa_bottle_on_ground.png'),
      new Bottle('img/6_salsa_bottle/1_salsa_bottle_on_ground.png'),
      new Bottle('img/6_salsa_bottle/2_salsa_bottle_on_ground.png'),
      new Bottle('img/6_salsa_bottle/1_salsa_bottle_on_ground.png')
    ])
  );
}

/**
 * Compatibility alias: forward older calls to initLevel().
 * @returns {void}
 */
function loadStage() {
  initLevel();
}
