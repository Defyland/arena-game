import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

// Interfaces para tipagem
interface Player {
  id: string;
  x: number;
  y: number;
  z: number;
  character: 'warrior' | 'mage';
  rotation: { y: number };
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  lastSkillTime: { q: number; w: number; e: number; r: number };
  isShielded: boolean;
}

interface Projectile {
  id: number;
  x: number;
  y: number;
  z: number;
  owner: string;
  direction: { x: number; z: number };
  speed: number;
  lifespan: number;
}

interface Monster {
  id: number;
  x: number;
  y: number;
  z: number;
  health: number;
  maxHealth: number;
  speed: number;
  attackCooldown: number;
  lastHitBy: string | null;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const players: { [id: string]: Player } = {};
const projectiles: { [id: number]: Projectile } = {};
const monsters: { [id: number]: Monster } = {};
let projectileIdCounter = 0;
let monsterIdCounter = 0;

const SKILL_COSTS: { [key: string]: number } = { q: 10, w: 15, e: 20, r: 50 };
const SKILL_DAMAGE: { [key: string]: number } = { q_mage: 15, q_warrior: 20, r_aoe: 50 };
const SKILL_COOLDOWNS: { [key: string]: number } = { q: 2000, w: 3000, e: 5000, r: 10000 }; // in ms
const MAGE_SHIELD_DURATION = 3000; // ms
const HEAL_AMOUNT = 30;
const DASH_DISTANCE = 5;
const R_AOE_RADIUS = 3;
const MONSTER_ATTACK_DAMAGE = 10;
const MONSTER_ATTACK_COOLDOWN = 2000; // ms
const MONSTER_XP = 30;

const getXpForNextLevel = (level: number) => 100 * Math.pow(level, 1.5);

function spawnMonsters(count: number) {
    for (let i = 0; i < count; i++) {
        const id = monsterIdCounter++;
        monsters[id] = {
            id: id,
            x: Math.random() * 40 - 20,
            y: 0.5,
            z: Math.random() * 40 - 20,
            health: 50,
            maxHealth: 50,
            speed: 0.02,
            attackCooldown: 0,
            lastHitBy: null
        };
    }
    io.emit('monstersCreated', monsters);
}

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('joinGame', (character: 'warrior' | 'mage') => {
    players[socket.id] = {
      x: Math.random() * 6 - 3,
      y: 1.5,
      z: Math.random() * 6 - 3,
      id: socket.id,
      character: character,
      rotation: { y: 0 },
      health: 100,
      maxHealth: 100,
      energy: 100,
      maxEnergy: 100,
      level: 1,
      xp: 0,
      xpToNextLevel: getXpForNextLevel(1),
      lastSkillTime: { q: 0, w: 0, e: 0, r: 0 },
      isShielded: false
    };
    socket.emit('currentPlayers', players);
    socket.emit('monstersCreated', monsters);
    socket.broadcast.emit('newPlayer', players[socket.id]);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    delete players[socket.id];
    io.emit('playerDisconnected', socket.id);
  });

  socket.on('playerMovement', (movementData: { x: number; y: number; z: number; rotation: { y: number } }) => {
    const player = players[socket.id];
    if (player) {
      player.x = movementData.x;
      player.y = movementData.y;
      player.z = movementData.z;
      player.rotation.y = movementData.rotation.y;
      socket.broadcast.emit('playerMoved', player);
    }
  });

  socket.on('skill', (skillData: { id: string; direction?: { x: number; z: number } }) => {
    const player = players[socket.id];
    const now = Date.now();

    if (!player || player.energy < SKILL_COSTS[skillData.id] || now < player.lastSkillTime[skillData.id as keyof typeof player.lastSkillTime]) return;

    player.energy -= SKILL_COSTS[skillData.id];
    player.lastSkillTime[skillData.id as keyof typeof player.lastSkillTime] = now + SKILL_COOLDOWNS[skillData.id];
    io.to(socket.id).emit('playerUpdate', player);
    io.emit('skillUsed', { playerId: socket.id, skillId: skillData.id }); // Emit for visual effects on all clients

    switch (skillData.id) {
      case 'q':
        if (player.character === 'mage') {
          const id = projectileIdCounter++;
          projectiles[id] = {
            id: id, x: player.x, y: player.y, z: player.z, owner: socket.id,
            direction: skillData.direction!, speed: 0.3, lifespan: 100
          };
          io.emit('projectileCreated', projectiles[id]);
        } else if (player.character === 'warrior') {
          for (const targetId in players) {
              if (targetId !== socket.id) {
                  const target = players[targetId];
                  const distance = Math.sqrt(Math.pow(player.x - target.x, 2) + Math.pow(player.z - target.z, 2));
                  if (distance <= 1.7) {
                      target.health = Math.max(0, target.health - SKILL_DAMAGE.q_warrior);
                      io.to(targetId).emit('playerUpdate', target);
                  }
              }
          }
          for (const monsterId in monsters) {
              const monster = monsters[monsterId];
              const distance = Math.sqrt(Math.pow(player.x - monster.x, 2) + Math.pow(player.z - monster.z, 2));
              if (distance <= 1.7) {
                  monster.health -= SKILL_DAMAGE.q_warrior;
                  monster.lastHitBy = socket.id;
              }
          }
        }
        break;
      case 'w':
        if (player.character === 'warrior') {
          // Dash: move player forward
          const angle = player.rotation.y;
          player.x -= Math.sin(angle) * DASH_DISTANCE;
          player.z -= Math.cos(angle) * DASH_DISTANCE;
          io.emit('playerMoved', player); // Update position for all clients
        } else if (player.character === 'mage') {
          // Shield: reduce incoming damage
          player.isShielded = true;
          setTimeout(() => {
            player.isShielded = false;
          }, MAGE_SHIELD_DURATION);
        }
        break;
      case 'e':
        // Heal: restore health
        player.health = Math.min(player.maxHealth, player.health + HEAL_AMOUNT);
        io.to(socket.id).emit('playerUpdate', player);
        break;
      case 'r':
        // AoE damage
        for (const targetId in players) {
            if (targetId !== socket.id) {
                const target = players[targetId];
                const distance = Math.sqrt(Math.pow(player.x - target.x, 2) + Math.pow(player.z - target.z, 2));
                if (distance <= R_AOE_RADIUS) {
                    target.health = Math.max(0, target.health - SKILL_DAMAGE.r_aoe);
                    io.to(targetId).emit('playerUpdate', target);
                }
            }
        }
        for (const monsterId in monsters) {
            const monster = monsters[monsterId];
            const distance = Math.sqrt(Math.pow(player.x - monster.x, 2) + Math.pow(player.z - monster.z, 2));
            if (distance <= R_AOE_RADIUS) {
                monster.health -= SKILL_DAMAGE.r_aoe;
                monster.lastHitBy = socket.id;
            }
        }
        break;
    }
  });
});

const gameLoopInterval = 1000 / 60;
setInterval(() => {
  const now = Date.now();
  // Projéteis
  for (const pId in projectiles) {
    const p = projectiles[pId];
    p.x += p.direction.x * p.speed; p.z += p.direction.z * p.speed; p.lifespan--;
    let hit = false;
    for (const targetId in players) {
        if (targetId !== p.owner) {
            const target = players[targetId];
            if (Math.sqrt(Math.pow(p.x - target.x, 2) + Math.pow(p.z - target.z, 2)) <= 1) {
                target.health = Math.max(0, target.health - SKILL_DAMAGE.q_mage);
                io.to(targetId).emit('playerUpdate', target);
                hit = true; break;
            }
        }
    }
    if (hit) { delete projectiles[pId]; io.emit('projectileDestroyed', pId); continue; }
    for (const monsterId in monsters) {
        const monster = monsters[monsterId];
        if (Math.sqrt(Math.pow(p.x - monster.x, 2) + Math.pow(p.z - monster.z, 2)) <= 1) {
            monster.health -= SKILL_DAMAGE.q_mage;
            monster.lastHitBy = p.owner;
            hit = true; break;
        }
    }
    if (p.lifespan <= 0 || hit) { delete projectiles[pId]; io.emit('projectileDestroyed', pId); }
  }
  if (Object.keys(projectiles).length > 0) io.emit('projectilesUpdate', projectiles);

  // Monstros
  const playerList = Object.values(players);
  for (const mId in monsters) {
      const monster = monsters[mId];
      if (monster.health <= 0) {
          const killer = monster.lastHitBy ? players[monster.lastHitBy] : null;
          if (killer) {
              killer.xp += MONSTER_XP;
              if (killer.xp >= killer.xpToNextLevel) {
                  killer.level++;
                  killer.xp -= killer.xpToNextLevel;
                  killer.xpToNextLevel = getXpForNextLevel(killer.level);
                  killer.maxHealth += 20;
                  killer.maxEnergy += 10;
                  killer.health = killer.maxHealth; // Cura total no level up
                  killer.energy = killer.maxEnergy;
              }
              io.to(killer.id).emit('playerUpdate', killer);
          }
          delete monsters[mId];
          io.emit('monsterDied', mId);
          continue;
      }
      if (playerList.length > 0) {
          let closestPlayer: Player | null = null;
          let minDistance = Infinity;
          for (const player of playerList) {
              const distance = Math.sqrt(Math.pow(monster.x - player.x, 2) + Math.pow(monster.z - player.z, 2));
              if (distance < minDistance) {
                  minDistance = distance;
                  closestPlayer = player;
              }
          }
          if (closestPlayer) {
            if (minDistance <= 1.2 && now > monster.attackCooldown) {
                closestPlayer.health = Math.max(0, closestPlayer.health - MONSTER_ATTACK_DAMAGE);
                io.to(closestPlayer.id).emit('playerUpdate', closestPlayer);
                monster.attackCooldown = now + MONSTER_ATTACK_COOLDOWN;
                io.emit('monsterAttacked', mId);
            } else if (minDistance > 1.2) {
                const dx = closestPlayer.x - monster.x;
                const dz = closestPlayer.z - monster.z;
                const angle = Math.atan2(dz, dx);
                monster.x += Math.cos(angle) * monster.speed;
                monster.z += Math.sin(angle) * monster.speed;
            }
          }
      }
  }
  if (Object.keys(monsters).length > 0) io.emit('monstersUpdate', monsters);

}, gameLoopInterval);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  spawnMonsters(5);
});
