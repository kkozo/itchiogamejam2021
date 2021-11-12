import GameMap from '../map/map';
import * as AnimationDefaults from '../data/constants';

export const myCharacter: CharacterData = {
  characterName: 'dodo',
  spriteSheetName: 'character1',
  width: 32,
  height: 64,
  animationData: [
    {animationKey: AnimationDefaults.ANIMATION_IDLE_RIGHT, frameRate: 5, frameStart: 56, frameEnd: 61, frames: null},
    {animationKey: AnimationDefaults.ANIMATION_IDLE_UP, frameRate: 5, frameStart: 62, frameEnd: 67},
    {animationKey: AnimationDefaults.ANIMATION_IDLE_LEFT, frameRate: 5, frameStart: 68, frameEnd: 73},
    {animationKey: AnimationDefaults.ANIMATION_IDLE_DOWN, frameRate: 5, frameStart: 74, frameEnd: 79},
    {animationKey: AnimationDefaults.ANIMATION_MOVE_RIGHT, frameRate: 5, frameStart: 112, frameEnd: 117, frames: null},
    {animationKey: AnimationDefaults.ANIMATION_MOVE_UP, frameRate: 5, frameStart: 118, frameEnd: 123},
    {animationKey: AnimationDefaults.ANIMATION_MOVE_LEFT, frameRate: 5, frameStart: 124, frameEnd: 129},
    {animationKey: AnimationDefaults.ANIMATION_MOVE_DOWN, frameRate: 5, frameStart: 130, frameEnd: 135}
  ]
};

export interface WalkingNode {
  x: number;
  y: number;
  pause?: number;
  endAnimation?: string;
}

export interface WalkingPath {
  nodes: WalkingNode[];
}

export interface CharacterData {
  characterName: string;
  spriteSheetName: string;
  width: number;
  height: number;
  animationData?: SimpleAnimationData[];
}

export interface SimpleAnimationData {
  animationKey: string;
  frames?: number[];
  frameStart?: number;
  frameEnd?: number;
  frameRate?: number;
  repeat?: number;
}

export default class Character extends Phaser.GameObjects.Sprite {
  private map?: Phaser.Tilemaps.Tilemap;

  private activePath: WalkingPath;
  private talkingSprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, private gameMap: GameMap, private characterData: CharacterData) {
    super(scene, gameMap.getMap().tileToWorldX(x), gameMap.getMap().tileToWorldY(y), characterData.spriteSheetName);
    super.setName('character');
    for (const anims of characterData.animationData) {
      const repeatOrDefault = anims.repeat !== undefined ? anims.repeat : -1;
      scene.anims.create({
        key: anims.animationKey,
        frames: this.scene.anims.generateFrameNumbers(this.characterData.spriteSheetName, {
          frames: anims.frames,
          start: anims.frameStart,
          end: anims.frameEnd
        }),

        frameRate: anims.frameRate,
        repeat: repeatOrDefault
      });
    }
    this.scene.add.existing(this);
    if (characterData.animationData !== undefined) {
      this.play(AnimationDefaults.ANIMATION_IDLE_DOWN);
    }
    this.scene.events.on('update', (time, delta) => {
      this.update(time, delta);
    });
  }

  update(time: number, delta: number): void {
    if (this.talkingSprite) {
      this.talkingSprite.x = this.x;
      this.talkingSprite.y = this.y - this.height / 2;
    }
  }

  public moveToTile(walkingPath: WalkingNode): void {
    const newX = walkingPath.x;
    const newY = walkingPath.y;
    const oldX = this.gameMap.getMap().worldToTileX(this.x);
    const oldY = this.gameMap.getMap().worldToTileY(this.y);
    const oldPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2(oldX, oldY);
    const newPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2(newX, newY);
    let animationMove = AnimationDefaults.ANIMATION_MOVE_RIGHT;
    let animationEnd = AnimationDefaults.ANIMATION_IDLE_RIGHT;
    if (oldX < newX) {
      // nothing because its the default anyway
    } else if (newX < oldX) {
      animationMove = AnimationDefaults.ANIMATION_MOVE_LEFT;
      animationEnd = AnimationDefaults.ANIMATION_IDLE_LEFT;
    } else if (newY > oldY) {
      animationMove = AnimationDefaults.ANIMATION_MOVE_DOWN;
      animationEnd = AnimationDefaults.ANIMATION_IDLE_DOWN;
    } else if (newY < oldY) {
      animationMove = AnimationDefaults.ANIMATION_MOVE_UP;
      animationEnd = AnimationDefaults.ANIMATION_IDLE_UP;
    }


    if (walkingPath.endAnimation) {
      animationEnd = walkingPath.endAnimation;
    }
    const distance = oldPos.distance(newPos);
    this.scene.tweens.add({
      targets: this,
      x: this.gameMap.getMap().tileToWorldX(newX) + this.width / 2,
      y: this.gameMap.getMap().tileToWorldY(newY) + this.height / 2,
      duration: AnimationDefaults.MOVEMENT_DURATION * distance,
      onComplete: () => {
        this.play(animationEnd);
        this.scene.events.emit('walkDone' + this.characterData.characterName);
      }
    });
    this.play(animationMove);
  }

  public talk(text: string, duration: number): void {
    this.talkingSprite = this.scene.add.sprite(this.x, this.y + this.height, 'uiIcons');

    this.talkingSprite.play('talking');
    setTimeout(() => {
      this.talkingSprite.destroy();
      this.talkingSprite = null;
    }, duration);
    return;
  }

  public setVisible(visible: boolean): this {
    super.setVisible(visible);
    if (this.talkingSprite) {
      this.talkingSprite.setVisible(visible);
    }
    return this;
  }

  public walkPath(walkPath: WalkingPath): void {
    this.activePath = walkPath;
    this.nextPath();
    this.scene.events.on('walkDone' + this.characterData.characterName, () => {
      this.nextPath();
    });
  }

  private nextPath(): void {
    if (this.activePath === null || this.activePath.nodes.length === 0) {
      this.activePath = null;
      this.scene.events.removeAllListeners('walkDone' + this.characterData.characterName);
    } else {
      const nextNode = this.activePath.nodes[0];
      this.activePath.nodes = this.activePath.nodes.slice(1, this.activePath.nodes.length);
      if (nextNode.pause) {
        setTimeout(() => this.moveToTile(nextNode), nextNode.pause);
      } else {
        this.moveToTile(nextNode);
      }
    }
  }
}
