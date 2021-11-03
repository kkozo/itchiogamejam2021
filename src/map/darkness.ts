import {Mrpas} from 'mrpas';

export default class Darkness extends Phaser.GameObjects.GameObject {
  private fov?: Mrpas[];

  private map?: Phaser.Tilemaps.Tilemap;
  private bounds: Phaser.Geom.Rectangle;
  private activeLayer: Phaser.Tilemaps.TilemapLayer;

  // other properties and preload()

  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    super(scene, 'tileMapDarkness');
    this.map = map;
    this.fov = [];
    scene.add.existing(this);
    for (const layer of this.map.layers) {
      this.fov.push(new Mrpas(this.map.width, this.map.height, (x, y) => {
        const tile = layer.tilemapLayer.getTileAt(x, y);
        return tile && !tile.collides;
      }));
    }
    this.bounds = new Phaser.Geom.Rectangle(
      0,
      0,
      this.map.width,
      this.map.height
    );
    this.scene.events.on('update', (time, delta) => {
      this.update(time, delta);
    });
  }

  public setActiveLayer(newActiveLayer: Phaser.Tilemaps.TilemapLayer): void {
    this.activeLayer = newActiveLayer;
  }

  update(time: number, delta: number): void {
    for (let y = this.bounds.y; y < this.bounds.y + this.bounds.height; y++) {
      for (let x = this.bounds.x; x < this.bounds.x + this.bounds.width; x++) {
        if (this.activeLayer !== undefined) {
          const tile = this.activeLayer.getTileAt(x, y);
          if (!tile) {
            continue;
          }
          tile.alpha = 0;
        }
      }
    }
    const tileX = this.map.worldToTileX(this.scene.input.activePointer.x);
    const tileY = this.map.worldToTileX(this.scene.input.activePointer.y);
    this.fov[0].compute(
      tileX,
      tileY,
      7,
      (x, y) => {
        const tile = this.activeLayer!.getTileAt(x, y)
        if (!tile)
        {
          return false
        }
        return tile.alpha > 0
      },
      (x, y) => {
        const tile = this.activeLayer!.getTileAt(x, y)
        if (!tile)
        {
          return
        }
        tile.alpha = 1
      }
    )
  }
}
