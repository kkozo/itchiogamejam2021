import GameMap from './map';
import {
  breakIntersections,
  convertToSegments,
  compute,
  computeViewport,
  inPolygon,
  Polygon, Vector2D,
} from 'visibility-polygon';
import WebGLRenderer = Phaser.Renderer.WebGL.WebGLRenderer;

export default class Darkness extends Phaser.GameObjects.GameObject {
  private map?: Phaser.Tilemaps.Tilemap;
  private polygons: Polygon[] = [];
  private debugPolygon: Phaser.Geom.Polygon;
  private graphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, private gameMap: GameMap) {
    super(scene, 'tileMapDarkness');
    this.map = gameMap.getMap();

    this.scene.events.on('update', (time, delta) => {
      this.update(time, delta);
    });
    for (const rect of this.gameMap.getMap().getObjectLayer('VisibilityWalls').objects) {
      if (rect.rectangle) {
        this.polygons.push([[rect.x, rect.y], [rect.x + rect.width, rect.y], [rect.x + rect.width, rect.y + rect.height], [rect.x, rect.y + rect.height]]);
      }
    }
    this.graphics = this.scene.add.graphics();
    this.move(0, 0, [0, 0], [0, 0]);

    const grayscalePipeline = (this.scene.game.renderer as WebGLRenderer).pipelines.get('Grayscale');

    this.graphics.setPipeline(grayscalePipeline);


  }

  createLightPolygon(x: number, y: number, viewVectorX: Vector2D, viewVectorY: Vector2D): Vector2D[] {
    let segments = convertToSegments(this.polygons);
    segments = breakIntersections(segments);
    const position: Vector2D = [x, y];
    // return computeViewport(position, segments, viewVectorX, viewVectorY);
    return compute(position, segments);
  }

  update(time: number, delta: number): void {

    // for (let y = 0; y < this.map.height; y++) {
    //   for (let x = 0; x < this.map.width; x++) {
    //     for (const layer of this.gameMap.backgroundLayers) {
    //       if (layer !== undefined) {
    //         const tile = layer.getTileAt(x, y);
    //         if (!tile) {
    //           continue;
    //         }
    //
    //         tile.tint = 0x444444;
    //       }
    //     }
    //     for (const layer of this.gameMap.foregroundLayers) {
    //       if (layer !== undefined) {
    //         const tile = layer.getTileAt(x, y);
    //         if (!tile) {
    //           continue;
    //         }
    //
    //         tile.alpha = 0x000000;
    //       }
    //     }
    //   }
    //
    //
    // }

    const entities = this.scene.children.getChildren().filter(e => e.name === 'character');
    for (const gameObject of entities) {
      (gameObject as Phaser.GameObjects.Sprite).setVisible(false);
    }
    this.scene.events.emit('darknessCreated', time, delta);
  }

  move(x: number, y: number, viewVectorX: Vector2D, viewVectorY: Vector2D): void {
    const visibility = this.createLightPolygon(x, y, viewVectorX, viewVectorY);
    this.graphics.clear();
    this.graphics.lineStyle(2, 0xff8800, 1);
    this.graphics.fillStyle(0xffff00, 1.0);
    this.graphics.beginPath();

    this.graphics.moveTo(visibility[0][0], visibility[0][1]);
    for (var i = 1; i <= visibility.length; i++) {
      this.graphics.lineTo(visibility[i % visibility.length][0], visibility[i % visibility.length][1]);
    }
    this.graphics.closePath();
    this.graphics.fillPath();

  }
}
