import Darkness from '../map/darkness';
import Lightsource from '../map/lightsource';
import GameMap from '../map/map';
import {HOUSE_LEVEL} from '../data/levels';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {

  public gameMap: GameMap;

  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    this.gameMap = new GameMap(this, HOUSE_LEVEL);
    this.gameMap.loadAssets();
  }

  public create(): void {
    const map = this.gameMap.createMap();
    const camera1 = this.cameras.main;

    this.input.mouse.disableContextMenu();

    this.input.on('pointerup', pointer => {

      if (pointer.leftButtonReleased()) {
        if (camera1.scrollY === 0) {
          camera1.once('camerafadeoutcomplete', camera => {
            camera.fadeIn(500);
          });
          camera1.fadeOut(500);
          setTimeout(() => camera1.setBounds(0, 672, 800, 600), 500);
        } else {
          camera1.once('camerafadeoutcomplete', camera => {
            camera.fadeIn(500);
          });
          camera1.fadeOut(500);
          setTimeout(() => camera1.setBounds(0, 0, 800, 600), 500);
        }
      }

    });
    const darkness = new Darkness(this, map);
    const lightSource = new Lightsource(this, map);
  }


  public update(): void {

  }
}
