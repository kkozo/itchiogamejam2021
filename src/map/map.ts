import {Scene} from 'phaser';

export interface TextureKey {
  key: string;
  path: string;
  name: string;
}

export interface LayerInfo {
  name: string;
  tilesetNames: string[];
  staticObjects: boolean;
}

export interface MapInfo {
  houseKey: string;
  houseAssetPath: string;
  preloadAssets: TextureKey[];
  layerInfo: LayerInfo[];
  floors: Floor[];
}

export interface Floor {
  floorNumber: number;
  floorX: number;
  floorY: number;
}

export default class GameMap {

  private tileMap: Phaser.Tilemaps.Tilemap;
  public backgroundLayers: Phaser.Tilemaps.TilemapLayer[];
  public foregroundLayers: Phaser.Tilemaps.TilemapLayer[];
  public currentFloor: Floor;

  constructor(public scene: Scene, public mapInfo: MapInfo) {

  }

  public loadAssets(): void {
    for (const preload of this.mapInfo.preloadAssets) {
      this.scene.load.image(preload.key, preload.path);
    }
    this.scene.load.tilemapTiledJSON(this.mapInfo.houseKey, this.mapInfo.houseAssetPath);
  }

  public createMap(): void {
    const map = this.scene.make.tilemap({key: this.mapInfo.houseKey});
    for (const textureKey of this.mapInfo.preloadAssets) {
      map.addTilesetImage(textureKey.name, textureKey.key);
    }
    for (const layerInfo of this.mapInfo.layerInfo) {
      map.createLayer(layerInfo.name, layerInfo.tilesetNames.map(e => map.getTileset(e)));
    }
    this.tileMap = map;
    this.computeLayers();
    this.currentFloor = this.mapInfo.floors[0];
  }

  public goFloorUp(): void {
    if (this.currentFloor.floorNumber + 1 < this.mapInfo.floors.length) {
      this.currentFloor = this.mapInfo.floors[this.currentFloor.floorNumber + 1 ];
    }
  }
  public goFloorDown(): void {
    if (this.currentFloor.floorNumber - 1 >= 0) {
      this.currentFloor = this.mapInfo.floors[this.currentFloor.floorNumber - 1 ];
    }
  }

  public getMap(): Phaser.Tilemaps.Tilemap {

    return this.tileMap;
  }

  private computeLayers(): void {
    const backgroundLayers: Phaser.Tilemaps.TilemapLayer[] = [];
    const foregroundLayers: Phaser.Tilemaps.TilemapLayer[] = [];
    for (const layerInfo of this.mapInfo.layerInfo) {
      if (!layerInfo.staticObjects) {
        backgroundLayers.push(this.tileMap.layers.find(e => e.name === layerInfo.name).tilemapLayer);
      } else {
        foregroundLayers.push(this.tileMap.layers.find(e => e.name === layerInfo.name).tilemapLayer);
      }
    }
    this.backgroundLayers = backgroundLayers;
    this.foregroundLayers = foregroundLayers;
  }

}
