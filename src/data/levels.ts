import {MapInfo} from '../map/map';

export const HOUSE_LEVEL: MapInfo = {
  houseKey: 'House01',
  houseAssetPath: 'assets/map//House01/House01.json',
  preloadAssets: [{key: 'interiors_kitchen', path: 'assets/tiles/kitchen_32x32.png', name: 'Kitchen'},
    {key: 'interiors_generic', path: 'assets/tiles/generic_32x32.png', name: 'Generic'},
    {key: 'interiors_bathroom', path: 'assets/tiles/bathroom_32x32.png', name: 'Bathroom'},
    {key: 'interiors_bedroom', path: 'assets/tiles/bedroom_32x32.png', name: 'Bedroom'},
    {key: 'interiors_living_room', path: 'assets/tiles/living_room_32x32.png', name: 'Living Room'},
    {key: 'interiors_room_builder', path: 'assets/tiles/room_builder_32x32.png', name: 'Room Builder'},
    {key: 'interiors_visible_upstairs', path: 'assets/tiles/visible_upstairs_32x32.png', name: 'Visible Upstairs'},
    {key: 'interiors_basement', path: 'assets/tiles/basement_32x32.png', name: 'Basement'},
    {key: 'interiors_condo', path: 'assets/tiles/condo_32x32.png', name: 'Condo'}],

  layerInfo: [{name: 'Floors', tilesetNames: ['Room Builder'], staticObjects: false},
    {name: 'Walls', tilesetNames: ['Room Builder'], staticObjects: false},
    {
      name: 'Static Objects 4',
      tilesetNames: ['Room Builder', 'Kitchen', 'Bedroom', 'Living Room', 'Generic', 'Bathroom'],
      staticObjects: true
    },
    {
      name: 'Static Objects 3',
      tilesetNames: ['Room Builder', 'Kitchen', 'Bedroom', 'Living Room', 'Generic', 'Bathroom'],
      staticObjects: true
    },
    {
      name: 'Static Objects 2',
      tilesetNames: ['Room Builder', 'Kitchen', 'Bedroom', 'Living Room', 'Generic', 'Bathroom'],
      staticObjects: true
    },
    {
      name: 'Static Objects 1',
      tilesetNames: ['Room Builder', 'Condo', 'Kitchen', 'Bedroom', 'Living Room', 'Generic', 'Bathroom'],
      staticObjects: true
    }
  ],
  floors: [{
    floorNumber: 0,
    floorX: 0,
    floorY: 0
  },
    {
      floorNumber: 1,
      floorX: 0,
      floorY: 672
    }]
};

