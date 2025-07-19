import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '../utils/Constants';
import { Skill } from '../../types/Game';
import { WarriorSprite } from './WarriorSprite';

export class Player {
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