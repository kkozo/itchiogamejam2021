import Darkness from '../map/darkness';
import Lightsource from '../map/lightsource';
import GameMap from '../map/map';
import {HOUSE_LEVEL} from '../data/levels';
import ContextMenu from '../menu/contextMenu';
import Character, {myCharacter} from '../character/character';
import * as AnimationDefaults from '../data/constants';

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
    this.load.spritesheet('character1', 'assets/character/Premade_Character_32x32_12.png', {frameWidth: 32, frameHeight: 64});
    this.load.spritesheet('uiIcons', 'assets/character/UI_32x32.png', {frameWidth: 32, frameHeight: 64});
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
    const character = new Character(this, 12, 12, this.gameMap, myCharacter);
    character.walkPath({
      nodes: [
        {x: 12, y: 15},
        {x: 15, y: 15},
        {x: 15, y: 9},
        {x: 11, y: 9, endAnimation: AnimationDefaults.ANIMATION_IDLE_UP},
        {x: 8, y: 9, pause: 10000}, {x: 8, y: 2}]
    });


    this.anims.create({
      key: 'talking',
      frames: this.anims.generateFrameNumbers('uiIcons', {
        start: 108,
        end: 115
      }),
      frameRate: 8,
      repeat: -1
    });
    character.talk('blabla', 5000);
  }


  public update(): void {

  }
}
