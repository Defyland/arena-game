import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // This scene is a placeholder since we're using React for menus
    // It could be used for game-specific menus like pause or game over
    
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;
    
    this.add.text(centerX, centerY, 'Menu Scene\n(Using React for UI)', {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);
  }
} 