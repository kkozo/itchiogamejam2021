

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
    this.load.image('interiors_kitchen', 'assets/tiles/kitchen_32x32.png')
    this.load.image('interiors_generic', 'assets/tiles/generic_32x32.png')
    this.load.image('interiors_bathroom', 'assets/tiles/bathroom_32x32.png')
    this.load.image('interiors_bedroom', 'assets/tiles/bedroom_32x32.png')
    this.load.image('interiors_living_room', 'assets/tiles/living_room_32x32.png')
    this.load.image('interiors_room_builder', 'assets/tiles/room_builder_32x32.png')
    this.load.image('interiors_visible_upstairs', 'assets/tiles/visible_upstairs_32x32.png')
    this.load.image('interiors_basement', 'assets/tiles/basement_32x32.png')
    this.load.image('interiors_condo', 'assets/tiles/condo_32x32.png')
    this.load.tilemapTiledJSON('House01', 'assets/map//House01/House01.json')
  }

  public create(): void {
    const map = this.make.tilemap({key: 'House01'})
    const genericTiles = map.addTilesetImage('Generic', 'interiors_generic')
    const kitchenTiles = map.addTilesetImage('Kitchen', 'interiors_kitchen')
    const bathroomTiles = map.addTilesetImage('Bathroom', 'interiors_bathroom')
    const bedroomTiles = map.addTilesetImage('Bedroom', 'interiors_bedroom')
    const livingRoomTiles = map.addTilesetImage('Living Room', 'interiors_living_room')
    const condoTiles = map.addTilesetImage('Condo', 'interiors_condo')
    const basementTiles = map.addTilesetImage('Basement', 'interiors_basement')
    const visUpstairsTiles = map.addTilesetImage('Visible Upstairs', 'interiors_visible_upstairs')
    const roomBuilderTiles = map.addTilesetImage('Room Builder', 'interiors_room_builder')

    const groundLayer = map.createLayer('Floors', [roomBuilderTiles])
    const wallsLayer = map.createLayer('Walls', [roomBuilderTiles])
    const stat04Layer = map.createLayer('Static Objects 4', [roomBuilderTiles, kitchenTiles, bedroomTiles, livingRoomTiles, genericTiles, bathroomTiles])
    const stat03Layer = map.createLayer('Static Objects 3', [roomBuilderTiles, kitchenTiles, bedroomTiles, livingRoomTiles, genericTiles, bathroomTiles])
    const stat02Layer = map.createLayer('Static Objects 2', [roomBuilderTiles, kitchenTiles, bedroomTiles, livingRoomTiles, genericTiles, bathroomTiles])
    const stat01Layer = map.createLayer('Static Objects 1', [roomBuilderTiles, condoTiles, kitchenTiles, bedroomTiles, livingRoomTiles, genericTiles, bathroomTiles])

    // Click to move camera to another area of the map, with fade
    const camera1 = this.cameras.main;

    this.input.mouse.disableContextMenu();

    this.input.on('pointerup', function (pointer) {

        if (pointer.leftButtonReleased())
        {
          if (camera1.scrollY == 0) {
            camera1.once('camerafadeoutcomplete', function (camera) {
              camera.fadeIn(500);
            });
            camera1.fadeOut(500);
            setTimeout(() => camera1.setBounds(0, 672, 800, 600), 500);
          } else {
            camera1.once('camerafadeoutcomplete', function (camera) {
              camera.fadeIn(500);
            });
            camera1.fadeOut(500);
            setTimeout(() => camera1.setBounds(0, 0, 800, 600), 500);
          }
        }

    });
  }


  public update(): void {

  }
}
