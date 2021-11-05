
export default class Darkness extends Phaser.GameObjects.GameObject {
  private map?: Phaser.Tilemaps.Tilemap;

  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    super(scene, 'tileMapDarkness');
    this.map = map;
    scene.add.existing(this);

    this.scene.events.on('update', (time, delta) => {
      this.update(time, delta);
    });
  }

  update(time: number, delta: number): void {
    for (const layer of this.map.layers) {
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        if (layer !== undefined) {
          const tile = layer.tilemapLayer?.getTileAt(x, y);
          if (!tile) {
            continue;
          }
          tile.alpha = 0;
        }
      }
    }
    }
    this.scene.events.emit('darknessCreated', time, delta);
  }
}
