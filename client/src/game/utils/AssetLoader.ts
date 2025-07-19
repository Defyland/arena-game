import { LAYERS } from './Constants';

export class AssetLoader {
  static preloadAssets(scene: Phaser.Scene) {
    // Carregar o background map.png
    scene.load.image('background-map', '/assets/map.png');
    
    // Carregar sprites do guerreiro (warrior)
    this.loadWarriorSprites(scene);
    
    // Carregar sprites do orc
    this.loadOrcSprites(scene);
    
    // Adicionar listener para verificar carregamento
    scene.load.on('complete', () => {
      console.log('Assets carregados com sucesso');
    });
    
    scene.load.on('filecomplete', (key: string) => {
      if (key === 'background-map') {
        console.log('Background map carregado:', key);
      } else if (key.startsWith('warrior-')) {
        console.log('Warrior sprite carregado:', key);
      } else if (key.startsWith('Orc-')) {
        console.log('Orc sprite carregado:', key);
      }
    });
    
    // Player sprites para ranged (mantém o placeholder por enquanto)
    scene.add.graphics()
      .fillStyle(0x0088ff)
      .fillRect(0, 0, 32, 32)
      .generateTexture('player-ranged', 32, 32);

    // Enemy sprites (placeholder)
    scene.add.graphics()
      .fillStyle(0xff4444)
      .fillCircle(16, 16, 12)
      .generateTexture('enemy-basic', 32, 32);
      
    scene.add.graphics()
      .fillStyle(0xff8844)
      .fillCircle(16, 16, 16)
      .generateTexture('enemy-elite', 32, 32);
      
    scene.add.graphics()
      .fillStyle(0xff0044)
      .fillCircle(20, 20, 18)
      .generateTexture('enemy-boss', 40, 40);

    // Projectile sprites (placeholder)
    scene.add.graphics()
      .fillStyle(0x44ff44)
      .fillCircle(4, 4, 3)
      .generateTexture('projectile-player', 8, 8);
      
    scene.add.graphics()
      .fillStyle(0xff4444)
      .fillCircle(4, 4, 3)
      .generateTexture('projectile-enemy', 8, 8);
      
    // Effect sprites (placeholder)
    scene.add.graphics()
      .fillStyle(0xffff44, 0.7)
      .fillCircle(16, 16, 14)
      .generateTexture('explosion', 32, 32);
  }

  private static loadWarriorSprites(scene: Phaser.Scene) {
    // Dimensões corretas: 96x80px por frame
    const frameWidth = 96;
    const frameHeight = 80;
    
    // Carregar sprites de IDLE como spritesheets
    scene.load.spritesheet('warrior-idle-up', '/assets/sprites_warrior/IDLE/idle_up.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-idle-down', '/assets/sprites_warrior/IDLE/idle_down.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-idle-left', '/assets/sprites_warrior/IDLE/idle_left.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-idle-right', '/assets/sprites_warrior/IDLE/idle_right.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    
    // Carregar sprites de RUN como spritesheets
    scene.load.spritesheet('warrior-run-up', '/assets/sprites_warrior/RUN/run_up.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-run-down', '/assets/sprites_warrior/RUN/run_down.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-run-left', '/assets/sprites_warrior/RUN/run_left.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-run-right', '/assets/sprites_warrior/RUN/run_right.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    
    // Carregar sprites de ATTACK 1 como spritesheets
    scene.load.spritesheet('warrior-attack1-up', '/assets/sprites_warrior/ATTACK 1/attack1_up.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-attack1-down', '/assets/sprites_warrior/ATTACK 1/attack1_down.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-attack1-left', '/assets/sprites_warrior/ATTACK 1/attack1_left.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-attack1-right', '/assets/sprites_warrior/ATTACK 1/attack1_right.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    
    // Carregar sprites de ATTACK 2 como spritesheets
    scene.load.spritesheet('warrior-attack2-up', '/assets/sprites_warrior/ATTACK 2/attack2_up.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-attack2-down', '/assets/sprites_warrior/ATTACK 2/attack2_down.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-attack2-left', '/assets/sprites_warrior/ATTACK 2/attack2_left.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    scene.load.spritesheet('warrior-attack2-right', '/assets/sprites_warrior/ATTACK 2/attack2_right.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
  }

  private static loadOrcSprites(scene: Phaser.Scene) {
    // Dimensões dos sprites de orc (verificar dimensões reais)
    const frameWidth = 96;
    const frameHeight = 80;
    
    // Carregar sprites de orc como spritesheets
    scene.load.spritesheet('Orc-Idle', '/assets/sprites_orc/IDLE/Orc-Idle.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    
    scene.load.spritesheet('Orc-Walk', '/assets/sprites_orc/RUN/Orc-Walk.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    
    scene.load.spritesheet('Orc-Attack01', '/assets/sprites_orc/ATTACK 1/Orc-Attack01.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    
    scene.load.spritesheet('Orc-Attack02', '/assets/sprites_orc/ATTACK 2/Orc-Attack02.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    
    scene.load.spritesheet('Orc-Hurt', '/assets/sprites_orc/HURT/Orc-Hurt.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
    
    scene.load.spritesheet('Orc-Death', '/assets/sprites_orc/DEATH/Orc-Death.png', {
      frameWidth: frameWidth,
      frameHeight: frameHeight
    });
  }

  static createTiledBackground(scene: Phaser.Scene, width: number, height: number) {
    // Verificar se a textura foi carregada
    if (!scene.textures.exists('background-map')) {
      console.warn('Textura background-map não encontrada, usando fallback');
      return AssetLoader.createFallbackBackground(scene, width, height);
    }
    
    // Obter informações reais da textura
    const texture = scene.textures.get('background-map');
    const mapWidth = texture.source[0].width;
    const mapHeight = texture.source[0].height;
    
    console.log(`Dimensões do mapa: ${mapWidth}x${mapHeight}`);
    
    // Container para o background estático
    const backgroundContainer = scene.add.container(0, 0);
    backgroundContainer.setDepth(LAYERS.BACKGROUND);
    
    // Calcular escala para cobrir a área adequadamente
    const targetSize = 400; // Tamanho desejado para cada tile
    const mapScale = targetSize / Math.max(mapWidth, mapHeight);
    
    // Calcular quantas cópias precisamos
    const scaledSize = Math.max(mapWidth, mapHeight) * mapScale;
    const tilesX = Math.ceil(width / scaledSize) + 1;
    const tilesY = Math.ceil(height / scaledSize) + 1;
    
    // Criar grid simples de imagens estáticas
    for (let x = 0; x < tilesX; x++) {
      for (let y = 0; y < tilesY; y++) {
        const mapImage = scene.add.image(
          x * scaledSize, 
          y * scaledSize, 
          'background-map'
        );
        
        mapImage.setScale(mapScale);
        mapImage.setAlpha(0.7); // Opacidade fixa
        mapImage.setOrigin(0, 0); // Alinhar pelo canto superior esquerdo
        
        backgroundContainer.add(mapImage);
      }
    }
    
    return backgroundContainer;
  }

  // Fallback caso a imagem não carregue
  static createFallbackBackground(scene: Phaser.Scene, width: number, height: number) {
    const graphics = scene.add.graphics();
    const tileSize = 64;
    
    for (let x = 0; x < width; x += tileSize) {
      for (let y = 0; y < height; y += tileSize) {
        const isEven = (Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2;
        graphics.fillStyle(isEven ? 0x111111 : 0x222222);
        graphics.fillRect(x, y, tileSize, tileSize);
      }
    }
    
    return graphics;
  }

  static createParticleEffects(scene: Phaser.Scene) {
    // Criar sistemas de partículas para efeitos
    const damageParticles = scene.add.particles(0, 0, 'explosion', {
      scale: { start: 0.3, end: 0 },
      alpha: { start: 1, end: 0 },
      speed: { min: 50, max: 100 },
      lifespan: 300,
      quantity: 5
    });
    
    const healParticles = scene.add.particles(0, 0, 'heal-effect', {
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.8, end: 0 },
      speed: { min: 20, max: 50 },
      lifespan: 500,
      quantity: 3,
      gravityY: -100
    });
    
    return {
      damage: damageParticles,
      heal: healParticles
    };
  }
}