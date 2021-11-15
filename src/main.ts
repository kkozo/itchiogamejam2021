import * as Phaser from 'phaser';
import {GameScene} from './scenes/game';
import NinePatchPlugin from 'phaser3-rex-plugins/plugins/ninepatch-plugin.js';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'BUG',

  type: Phaser.WEBGL,

  scale: {
    width: 1024,
    height: 768,
  },

  scene: [GameScene],

  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  plugins: {
    global: [{
      key: 'rexNinePatchPlugin',
      plugin: NinePatchPlugin,
      start: true
    }]
  },
  pixelArt: true,
  parent: 'game',
  backgroundColor: '#000000',

};

export const game = new Phaser.Game(gameConfig);

window.addEventListener('resize', () => {
  game.scale.refresh();
});
