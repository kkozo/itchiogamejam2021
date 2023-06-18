import {Mrpas} from 'mrpas';
import GameMap from './map';
import {game} from '../main';
import Darkness from './darkness';

export default class Lightsource extends Phaser.GameObjects.GameObject {
  private fov?: Mrpas;
  private tilemap: Phaser.Tilemaps.Tilemap;
  private direction = new Phaser.Math.Vector2(1, 0);
  private angle = 120;
  private debugTriangle: Phaser.Geom.Triangle;
  private circle1: Phaser.GameObjects.Arc;
  private circle2: Phaser.GameObjects.Arc;
  private circle3: Phaser.GameObjects.Arc;
  private length = 550;
  private currentRotation: number;

  // other properties and preload()

  constructor(scene: Phaser.Scene, private gameMap: GameMap, private darkness: Darkness) {
    super(scene, 'lightSource');
    this.tilemap = gameMap.getMap();
    this.currentRotation = 1;
    scene.add.existing(this);
    this.fov = (new Mrpas(this.tilemap.width, this.tilemap.height, (x, y) => {
      for (const layer of this.gameMap.backgroundLayers) {
        const tile = layer.getTileAt(x, y);
        return tile && !tile.collides;
      }
    }));
    this.scene.events.on('darknessCreated', (time, delta) => {
      this.update(time, delta);
    });
    const vect = new Phaser.Math.Vector2(0 * 5 + this.direction.x, 0 * 5 + this.direction.y);
    this.direction = this.direction.rotate(this.angle / Math.PI);
    this.debugTriangle = new Phaser.Geom.Triangle(0, 0, vect.x, vect.y, 0 + 5 * this.direction.x, 0 + 5 * this.direction.y);
    this.circle1 = this.scene.add.circle(this.debugTriangle.x1, this.debugTriangle.y1, 15, 0xff0000);
    this.circle2 = this.scene.add.circle(this.debugTriangle.x2, this.debugTriangle.y2, 15, 0x00ff00);
    this.circle3 = this.scene.add.circle(this.debugTriangle.x3, this.debugTriangle.y3, 15, 0x0000ff);

    this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      this.direction.rotate(((deltaY) / 8));
    });


  }

  update(time: number, delta: number): void {
    const pointerX = this.scene.input.activePointer.worldX;
    const pointerY = this.scene.input.activePointer.worldY;

    const tileX = this.tilemap.worldToTileX(pointerX);
    const tileY = this.tilemap.worldToTileX(pointerY);

    this.angle = this.angle + delta * this.currentRotation / this.angle;
    if (this.angle > 180) {
      this.currentRotation = -1;
    } else {
      this.currentRotation = 1;
    }
    const vect = new Phaser.Math.Vector2(pointerX + this.length * this.direction.x, pointerY + this.length * this.direction.y);

    const radiusVect = this.direction.clone().rotate(Math.PI / 6);

    this.circle1.setPosition(pointerX, pointerY);
    this.circle2.setPosition(vect.x, vect.y);
    this.circle3.setPosition(pointerX + this.length * radiusVect.x, pointerY + this.length * radiusVect.y);
    this.debugTriangle.setTo(this.tilemap.worldToTileX(pointerX), this.tilemap.worldToTileY(pointerY),
      this.tilemap.worldToTileX(vect.x), this.tilemap.worldToTileY(vect.y), this.tilemap.worldToTileX(pointerX + this.length * radiusVect.x),
      this.tilemap.worldToTileY(pointerY + this.length * radiusVect.y));
    this.darkness.move(pointerX, pointerY, [pointerX + this.direction.x*this.length, pointerY + this.direction.y*this.length], [pointerX + radiusVect.x*this.length, pointerY + radiusVect.y*this.length]);
    for (const layer of this.gameMap.backgroundLayers) {
      this.fov.compute(
        tileX,
        tileY,
        this.length / 10,
        (x, y) => {
          const tile = layer?.getTileAt(x, y);
          if (!tile) {
            return false;
          }
          return tile.alpha > 0;
        },
        (x, y) => {
          if (this.debugTriangle.contains(x, y)) {
            const tile = layer?.getTileAt(x, y);
            if (tile) {
              const d = Phaser.Math.Distance.Between(tileY, tileX, y, x);
              const alpha = Math.min(2 - d / (this.length / 10 - 4), 1);
              tile.tint = 0xffffff;
              tile.alpha = alpha;
            }
            for (const foregroundLayer of this.gameMap.foregroundLayers) {
              const foregroundTile = foregroundLayer?.getTileAt(x, y);
              if (foregroundTile) {

                foregroundTile.tint = 0xffffff;
                foregroundTile.alpha = 0xffffff;
              }
            }
            const entities = this.scene.children.getChildren().filter(e => e.name === 'character');
            for (const gameObject of entities) {
              if (gameObject instanceof Phaser.GameObjects.Sprite) {
                const entityTileX = this.tilemap.worldToTileX(gameObject.x);
                const entityTileY = this.tilemap.worldToTileY(gameObject.y);
                if (entityTileX === x && entityTileY === y) {
                  gameObject.setVisible(true);
                }
              }
            }

          }

        }
      );
    }
  }
}
