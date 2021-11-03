import * as Phaser from 'phaser';
import {GameScene} from './scenes/game';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'BUG',

  type: Phaser.WEBGL,

  scale: {
    width: 800,
    height: 600,
  },

  scene: [GameScene],

  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },

  parent: 'game',
  backgroundColor: '#000000',

};

export const game = new Phaser.Game(gameConfig);

window.addEventListener('resize', () => {
  game.scale.refresh();
});
