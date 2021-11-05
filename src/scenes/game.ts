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
    // this.load.image('interiors_kitchen', 'assets/tiles/kitchen_32x32.png');
    // this.load.image('interiors_generic', 'assets/tiles/generic_32x32.png');
    // this.load.image('interiors_bathroom', 'assets/tiles/bathroom_32x32.png');
    // this.load.image('interiors_bedroom', 'assets/tiles/bedroom_32x32.png');
    // this.load.image('interiors_living_room', 'assets/tiles/living_room_32x32.png');
    // this.load.image('interiors_room_builder', 'assets/tiles/room_builder_32x32.png');
    // this.load.image('interiors_visible_upstairs', 'assets/tiles/visible_upstairs_32x32.png');
    // this.load.image('interiors_basement', 'assets/tiles/basement_32x32.png');
    // this.load.image('interiors_condo', 'assets/tiles/condo_32x32.png');
    // this.load.tilemapTiledJSON('House01', 'assets/map//House01/House01.json');
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
