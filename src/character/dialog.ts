import GameMap from '../map/map';
import Character, {CharacterData} from './character';
import NinePatch from 'phaser3-rex-plugins/plugins/gameobjects/rendertexture/ninepatch/NinePatch';
import {ANIMATION_IDLE_DOWN} from '../data/constants';


const TEXT_SPEED = 75; // lower is faster
const DIALOG_WIDTH = 600;
const DIALOG_HEIGHT = 200;
const TEXT_PADDING = 20;
const TEXT_SIZE = 32;

export default class Dialog extends NinePatch {
  private currentDelta = 0;
  private creepingText: string;
  private currentText: string;
  private textPieces: string[];
  private textGameObject: Phaser.GameObjects.Text;
  private characterSprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, private text: string, private character: Character) {
    super(scene, x, y, DIALOG_WIDTH, DIALOG_HEIGHT, 'dialogNinePatch', [25, undefined, 10], [10, undefined, 10], {
      stretchMode: {
        edge: 'repeat',
        internal: 'scale'
      }
    });
    this.scene.add.existing(this);
    this.creepingText = '';
    this.currentText = '';

    this.textPieces = text.split('|');

    this.scene.events.on('update', (time, delta) => {
      this.update(time, delta);
    });
    this.moveNextTextPiece();
    this.characterSprite = this.scene.add.sprite(x - DIALOG_WIDTH / 2 + this.character.width / 4, y + DIALOG_HEIGHT / 2 + TEXT_PADDING, character.characterData.spriteSheetName);
    this.characterSprite.play(ANIMATION_IDLE_DOWN);
    this.textGameObject = this.scene.add.text(TEXT_PADDING + x - DIALOG_WIDTH / 2, y - DIALOG_HEIGHT / 2 + TEXT_PADDING, 'shit', {font: 'atari'});
    this.textGameObject.setFontSize(TEXT_SIZE);
    this.textGameObject.setTint(0x000000);

    this.setInteractive();
    this.on('pointerdown', (pointer) => {
        if (this.currentText.length === 0) {
          this.moveNextTextPiece();
        } else {
          this.creepingText = this.creepingText + this.currentText;
          this.currentText = this.currentText.slice(this.currentText.length, this.currentText.length);
        }
      }
    );
  }

  private moveNextTextPiece(): void {
    if (this.textPieces.length > 0) {
      this.currentText = this.textPieces[0];
      this.textPieces = this.textPieces.slice(1, this.textPieces.length);
      this.creepingText = '';
    } else {
      this.textGameObject.destroy();
      this.characterSprite.destroy();
      this.destroy();
    }
  }


  update(time: number, delta: number): void {
    this.currentDelta += delta;
    if (this.currentDelta > TEXT_SPEED) {
      this.currentDelta = 0;

      if (this.currentText.length > 0) {
        this.creepingText = this.creepingText + this.currentText[0];
        this.currentText = this.currentText.slice(1, this.currentText.length);
      }
    }
    this.textGameObject.setText(this.creepingText);
  }
}
