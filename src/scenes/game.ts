

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
  }

  public create(): void {
  }

  public update(): void {
   console.log("hello");
  }
}
