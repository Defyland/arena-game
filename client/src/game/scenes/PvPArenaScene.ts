import Phaser from 'phaser';
import { AssetLoader } from '../utils/AssetLoader';
import { GAME_CONFIG, COLORS, SPAWN_CONFIG } from '../utils/Constants';
import { Player } from '../entities/Player';
import { CHARACTERS } from '../../types/Player';

export default class PvPArenaScene extends Phaser.Scene {
  private player!: Player;
  private otherPlayers!: Map<string, Player>;
  private projectiles!: Phaser.GameObjects.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private skillKeys!: { [key: string]: Phaser.Input.Keyboard.Key };
  
  constructor() {
    super({ key: 'PvPArenaScene' });
  }

  preload() {
    AssetLoader.preloadAssets(this);
  }

  create() {
    // Create arena background
    const { width, height } = SPAWN_CONFIG.PVP.ARENA_SIZE;
    AssetLoader.createTiledBackground(this, width, height);
    
    // Create arena bounds
    this.createArenaBounds(width, height);
    
    // Get character from registry
    const character = this.registry.get('character') || 'melee';
    const characterData = CHARACTERS[character];
    
    // Initialize collections
    this.otherPlayers = new Map();
    this.projectiles = this.add.group();
    
    // Create local player at random spawn position
    const spawnX = Phaser.Math.Between(100, width - 100);
    const spawnY = Phaser.Math.Between(100, height - 100);
    this.player = new Player(this, spawnX, spawnY, character, characterData);
    
    // Setup camera
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setZoom(1.2);
    this.cameras.main.setBounds(0, 0, width, height);
    
    // Setup physics world bounds
    this.physics.world.setBounds(0, 0, width, height);
    
    // Setup input
    this.setupInput();
    
    // Setup multiplayer (placeholder for now)
    this.setupMultiplayer();
    
    // UI Text (temporary)
    this.add.text(16, 16, 'PvP Arena Mode\n[Multiplayer em desenvolvimento]', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 10 }
    }).setScrollFactor(0);
  }

  private createArenaBounds(width: number, height: number) {
    // Create invisible walls
    const wallThickness = 32;
    
    // Top wall
    this.physics.add.staticGroup([
      this.add.rectangle(width / 2, -wallThickness / 2, width, wallThickness, COLORS.UI_BORDER)
        .setVisible(false)
    ]);
    
    // Bottom wall  
    this.physics.add.staticGroup([
      this.add.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, COLORS.UI_BORDER)
        .setVisible(false)
    ]);
    
    // Left wall
    this.physics.add.staticGroup([
      this.add.rectangle(-wallThickness / 2, height / 2, wallThickness, height, COLORS.UI_BORDER)
        .setVisible(false)
    ]);
    
    // Right wall
    this.physics.add.staticGroup([
      this.add.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, COLORS.UI_BORDER)
        .setVisible(false)
    ]);
  }

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    this.wasdKeys = {
      W: this.input.keyboard!.addKey('W'),
      A: this.input.keyboard!.addKey('A'),
      S: this.input.keyboard!.addKey('S'),
      D: this.input.keyboard!.addKey('D')
    };
    
    this.skillKeys = {
      Q: this.input.keyboard!.addKey('Q'),
      W: this.input.keyboard!.addKey('W'),
      E: this.input.keyboard!.addKey('E'),
      R: this.input.keyboard!.addKey('R')
    };
  }

  private setupMultiplayer() {
    // TODO: Implement Socket.IO connection
    // This will handle:
    // - Sending player movement and actions
    // - Receiving other players' states
    // - Handling disconnections
    // - Synchronizing game state
    
    console.log('Multiplayer setup placeholder - Socket.IO integration needed');
  }

  update() {
    // Update local player
    this.player.update(this.getMovementInput(), this.getSkillInput());
    
    // Update other players (when multiplayer is implemented)
    this.otherPlayers.forEach((player) => {
      // Updates will be driven by network events
    });
  }

  private getMovementInput(): { x: number; y: number } {
    const movement = { x: 0, y: 0 };
    
    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
      movement.x = -1;
    } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
      movement.x = 1;
    }
    
    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
      movement.y = -1;
    } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
      movement.y = 1;
    }
    
    return movement;
  }

  private getSkillInput(): string | null {
    if (Phaser.Input.Keyboard.JustDown(this.skillKeys.Q)) return 'Q';
    if (Phaser.Input.Keyboard.JustDown(this.skillKeys.W)) return 'W';
    if (Phaser.Input.Keyboard.JustDown(this.skillKeys.E)) return 'E';
    if (Phaser.Input.Keyboard.JustDown(this.skillKeys.R)) return 'R';
    return null;
  }

  // Methods for handling multiplayer events (to be implemented)
  public addOtherPlayer(id: string, x: number, y: number, character: string) {
    const characterData = CHARACTERS[character as keyof typeof CHARACTERS];
    const player = new Player(this, x, y, character as any, characterData);
    this.otherPlayers.set(id, player);
  }

  public removeOtherPlayer(id: string) {
    const player = this.otherPlayers.get(id);
    if (player) {
      player.destroy();
      this.otherPlayers.delete(id);
    }
  }

  public updateOtherPlayer(id: string, x: number, y: number, direction: number) {
    const player = this.otherPlayers.get(id);
    if (player) {
      player.sprite.x = x;
      player.sprite.y = y;
      player.sprite.rotation = direction;
    }
  }
} 