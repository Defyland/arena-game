export const CHARACTERS = {
  melee: {
    name: 'Guerreiro',
    description: 'Especialista em combate corpo a corpo',
    health: 120,
    energy: 80,
    speed: 150,
    skills: [
      {
        id: 'melee_q',
        name: 'Investida',
        key: 'Q' as const,
        energyCost: 20,
        cooldown: 3000,
        damage: 40,
        range: 100,
        type: 'melee' as const
      },
      {
        id: 'melee_w',
        name: 'Golpe Giratório',
        key: 'W' as const,
        energyCost: 30,
        cooldown: 5000,
        damage: 35,
        range: 80,
        type: 'area' as const
      },
      {
        id: 'melee_e',
        name: 'Fúria',
        key: 'E' as const,
        energyCost: 25,
        cooldown: 8000,
        damage: 0,
        type: 'buff' as const
      },
      {
        id: 'melee_r',
        name: 'Salto Devastador',
        key: 'R' as const,
        energyCost: 40,
        cooldown: 10000,
        damage: 80,
        range: 150,
        type: 'area' as const
      }
    ]
  },
  ranged: {
    name: 'Arqueiro',
    description: 'Especialista em ataques à distância',
    health: 80,
    energy: 120,
    speed: 120,
    skills: [
      {
        id: 'ranged_q',
        name: 'Tiro Perfurante',
        key: 'Q' as const,
        energyCost: 15,
        cooldown: 2000,
        damage: 30,
        range: 300,
        type: 'projectile' as const
      },
      {
        id: 'ranged_w',
        name: 'Chuva de Flechas',
        key: 'W' as const,
        energyCost: 35,
        cooldown: 6000,
        damage: 25,
        range: 200,
        type: 'area' as const
      },
      {
        id: 'ranged_e',
        name: 'Tiro Explosivo',
        key: 'E' as const,
        energyCost: 25,
        cooldown: 4000,
        damage: 50,
        range: 250,
        type: 'projectile' as const
      },
      {
        id: 'ranged_r',
        name: 'Rajada Mortal',
        key: 'R' as const,
        energyCost: 50,
        cooldown: 12000,
        damage: 40,
        range: 350,
        type: 'projectile' as const
      }
    ]
  }
} as const;

export type CharacterType = keyof typeof CHARACTERS; 