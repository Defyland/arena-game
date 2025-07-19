export interface Player {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  level: number;
  experience: number;
  character: 'melee' | 'ranged';
  skills: Skill[];
  isMoving: boolean;
  direction: number; // radians
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  type: 'basic' | 'elite' | 'boss';
  damage: number;
  speed: number;
}

export interface Skill {
  id: string;
  name: string;
  energyCost: number;
  cooldown: number;
  currentCooldown: number;
  damage?: number;
  range?: number;
  type: 'projectile' | 'melee' | 'area' | 'buff';
  key: 'Q' | 'W' | 'E' | 'R';
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  playerSpeed: number;
  tickRate: number;
}

export interface NetworkMessage {
  type: string;
  data: any;
  timestamp: number;
} 