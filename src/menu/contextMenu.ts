import GameMap from '../map/map';

export default class ContextMenu extends Phaser.GameObjects.GameObject {

  private downArrow: Phaser.GameObjects.Sprite;
  private upArrow: Phaser.GameObjects.Sprite;
  private disabledColor = 0xff0000;


  constructor(scene: Phaser.Scene, private gameMap: GameMap) {
    super(scene, 'ContextMenu');
    this.downArrow = this.scene.add.sprite(scene.game.renderer.width - 80, 120 + 64, 'menuArrow');
    this.downArrow.setInteractive();
    this.downArrow.setRotation(Math.PI);
    this.upArrow = this.scene.add.sprite(scene.game.renderer.width - 80, 100, 'menuArrow');
    this.upArrow.setInteractive();
    if (gameMap.currentFloor.floorNumber === 0) {
      this.downArrow.setTint(this.disabledColor);
    }
    this.upArrow.on('pointerdown', (pointer) => {
      if (this.gameMap.currentFloor.floorNumber < this.gameMap.mapInfo.floors.length - 1) {
        this.gameMap.goFloorUp();
        this.updatePositions();
      }
    });

    this.downArrow.on('pointerdown', (pointer) => {
      if (this.gameMap.currentFloor.floorNumber !== 0) {
        this.gameMap.goFloorDown();
        this.updatePositions();
      }
    });

  }


  private updatePositions(): void {
    this.scene.game.sound.play('click');

    this.scene.cameras.main.once('camerafadeoutcomplete', camera => {
      camera.fadeIn(500);
    });
    this.scene.cameras.main.fadeOut(500);
    setTimeout(() => {
      this.scene.cameras.main.setBounds(this.gameMap.currentFloor.floorX, this.gameMap.currentFloor.floorY, 1024, 768);
      if (this.gameMap.currentFloor.floorNumber === 0) {
        this.downArrow.setTint(this.disabledColor);
        this.upArrow.clearTint();
      } else if (this.gameMap.currentFloor.floorNumber === this.gameMap.mapInfo.floors.length - 1) {
        this.upArrow.setTint(this.disabledColor);
        this.downArrow.clearTint();
      }
      let newVect: Phaser.Math.Vector2 = this.scene.cameras.main.getWorldPoint(this.scene.game.renderer.width - 80, 120 + 64);
      this.downArrow.setPosition(newVect.x, newVect.y);
      newVect = this.scene.cameras.main.getWorldPoint(this.scene.game.renderer.width - 80, 100);
      this.upArrow.setPosition(newVect.x, newVect.y);
    }, 500);
  }

}
