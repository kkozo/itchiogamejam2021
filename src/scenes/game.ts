

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {

  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    this.load.image('interiors_all', 'assets/tiles/interiors_32x32.png')
    this.load.image('interiors_kitchen', 'assets/tiles/kitchen_32x32.png')
    this.load.image('interiors_generic', 'assets/tiles/generic_32x32.png')
    this.load.image('interiors_bathroom', 'assets/tiles/bathroom_32x32.png')
    this.load.image('interiors_bedroom', 'assets/tiles/bedroom_32x32.png')
    this.load.image('interiors_living_room', 'assets/tiles/living_room_32x32.png')
    this.load.image('interiors_room_builder', 'assets/tiles/room_builder_32x32.png')
    this.load.tilemapTiledJSON('House01', 'assets/map//House01/House01.json')

  }

  public create(): void {
    const map = this.make.tilemap({key: 'House01'})
    const allTiles = map.addTilesetImage('Interiors', 'interiors_all')
    const genericTiles = map.addTilesetImage('Generic', 'interiors_generic')
    const kitchenTiles = map.addTilesetImage('Kitchen', 'interiors_kitchen')
    const bathroomTiles = map.addTilesetImage('Bathroom', 'interiors_bathroom')
    const bedroomTiles = map.addTilesetImage('Bedroom', 'interiors_bedroom')
    const livingRoomTiles = map.addTilesetImage('Living Room', 'interiors_living_room')
    const roomBuilderTiles = map.addTilesetImage('Room Builder', 'interiors_room_builder')

    const groundLayer = map.createLayer('Floors', [allTiles, roomBuilderTiles])
    const wallsLayer = map.createLayer('Walls', [allTiles, roomBuilderTiles])
    const stat01Layer = map.createLayer('Static Objects 1', [allTiles, roomBuilderTiles, kitchenTiles, bedroomTiles, livingRoomTiles, genericTiles, bathroomTiles])
  }

  public update(): void {

  }
}
