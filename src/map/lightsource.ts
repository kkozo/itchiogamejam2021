import {Mrpas} from 'mrpas';

export default class Lightsource extends Phaser.GameObjects.GameObject {
  private fov?: Mrpas[];

  private map?: Phaser.Tilemaps.Tilemap;
  private activeLayer: Phaser.Tilemaps.TilemapLayer;
  private direction = new Phaser.Math.Vector2(1, 0);
  private angle = 250;
  private debugTriangle: Phaser.Geom.Triangle;
  private debugRectangle: Phaser.Geom.Polygon;
  private circle1: Phaser.GameObjects.Arc;
  private circle2: Phaser.GameObjects.Arc;
  private circle3: Phaser.GameObjects.Arc;
  private length = 250;

  // other properties and preload()

  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    super(scene, 'lightSource');
    this.map = map;
    this.fov = [];
    scene.add.existing(this);


    for (const layer of this.map.layers) {
      this.fov.push(new Mrpas(this.map.width, this.map.height, (x, y) => {
        const tile = layer.tilemapLayer.getTileAt(x, y);
        return tile && !tile.collides;
      }));
    }
    this.scene.events.on('darknessCreated', (time, delta) => {
      this.update(time, delta);
    });
    const vect = new Phaser.Math.Vector2(0 * 5 + this.direction.x, 0 * 5 + this.direction.y);
    this.direction = this.direction.rotate(this.angle / Math.PI);
    this.debugTriangle = new Phaser.Geom.Triangle(0, 0, vect.x, vect.y, 0 + 5 * this.direction.x, 0 + 5 * this.direction.y);
    this.debugRectangle = new Phaser.Geom.Polygon([0, 0, 0, vect.x, vect.y, 0 + 5 * this.direction.x, 0 + 5 * this.direction.y]);
    this.circle1 = this.scene.add.circle(this.debugTriangle.x1, this.debugTriangle.y1, 15, 0xff0000);
    this.circle2 = this.scene.add.circle(this.debugTriangle.x2, this.debugTriangle.y2, 15, 0x00ff00);
    this.circle3 = this.scene.add.circle(this.debugTriangle.x3, this.debugTriangle.y3, 15, 0x0000ff);


  }

  public setActiveLayer(newActiveLayer: Phaser.Tilemaps.TilemapLayer): void {
    this.activeLayer = newActiveLayer;
  }

  update(time: number, delta: number): void {
    const cameraOriginX = this.scene.input.activePointer.x;
    const cameraOriginY = this.scene.input.activePointer.y;
    const tileX = this.map.worldToTileX(cameraOriginX);
    const tileY = this.map.worldToTileX(cameraOriginY);

    this.angle = this.angle + delta / 250;
    this.direction.rotate(5 / delta / 25);
    const vect = new Phaser.Math.Vector2(cameraOriginX + this.length * this.direction.x, cameraOriginY + this.length * this.direction.y);

    const radiusVect = this.direction.clone().rotate(Math.PI / 3);
    this.circle1.setPosition(cameraOriginX, cameraOriginY);
    this.circle2.setPosition(vect.x, vect.y);
    this.circle3.setPosition(cameraOriginX + this.length * radiusVect.x, cameraOriginY + this.length * radiusVect.y);
    this.debugTriangle.setTo(this.map.worldToTileX(cameraOriginX), this.map.worldToTileY(cameraOriginY), this.map.worldToTileX(vect.x), this.map.worldToTileY(vect.y), this.map.worldToTileX(cameraOriginX + this.length * radiusVect.x), this.map.worldToTileY(cameraOriginY + this.length * radiusVect.y));

    for (const layer of this.map.layers) {
      this.fov[0].compute(
        tileX,
        tileY,
        this.length / 10,
        (x, y) => {
          const tile = layer?.tilemapLayer?.getTileAt(x, y);
          if (!tile) {
            return false;
          }
          return tile.alpha > 0;
        },
        (x, y) => {
          if (this.debugTriangle.contains(x, y)) {
            const tile = layer?.tilemapLayer?.getTileAt(x, y);
            if (!tile) {
              return;
            }
            const d = Phaser.Math.Distance.Between(tileY, tileX, y, x);
            const alpha = Math.min(2 - d / (this.length / 10 - 4), 1);

            tile.tint = 0xffffff;
            tile.alpha = alpha;
          }
        }
      );
    }
  }
}
