export interface ServerToClientEvents {
  playerMove: (data: { id: string; x: number; y: number; direction: number }) => void;
  playerSkill: (data: { id: string; skillId: string; x: number; y: number; direction: number }) => void;
  enemySpawn: (data: { id: string; x: number; y: number; type: string }) => void;
  enemyMove: (data: { id: string; x: number; y: number }) => void;
  playerJoin: (data: { id: string; character: string; x: number; y: number }) => void;
  playerLeave: (data: { id: string }) => void;
  gameState: (data: any) => void;
  damage: (data: { targetId: string; damage: number; sourceId?: string }) => void;
  death: (data: { id: string; isPlayer: boolean }) => void;
}

export interface ClientToServerEvents {
  joinGame: (data: { gameMode: 'pvp' | 'pve'; character: 'melee' | 'ranged' }) => void;
  playerMove: (data: { x: number; y: number; direction: number }) => void;
  playerSkill: (data: { skillId: string; x: number; y: number; direction: number }) => void;
  leaveGame: () => void;
}

export interface NetworkState {
  connected: boolean;
  playerId?: string;
  ping: number;
} 