import {Scene} from 'phaser';

export interface TextureKey {
  key: string;
  path: string;
  name: string;
}

export interface LayerInfo {
  name: string;
  tilesetNames: string[];
}

export interface MapInfo {
  houseKey: string;
  houseAssetPath: string;
  preloadAssets: TextureKey[];
  layerInfo: LayerInfo[];
}

export default class GameMap {


  constructor(public scene: Scene, public mapInfo: MapInfo) {

  }

  public loadAssets(): void {
    for (const preload of this.mapInfo.preloadAssets) {
      this.scene.load.image(preload.key, preload.path);
    }
    this.scene.load.tilemapTiledJSON(this.mapInfo.houseKey, this.mapInfo.houseAssetPath);

  }

  public createMap(): Phaser.Tilemaps.Tilemap {
    const map = this.scene.make.tilemap({key: this.mapInfo.houseKey});
    for (const textureKey of this.mapInfo.preloadAssets) {
      map.addTilesetImage(textureKey.name, textureKey.key);
    }
    for (const layerInfo of this.mapInfo.layerInfo) {
      map.createLayer(layerInfo.name, layerInfo.tilesetNames.map(e => map.getTileset(e)));
    }
    return map;
  }

}
