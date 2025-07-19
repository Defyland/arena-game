export const GAME_CONFIG = {
  CANVAS_WIDTH: 1920,
  CANVAS_HEIGHT: 1080,
  PLAYER_SPEED: 200,
  PROJECTILE_SPEED: 400,
  TICK_RATE: 60,
  ENERGY_REGEN_RATE: 10, // por segundo
  HEALTH_REGEN_RATE: 0, // por segundo (apenas para PvE upgrades)
} as const;

export const COLORS = {
  PLAYER: 0x00ff00,
  ENEMY_BASIC: 0xff4444,
  ENEMY_ELITE: 0xff8844,
  ENEMY_BOSS: 0xff0044,
  PROJECTILE_PLAYER: 0x44ff44,
  PROJECTILE_ENEMY: 0xff4444,
  HEALTH_BAR: 0xff0000,
  ENERGY_BAR: 0x0044ff,
  UI_BACKGROUND: 0x000000,
  UI_BORDER: 0x444444,
} as const;

export const LAYERS = {
  BACKGROUND: 0,
  ENEMIES: 10,
  PROJECTILES: 20,
  PLAYERS: 30,
  EFFECTS: 40,
  UI: 50,
} as const;

export const KEYS = {
  // Movement
  W: 'W',
  A: 'A', 
  S: 'S',
  D: 'D',
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  
  // Skills
  Q: 'Q',
  E: 'E',
  R: 'R',
  
  // UI
  ESC: 'ESC',
  ENTER: 'ENTER',
  SPACE: 'SPACE',
} as const;

export const SPAWN_CONFIG = {
  PVE: {
    INITIAL_SPAWN_RATE: 2000, // ms
    MIN_SPAWN_RATE: 500,
    SPAWN_RATE_DECREASE: 50, // per wave
    ENEMIES_PER_WAVE: 5,
    WAVE_DURATION: 30000, // ms
    BOSS_EVERY_WAVES: 5,
  },
  PVP: {
    ARENA_SIZE: { width: 1200, height: 800 },
    RESPAWN_TIME: 5000, // ms
  }
} as const; 