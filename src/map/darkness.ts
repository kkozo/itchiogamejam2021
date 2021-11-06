
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

    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        for (const layer of this.map.layers) {
        if (layer !== undefined) {
          const tile = layer.tilemapLayer?.getTileAt(x, y);
          if (!tile) {
            continue;
          }
          tile.tint = 0x444444;
        }
      }
    }
    }
    this.scene.events.emit('darknessCreated', time, delta);
  }
}
