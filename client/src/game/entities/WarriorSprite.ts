import Phaser from 'phaser';

export type WarriorDirection = 'up' | 'down' | 'left' | 'right';
export type WarriorState = 'idle' | 'run' | 'attack1' | 'attack2';

interface StateTransition {
  canTransitionTo: WarriorState[];
  priority: number;
}

export class WarriorSprite {
  private sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private currentState: WarriorState = 'idle';
  private currentDirection: WarriorDirection = 'down';
  private attackEndTime: number = 0;
  private attackDuration: number = 300;
  
  private readonly stateMachine: Record<WarriorState, StateTransition> = {
    idle: { canTransitionTo: ['run', 'attack1', 'attack2'], priority: 0 },
    run: { canTransitionTo: ['idle', 'attack1', 'attack2'], priority: 1 },
    attack1: { canTransitionTo: ['idle', 'run'], priority: 3 },
    attack2: { canTransitionTo: ['idle', 'run'], priority: 3 }
  }

  private getFrameRate(state: WarriorState): number {
    switch (state) {
      case 'idle': return 4;
      case 'run': return 10;
      case 'attack1': return 16;
      case 'attack2': return 16;
      default: return 8;
    }
  };

  // Frame counts reais dos sprites
  private readonly spriteFrameData = {
    idle: 8,
    run: 8, 
    attack1: 8,
    attack2: 8,
    heal: 12,
    hurt: 4,
    dash: 7,
    death: 7
  };

  private frameConfig: Record<string, { frames: number; frameRate: number }> = {};

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'warrior-idle-down', 0);
    this.sprite.setDepth(30);
    this.sprite.setScale(3); // Aumentar tamanho visual
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body!.setSize(22, 34); // Manter hitbox original
    
    this.createAnimations();
  }

  getPhysicsSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  update(movement: { x: number; y: number }, currentSkillState: string | null) {
    const isMoving = movement.x !== 0 || movement.y !== 0;
    const previousState = this.currentState;
    const previousDirection = this.currentDirection;
    
    // Update attack timer first
    if (this.attackEndTime > 0) {
      this.updateAttackTimer();
    }
    
    // Update direction only when moving
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
    this.sprite.setVelocity(x, y);
  }

  private updateDirection(rotation: number) {
    const degrees = (rotation * 180 / Math.PI + 360) % 360;
    const newDirection = this.calculateDirection(degrees);
    
    if (newDirection !== this.currentDirection) {
      this.currentDirection = newDirection;
      this.updateAnimation();
    }
  }

  private calculateDirection(degrees: number): WarriorDirection {
    if (degrees >= 315 || degrees < 45) return 'right';
    if (degrees >= 45 && degrees < 135) return 'down';
    if (degrees >= 135 && degrees < 225) return 'left';
    return 'up';
  }

  private calculateNewState(isMoving: boolean, skillState: string | null): WarriorState {
    // Attack states have highest priority
    if (this.attackEndTime > this.scene.time.now) {
      return this.currentState;
    }
    
    if (skillState === 'Q' || skillState === 'melee_q') {
      return 'attack1';
    }
    
    if (skillState === 'W' || skillState === 'melee_w') {
      return 'attack2';
    }
    
    return isMoving ? 'run' : 'idle';
  }

  private canTransition(from: WarriorState, to: WarriorState): boolean {
    return this.stateMachine[from].canTransitionTo.includes(to);
  }

  private transitionToState(newState: WarriorState) {
    this.currentState = newState;
    
    // Set attack timer for attack states
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

  private updateAnimation() {
    const animKey = `warrior-${this.currentState}-${this.currentDirection}`;
    this.playAnimation(animKey);
  }

  private createAnimations() {
    const states: WarriorState[] = ['idle', 'run', 'attack1', 'attack2'];
    const directions: WarriorDirection[] = ['up', 'down', 'left', 'right'];
    
    states.forEach(state => {
      directions.forEach(direction => {
        const animKey = `warrior-${state}-${direction}`;
        
        if (!this.scene.anims.exists(animKey)) {
          try {
            // Usar dados reais dos sprites
            const frameCount = this.spriteFrameData[state as keyof typeof this.spriteFrameData] || 8;
            
            console.log(`${animKey}: usando ${frameCount} frames`);
            
            // Armazenar configuração
            this.frameConfig[animKey] = {
              frames: frameCount,
              frameRate: this.getFrameRate(state)
            };
            
            // Criar animações otimizadas
            if (state === 'idle') {
              // IDLE: usar apenas frames 0-2 para movimento sutil
              this.scene.anims.create({
                key: animKey,
                frames: this.scene.anims.generateFrameNumbers(animKey, { start: 0, end: 2 }),
                frameRate: 4,
                repeat: -1
              });
            }
            else if (state === 'run') {
              // RUN: usar frames 0-5 para movimento suave
              this.scene.anims.create({
                key: animKey,
                frames: this.scene.anims.generateFrameNumbers(animKey, { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1
              });
            }
            else {
              // ATTACK: usar todos os frames
              this.scene.anims.create({
                key: animKey,
                frames: this.scene.anims.generateFrameNumbers(animKey, { 
                  start: 0, 
                  end: frameCount - 1 
                }),
                frameRate: this.getFrameRate(state),
                repeat: 0
              });
            }
          } catch (error) {
            console.warn(`Animation creation failed: ${animKey}`, error);
          }
        }
      });
    });
  }

  private playAnimation(key: string) {
    if (this.scene.anims.exists(key)) {
      const currentAnim = this.sprite.anims.currentAnim?.key;
      
      if (currentAnim !== key) {
        this.sprite.anims.play(key, true);
      }
    } else {
      console.warn(`Animation not found: ${key}`);
      if (this.scene.textures.exists(key)) {
        this.sprite.setTexture(key, 0);
      } else {
        this.sprite.setFrame(0);
      }
    }
  }

  triggerAttack(attackType: 'attack1' | 'attack2') {
    if (this.canTransition(this.currentState, attackType)) {
      this.transitionToState(attackType);
    }
  }

  // Getters
  get x(): number { return this.sprite.x; }
  get y(): number { return this.sprite.y; }
  get rotation(): number { return this.sprite.rotation; }
  
  // Setters
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

  getCurrentDirection(): WarriorDirection {
    return this.currentDirection;
  }

  getCurrentState(): WarriorState {
    return this.currentState;
  }

  destroy() {
    this.sprite.destroy();
  }
}