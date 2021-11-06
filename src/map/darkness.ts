import GameMap from './map';

export default class Darkness extends Phaser.GameObjects.GameObject {
  private map?: Phaser.Tilemaps.Tilemap;

  constructor(scene: Phaser.Scene, private gameMap: GameMap) {
    super(scene, 'tileMapDarkness');
    this.map = gameMap.getMap();
    scene.add.existing(this);

    this.scene.events.on('update', (time, delta) => {
      this.update(time, delta);
    });
  }

  update(time: number, delta: number): void {

    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        for (const layer of this.gameMap.backgroundLayers) {
          if (layer !== undefined) {
            const tile = layer.getTileAt(x, y);
            if (!tile) {
              continue;
            }

            tile.tint = 0x444444;
          }
        }
        for (const layer of this.gameMap.foregroundLayers) {
          if (layer !== undefined) {
            const tile = layer.getTileAt(x, y);
            if (!tile) {
              continue;
            }

            tile.alpha = 0x000000;
          }
        }
      }
    }
    this.scene.events.emit('darknessCreated', time, delta);
  }
}
