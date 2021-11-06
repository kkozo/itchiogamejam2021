import Darkness from '../map/darkness';
import Lightsource from '../map/lightsource';
import GameMap from '../map/map';
import {HOUSE_LEVEL} from '../data/levels';
import ContextMenu from '../menu/contextMenu';

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
    this.load.image('menuArrow', 'assets/menu/arrow.png');
    this.load.audio('click', 'assets/sounds/retro_ui_menu_blip_click_02.wav');
  }

  public create(): void {
    this.gameMap.createMap();
    const map = this.gameMap.getMap();
    const camera1 = this.cameras.main;
    const contextMenu = new ContextMenu(this, this.gameMap);
    this.input.mouse.disableContextMenu();

    const darkness = new Darkness(this, this.gameMap);
    const lightSource = new Lightsource(this, this.gameMap);
  }


  public update(): void {

  }
}
