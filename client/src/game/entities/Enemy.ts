import Phaser from 'phaser';
import { COLORS } from '../utils/Constants';

export class Enemy {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private type: 'basic' | 'elite' | 'boss';
  
  private health: number;
  private maxHealth: number;
  private damage: number;
  private speed: number;
  
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: 'basic' | 'elite' | 'boss'
  ) {
    this.scene = scene;
    this.type = type;
    
    // Set stats based on type
    switch (type) {
      case 'basic':
        this.health = 30;
        this.damage = 10;
        this.speed = 80;
        break;
      case 'elite':
        this.health = 60;
        this.damage = 20;
        this.speed = 100;
        break;
      case 'boss':
        this.health = 200;
        this.damage = 40;
        this.speed = 60;
        break;
    }
    
    this.maxHealth = this.health;
    
    // Create sprite
    const spriteKey = `enemy-${type}`;
    this.sprite = scene.physics.add.sprite(x, y, spriteKey);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDepth(10); // LAYERS.ENEMIES
    
    // Store reference to this enemy in sprite data
    this.sprite.setData('enemy', this);
    
    // Setup physics
    const bodySize = type === 'boss' ? 36 : type === 'elite' ? 30 : 24;
    this.sprite.body!.setSize(bodySize, bodySize);
    
    // Create health bar
    this.createHealthBar();
  }

  private createHealthBar() {
    // Health bar background
    const healthBarBg = this.scene.add.graphics();
    healthBarBg.fillStyle(0x000000);
    healthBarBg.fillRect(-20, -25, 40, 4);
    
    // Health bar foreground
    const healthBarFg = this.scene.add.graphics();
    healthBarFg.fillStyle(COLORS.ENEMY_BASIC);
    healthBarFg.fillRect(-20, -25, 40, 4);
    
    // Attach to sprite
    this.sprite.setData('healthBarBg', healthBarBg);
    this.sprite.setData('healthBarFg', healthBarFg);
    
    this.updateHealthBarPosition();
  }

  private updateHealthBarPosition() {
    const healthBarBg = this.sprite.getData('healthBarBg');
    const healthBarFg = this.sprite.getData('healthBarFg');
    
    if (healthBarBg && healthBarFg) {
      healthBarBg.x = this.sprite.x - 20;
      healthBarBg.y = this.sprite.y - 35;
      
      healthBarFg.x = this.sprite.x - 20;
      healthBarFg.y = this.sprite.y - 35;
    }
  }

  private updateHealthBar() {
    const healthBarFg = this.sprite.getData('healthBarFg');
    if (healthBarFg) {
      healthBarFg.clear();
      
      const healthPercent = this.health / this.maxHealth;
      const color = healthPercent > 0.6 ? COLORS.ENEMY_BASIC :
                   healthPercent > 0.3 ? COLORS.ENEMY_ELITE :
                   COLORS.ENEMY_BOSS;
      
      healthBarFg.fillStyle(color);
      healthBarFg.fillRect(0, 0, 40 * healthPercent, 4);
    }
  }

  update(playerX: number, playerY: number) {
    // Simple AI: move towards player
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x, this.sprite.y,
      playerX, playerY
    );
    
    // Don't move if very close (to prevent overlapping)
    if (distance > 40) {
      const angle = Phaser.Math.Angle.Between(
        this.sprite.x, this.sprite.y,
        playerX, playerY
      );
      
      this.sprite.setVelocity(
        Math.cos(angle) * this.speed,
        Math.sin(angle) * this.speed
      );
      
      // Face the player
      this.sprite.rotation = angle;
    } else {
      this.sprite.setVelocity(0, 0);
    }
    
    // Update health bar position
    this.updateHealthBarPosition();
  }

  public takeDamage(damage: number) {
    this.health = Math.max(0, this.health - damage);
    
    // Visual damage effect
    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      this.sprite.clearTint();
    });
    
    // Update health bar
    this.updateHealthBar();
    
    // Damage number popup
    const damageText = this.scene.add.text(
      this.sprite.x + Phaser.Math.Between(-20, 20),
      this.sprite.y - 30,
      `-${damage}`,
      { 
        fontSize: '16px', 
        color: '#ff4444',
        fontStyle: 'bold'
      }
    );
    damageText.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: damageText,
      y: damageText.y - 50,
      alpha: 0,
      duration: 1000,
      onComplete: () => damageText.destroy()
    });
  }

  public isDead(): boolean {
    return this.health <= 0;
  }

  public getDamage(): number {
    return this.damage;
  }

  public getType(): string {
    return this.type;
  }

  public destroy() {
    // Clean up health bars
    const healthBarBg = this.sprite.getData('healthBarBg');
    const healthBarFg = this.sprite.getData('healthBarFg');
    
    if (healthBarBg) healthBarBg.destroy();
    if (healthBarFg) healthBarFg.destroy();
    
    // Death effect
    const deathEffect = this.scene.add.circle(
      this.sprite.x,
      this.sprite.y,
      20,
      COLORS.ENEMY_BASIC,
      0.7
    );
    
    this.scene.tweens.add({
      targets: deathEffect,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 300,
      onComplete: () => deathEffect.destroy()
    });
    
    // Destroy sprite
    this.sprite.destroy();
  }
} 