import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '../utils/Constants';
import { AssetLoader } from '../utils/AssetLoader';
import { Skill } from '../../types/Game';
import { WarriorSprite } from '../entities/WarriorSprite';
import { OrcSprite } from '../entities/OrcSprite';

export default class PvEHordeScene extends Phaser.Scene {
  private player: Player | null = null;
  private enemies: OrcSprite[] = [];
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  private skillKeys: { [key: string]: Phaser.Input.Keyboard.Key } = {};

  constructor() {
    super({ key: 'PvEHordeScene' });
  }

  preload() {
    AssetLoader.preloadAssets(this);
  }

  create() {
    // Create background
    AssetLoader.createTiledBackground(this, 2000, 2000);

    // Initialize input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.skillKeys = {
      Q: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      E: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      R: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    };

    const characterData = {
      health: 100,
      energy: 50,
      skills: [
        { id: 'melee_q', key: 'Q', type: 'melee', damage: 25, energyCost: 10, cooldown: 1000, range: 80 },
        { id: 'melee_w', key: 'W', type: 'melee', damage: 35, energyCost: 15, cooldown: 1500, range: 100 }
      ]
    };
    this.player = new Player(this, 400, 300, 'melee', characterData);

    // Setup camera
    this.cameras.main.startFollow(this.player.getPhysicsSprite());
    this.cameras.main.setZoom(1);
    this.cameras.main.setBounds(0, 0, 2000, 2000);
    
    // Setup physics world bounds
    this.physics.world.setBounds(0, 0, 2000, 2000);

    // Initialize enemies array
    this.enemies = [];

    // Add collision detection for each enemy
    this.enemies.forEach(enemy => {
      if (this.player) {
        this.physics.add.collider(this.player.getPhysicsSprite(), enemy.getPhysicsSprite());
      }
    });

    // Spawn enemies periodically
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    if (!this.player) return;

    // Handle movement input
    const movement = { x: 0, y: 0 };
    
    if (this.cursors?.left.isDown) movement.x = -1;
    if (this.cursors?.right.isDown) movement.x = 1;
    if (this.cursors?.up.isDown) movement.y = -1;
    if (this.cursors?.down.isDown) movement.y = 1;

    // Handle skill input - usar JustDown para evitar spam
    let skillInput: string | null = null;
    if (Phaser.Input.Keyboard.JustDown(this.skillKeys.Q)) skillInput = 'Q';
    else if (Phaser.Input.Keyboard.JustDown(this.skillKeys.W)) skillInput = 'W';
    else if (Phaser.Input.Keyboard.JustDown(this.skillKeys.E)) skillInput = 'E';
    else if (Phaser.Input.Keyboard.JustDown(this.skillKeys.R)) skillInput = 'R';

    this.player.update(movement, skillInput);
    
    // Update enemies
    this.updateEnemies();
  }

  private updateEnemies() {
    // Remove dead enemies
    this.enemies = this.enemies.filter(enemy => enemy.isAlive());
    
    // Update alive enemies with simple AI
    this.enemies.forEach(enemy => {
      if (enemy.isAlive() && this.player) {
        const playerSprite = this.player.getPhysicsSprite();
        const enemySprite = enemy.getPhysicsSprite();
        
        // Simple AI: move towards player
        const dx = playerSprite.x - enemySprite.x;
        const dy = playerSprite.y - enemySprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 50) { // Don't get too close
          const speed = 100;
          const movement = {
            x: (dx / distance) * speed,
            y: (dy / distance) * speed
          };
          
          enemy.setVelocity(movement.x, movement.y);
          enemy.update(movement, null);
        } else {
          // Attack when close
          enemy.setVelocity(0, 0);
          enemy.update({ x: 0, y: 0 }, 'attack1');
        }
      }
    });
  }

  public getEnemies(): OrcSprite[] {
    return this.enemies;
  }

  private spawnEnemy() {
    if (!this.player) return;

    // Spawn ao redor do player
    const angle = Phaser.Math.Between(0, 360);
    const distance = 800;
    const playerSprite = this.player.getPhysicsSprite();
    const spawnX = playerSprite.x + Math.cos(angle) * distance;
    const spawnY = playerSprite.y + Math.sin(angle) * distance;
    
    const enemy = new OrcSprite(this, spawnX, spawnY);
    
    // Add collision detection for this enemy
    this.physics.add.collider(this.player.getPhysicsSprite(), enemy.getPhysicsSprite());
    
    this.enemies.push(enemy);
  }
}

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite; // Compatibilidade
  private scene: Phaser.Scene;
  private character: 'melee' | 'ranged';
  
  private warriorSprite: WarriorSprite | null = null;
  private rangedSprite: Phaser.Physics.Arcade.Sprite | null = null;
  private currentSkillState: string | null = null;
  
  private health: number;
  private maxHealth: number;
  private energy: number;
  private maxEnergy: number;
  private level: number = 1;
  private experience: number = 0;
  
  private skills: Skill[];
  
  constructor(
    scene: Phaser.Scene, 
    x: number, 
    y: number, 
    character: 'melee' | 'ranged',
    characterData: any
  ) {
    this.scene = scene;
    this.character = character;
    
    this.health = characterData.health;
    this.maxHealth = characterData.health;
    this.energy = characterData.energy;
    this.maxEnergy = characterData.energy;
    
    if (character === 'melee') {
      this.warriorSprite = new WarriorSprite(scene, x, y);
    } else {
      this.rangedSprite = scene.physics.add.sprite(x, y, 'player-ranged');
      this.rangedSprite.setCollideWorldBounds(true);
      this.rangedSprite.setDepth(30);
      this.rangedSprite.body!.setSize(28, 28);
    }
    
    this.skills = characterData.skills.map((skill: any) => ({
      ...skill,
      currentCooldown: 0
    }));
    
    // Set sprite reference for compatibility
    this.sprite = this.getPhysicsSprite();
    
    scene.time.addEvent({
      delay: 100,
      callback: this.regenerateEnergy,
      callbackScope: this,
      loop: true
    });
  }

  update(movement: { x: number; y: number }, skillInput: string | null) {
    const speed = GAME_CONFIG.PLAYER_SPEED;
    const isMoving = movement.x !== 0 || movement.y !== 0;
    
    let velocityX = 0;
    let velocityY = 0;
    
    if (isMoving) {
      const length = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
      velocityX = (movement.x / length) * speed;
      velocityY = (movement.y / length) * speed;
    }
    
    // Handle skill input
    this.currentSkillState = null;
    if (skillInput) {
      this.useSkill(skillInput);
      this.currentSkillState = skillInput;
    }
    
    // Update character sprite
    if (this.character === 'melee' && this.warriorSprite) {
      this.warriorSprite.setVelocity(velocityX, velocityY);
      this.warriorSprite.update(movement, this.currentSkillState);
    } else if (this.rangedSprite) {
      this.rangedSprite.setVelocity(velocityX, velocityY);
    }
    
    this.updateCooldowns();
  }

  private useSkill(key: string) {
    const skill = this.skills.find(s => s.key === key);
    if (!skill || skill.currentCooldown > 0 || this.energy < skill.energyCost) return;
    
    this.energy -= skill.energyCost;
    skill.currentCooldown = skill.cooldown;
    
    // Trigger animation for warrior sprite
    if (this.warriorSprite && this.character === 'melee') {
      if (key === 'Q' || skill.id === 'melee_q') {
        this.warriorSprite.triggerAttack('attack1');
      } else if (key === 'W' || skill.id === 'melee_w') {
        this.warriorSprite.triggerAttack('attack2');
      }
    }
    
    switch (skill.type) {
      case 'projectile':
        this.createProjectile(skill);
        break;
      case 'melee':
        this.performMeleeAttack(skill);
        break;
      case 'area':
        this.performAreaAttack(skill);
        break;
      case 'buff':
        this.applyBuff(skill);
        break;
    }
  }

  private createProjectile(skill: Skill) {
    const sprite = this.getPhysicsSprite();
    const projectile = this.scene.physics.add.sprite(
      sprite.x,
      sprite.y,
      'projectile-player'
    );
    
    projectile.setDepth(20);
    
    // Use warrior direction or default
    const direction = this.getProjectileDirection();
    const velocity = GAME_CONFIG.PROJECTILE_SPEED;
    
    projectile.setVelocity(
      Math.cos(direction) * velocity,
      Math.sin(direction) * velocity
    );
    
    projectile.setData('damage', skill.damage);
    projectile.setData('skill', skill);
    
    this.scene.time.delayedCall(skill.range! / velocity * 1000, () => {
      if (projectile.active) {
        projectile.destroy();
      }
    });
  }

  private getProjectileDirection(): number {
    if (this.warriorSprite) {
      const direction = this.warriorSprite.getCurrentDirection();
      switch (direction) {
        case 'right': return 0;
        case 'down': return Math.PI / 2;
        case 'left': return Math.PI;
        case 'up': return -Math.PI / 2;
        default: return 0;
      }
    }
    return 0;
  }

  private performMeleeAttack(skill: Skill) {
    const sprite = this.getPhysicsSprite();
    const attackRange = skill.range || 80;
    const direction = this.getProjectileDirection();
    
    const hitX = sprite.x + Math.cos(direction) * attackRange * 0.5;
    const hitY = sprite.y + Math.sin(direction) * attackRange * 0.5;
    
    const attackArea = this.scene.add.circle(hitX, hitY, attackRange, COLORS.PLAYER, 0.3);
    attackArea.setDepth(40);
    
    // Check for enemy hits
    const scene = this.scene as PvEHordeScene;
    scene.getEnemies().forEach((enemy: OrcSprite) => {
      if (enemy.isAlive()) {
        const enemySprite = enemy.getPhysicsSprite();
        const distance = Phaser.Math.Distance.Between(
          hitX, hitY, 
          enemySprite.x, enemySprite.y
        );
        
        if (distance <= attackRange) {
          enemy.takeDamage(skill.damage || 25);
          
          // Check if enemy dies
          if (!enemy.isAlive()) {
            enemy.die();
            this.gainExperience(10);
          }
        }
      }
    });
    
    this.scene.time.delayedCall(200, () => {
      attackArea.destroy();
    });
  }

  private performAreaAttack(skill: Skill) {
    const sprite = this.getPhysicsSprite();
    const areaSize = skill.range || 120;
    
    const attackArea = this.scene.add.circle(
      sprite.x, 
      sprite.y, 
      areaSize, 
      COLORS.PLAYER, 
      0.4
    );
    attackArea.setDepth(40);
    
    this.scene.tweens.add({
      targets: attackArea,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      duration: 500,
      onComplete: () => attackArea.destroy()
    });
  }

  private applyBuff(skill: Skill) {
    const sprite = this.getPhysicsSprite();
    const buffEffect = this.scene.add.circle(sprite.x, sprite.y, 40, 0x44ff44, 0.5);
    buffEffect.setDepth(40);
    
    this.scene.tweens.add({
      targets: buffEffect,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 1000,
      onComplete: () => buffEffect.destroy()
    });
  }

  private updateCooldowns() {
    const deltaTime = this.scene.game.loop.delta;
    
    this.skills.forEach(skill => {
      if (skill.currentCooldown > 0) {
        skill.currentCooldown = Math.max(0, skill.currentCooldown - deltaTime);
      }
    });
  }

  private regenerateEnergy() {
    if (this.energy < this.maxEnergy) {
      this.energy = Math.min(this.maxEnergy, this.energy + GAME_CONFIG.ENERGY_REGEN_RATE / 10);
    }
  }

  public getPhysicsSprite(): Phaser.Physics.Arcade.Sprite {
    return this.warriorSprite?.getPhysicsSprite() || this.rangedSprite!;
  }

  public takeDamage(damage: number) {
    this.health = Math.max(0, this.health - damage);
    
    const sprite = this.getPhysicsSprite();
    sprite.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      sprite.clearTint();
    });
  }

  public gainExperience(exp: number) {
    this.experience += exp;
    
    const expNeeded = this.level * 100;
    if (this.experience >= expNeeded) {
      this.levelUp();
    }
  }

  private levelUp() {
    this.level++;
    this.experience = 0;
    
    this.maxHealth += 10;
    this.health = this.maxHealth;
    this.maxEnergy += 5;
    this.energy = this.maxEnergy;
    
    const sprite = this.getPhysicsSprite();
    const levelUpText = this.scene.add.text(
      sprite.x,
      sprite.y - 50,
      `LEVEL ${this.level}!`,
      { fontSize: '24px', color: '#ffff00' }
    );
    levelUpText.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: levelUpText,
      y: levelUpText.y - 100,
      alpha: 0,
      duration: 2000,
      onComplete: () => levelUpText.destroy()
    });
  }

  public isDead(): boolean {
    return this.health <= 0;
  }

  public getStats() {
    return {
      health: this.health,
      maxHealth: this.maxHealth,
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      level: this.level,
      experience: this.experience,
      skills: this.skills
    };
  }

  public destroy() {
    if (this.warriorSprite) {
      this.warriorSprite.destroy();
    }
    if (this.rangedSprite) {
      this.rangedSprite.destroy();
    }
  }
}