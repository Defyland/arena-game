import Phaser from 'phaser';

export type OrcDirection = 'up' | 'down' | 'left' | 'right';
export type OrcState = 'idle' | 'run' | 'attack1' | 'attack2' | 'hurt' | 'death';

interface StateTransition {
  canTransitionTo: OrcState[];
  priority: number;
}

export class OrcSprite {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private currentState: OrcState = 'idle';
  private currentDirection: OrcDirection = 'down';
  private attackEndTime: number = 0;
  private attackDuration: number = 400;
  private hurtEndTime: number = 0;
  private hurtDuration: number = 200;
  private isDead: boolean = false;
  
  private readonly stateMachine: Record<OrcState, StateTransition> = {
    idle: { canTransitionTo: ['run', 'attack1', 'attack2', 'hurt', 'death'], priority: 0 },
    run: { canTransitionTo: ['idle', 'attack1', 'attack2', 'hurt', 'death'], priority: 1 },
    attack1: { canTransitionTo: ['idle', 'run', 'hurt', 'death'], priority: 3 },
    attack2: { canTransitionTo: ['idle', 'run', 'hurt', 'death'], priority: 3 },
    hurt: { canTransitionTo: ['idle', 'run', 'death'], priority: 2 },
    death: { canTransitionTo: [], priority: 4 }
  }

  private getFrameRate(state: OrcState): number {
    switch (state) {
      case 'idle': return 3;
      case 'run': return 8;
      case 'attack1': return 12;
      case 'attack2': return 12;
      case 'hurt': return 6;
      case 'death': return 4;
      default: return 6;
    }
  }

  // Frame counts based on actual sprite files
  private readonly spriteFrameData = {
    idle: 8,
    run: 8,
    attack1: 6, // Orc-Attack01 has only 6 frames
    attack2: 6, // Orc-Attack02 has only 6 frames
    hurt: 4,
    death: 4    // Orc-Death has only 4 frames
  };

  // Texture key mapping to actual file names
  private readonly textureKeys = {
    idle: 'Orc-Idle',
    run: 'Orc-Walk',
    attack1: 'Orc-Attack01',
    attack2: 'Orc-Attack02',
    hurt: 'Orc-Hurt',
    death: 'Orc-Death'
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    
    // Use fallback texture if orc textures not loaded
    const textureKey = scene.textures.exists(this.textureKeys.idle) ? this.textureKeys.idle : 'enemy-basic';
    this.sprite = scene.physics.add.sprite(x, y, textureKey, 0);
    this.sprite.setDepth(25);
    this.sprite.setScale(2.5);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body!.setSize(24, 32);
    
    // Only create animations if textures exist
    if (scene.textures.exists(this.textureKeys.idle)) {
      this.createAnimations();
    }
  }

  getPhysicsSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  update(movement: { x: number; y: number }, currentSkillState: string | null) {
    if (this.isDead || !this.sprite.active) return;
    
    const isMoving = movement.x !== 0 || movement.y !== 0;
    
    // Update timers
    if (this.attackEndTime > 0) {
      this.updateAttackTimer();
    }
    
    if (this.hurtEndTime > 0) {
      this.updateHurtTimer();
    }
    
    // Update direction for sprite flipping
    if (isMoving) {
      const rotation = Math.atan2(movement.y, movement.x);
      this.updateDirection(rotation);
    }
    
    // Calculate new state
    const newState = this.calculateNewState(isMoving, currentSkillState);
    
    // Update if state changed
    if (newState !== this.currentState) {
      if (this.canTransition(this.currentState, newState)) {
        this.transitionToState(newState);
      }
    }
  }

  setVelocity(x: number, y: number) {
    if (!this.isDead && this.sprite.active && this.sprite.body) {
      this.sprite.setVelocity(x, y);
    }
  }

  private updateDirection(rotation: number) {
    const degrees = (rotation * 180 / Math.PI + 360) % 360;
    const newDirection = this.calculateDirection(degrees);
    
    if (newDirection !== this.currentDirection) {
      this.currentDirection = newDirection;
      this.updateSpriteFlip();
    }
  }

  private calculateDirection(degrees: number): OrcDirection {
    if (degrees >= 315 || degrees < 45) return 'right';
    if (degrees >= 45 && degrees < 135) return 'down';
    if (degrees >= 135 && degrees < 225) return 'left';
    return 'up';
  }

  private updateSpriteFlip() {
    // Flip sprite based on direction since we don't have directional sprites
    this.sprite.setFlipX(this.currentDirection === 'left');
  }

  private calculateNewState(isMoving: boolean, skillState: string | null): OrcState {
    if (this.isDead) return 'death';
    if (this.hurtEndTime > this.scene.time.now) return 'hurt';
    if (this.attackEndTime > this.scene.time.now) return this.currentState;
    
    if (skillState === 'attack1' || Math.random() < 0.01) return 'attack1';
    if (skillState === 'attack2' || Math.random() < 0.005) return 'attack2';
    
    return isMoving ? 'run' : 'idle';
  }

  private canTransition(from: OrcState, to: OrcState): boolean {
    return this.stateMachine[from].canTransitionTo.includes(to);
  }

  private transitionToState(newState: OrcState) {
    this.currentState = newState;
    
    if (newState === 'attack1' || newState === 'attack2') {
      this.attackEndTime = this.scene.time.now + this.attackDuration;
    }
    
    this.updateAnimation();
  }

  private updateAttackTimer() {
    if (this.scene.time.now >= this.attackEndTime) {
      this.attackEndTime = 0;
      const newState = this.currentState === 'attack1' || this.currentState === 'attack2' ? 'idle' : this.currentState;
      if (newState !== this.currentState) {
        this.currentState = newState;
        this.updateAnimation();
      }
    }
  }

  private updateHurtTimer() {
    if (this.scene.time.now >= this.hurtEndTime) {
      this.hurtEndTime = 0;
      const newState = this.currentState === 'hurt' ? 'idle' : this.currentState;
      if (newState !== this.currentState) {
        this.currentState = newState;
        this.updateAnimation();
      }
    }
  }

  private updateAnimation() {
    if (this.isDead || !this.scene.textures.exists(this.textureKeys[this.currentState])) {
      return;
    }
    
    const textureKey = this.textureKeys[this.currentState];
    this.playAnimation(textureKey);
  }

  private createAnimations() {
    const states: OrcState[] = ['idle', 'run', 'attack1', 'attack2', 'hurt', 'death'];
    
    states.forEach(state => {
      const textureKey = this.textureKeys[state];
      const animKey = `orc-${state}`;
      
      // Skip if texture doesn't exist or animation already exists
      if (!this.scene.textures.exists(textureKey) || this.scene.anims.exists(animKey)) {
        return;
      }
      
      try {
        // Use hardcoded safe frame counts
        let endFrame: number;
        
        if (state === 'idle') {
          endFrame = 3; // Use 0-3 (4 frames)
          this.scene.anims.create({
            key: animKey,
            frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: endFrame }),
            frameRate: 3,
            repeat: -1
          });
        }
        else if (state === 'run') {
          endFrame = 5; // Use 0-5 (6 frames)
          this.scene.anims.create({
            key: animKey,
            frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: endFrame }),
            frameRate: 8,
            repeat: -1
          });
        }
        else if (state === 'hurt') {
          endFrame = 3; // Use 0-3 (4 frames)
          this.scene.anims.create({
            key: animKey,
            frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: endFrame }),
            frameRate: 6,
            repeat: 0
          });
        }
        else if (state === 'death') {
          endFrame = 3; // Use 0-3 (4 frames max)
          this.scene.anims.create({
            key: animKey,
            frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: endFrame }),
            frameRate: 4,
            repeat: 0
          });
        }
        else if (state === 'attack1' || state === 'attack2') {
          endFrame = 5; // Use 0-5 (6 frames max)
          this.scene.anims.create({
            key: animKey,
            frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 0, end: endFrame }),
            frameRate: this.getFrameRate(state),
            repeat: 0
          });
        }
      } catch (error) {
        console.warn(`Animation creation failed: ${animKey}`, error);
      }
    });
  }

  private playAnimation(textureKey: string) {
    try {
      const animKey = `orc-${this.currentState}`;
      
      if (this.scene.anims.exists(animKey)) {
        const currentAnim = this.sprite.anims.currentAnim?.key;
        
        if (currentAnim !== animKey) {
          this.sprite.anims.play(animKey, true);
          this.updateSpriteFlip();
        }
      } else {
        // Fallback to static texture
        if (this.scene.textures.exists(textureKey)) {
          this.sprite.setTexture(textureKey, 0);
          this.updateSpriteFlip();
        } else {
          // Final fallback to enemy-basic
          if (this.scene.textures.exists('enemy-basic')) {
            this.sprite.setTexture('enemy-basic', 0);
          }
        }
      }
    } catch (error) {
      // Silent fallback
      if (this.scene.textures.exists('enemy-basic')) {
        this.sprite.setTexture('enemy-basic', 0);
      }
    }
  }

  triggerAttack(attackType: 'attack1' | 'attack2') {
    if (this.canTransition(this.currentState, attackType)) {
      this.transitionToState(attackType);
    }
  }

  takeDamage(damage: number) {
    if (this.isDead) return;
    
    if (this.canTransition(this.currentState, 'hurt')) {
      this.currentState = 'hurt';
      this.hurtEndTime = this.scene.time.now + this.hurtDuration;
      this.updateAnimation();
    }
    
    this.sprite.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (!this.isDead) {
        this.sprite.clearTint();
      }
    });
  }

  die() {
    if (this.isDead) return;
    
    this.isDead = true;
    this.currentState = 'death';
    this.updateAnimation();
    
    this.sprite.body!.enable = false;
    
    this.scene.time.delayedCall(2000, () => {
      this.destroy();
    });
  }

  get x(): number { return this.sprite.x; }
  get y(): number { return this.sprite.y; }
  get rotation(): number { return this.sprite.rotation; }
  
  set x(value: number) { this.sprite.x = value; }
  set y(value: number) { this.sprite.y = value; }
  set rotation(value: number) { this.sprite.rotation = value; }

  setPosition(x: number, y: number) {
    this.sprite.setPosition(x, y);
  }

  setScale(scale: number) {
    this.sprite.setScale(scale);
  }

  setDepth(depth: number) {
    this.sprite.setDepth(depth);
  }

  getCurrentDirection(): OrcDirection {
    return this.currentDirection;
  }

  getCurrentState(): OrcState {
    return this.currentState;
  }

  isAlive(): boolean {
    return !this.isDead;
  }

  destroy() {
    this.sprite.destroy();
  }
}