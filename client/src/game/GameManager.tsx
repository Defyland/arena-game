import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameState, Character } from '../App';
import PvEHordeScene from './scenes/PvEHordeScene';
import PvPArenaScene from './scenes/PvPArenaScene';
import GameHUD from '../components/ui/GameHUD';

interface GameManagerProps {
  gameMode: 'pvp' | 'pve';
  character: Character;
  onStateChange: (state: GameState) => void;
}

const GameManager: React.FC<GameManagerProps> = ({ 
  gameMode, 
  character, 
  onStateChange 
}) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: gameRef.current,
        backgroundColor: '#000000',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0, x: 0 },
            debug: false
          }
        },
        scene: gameMode === 'pvp' ? PvPArenaScene : PvEHordeScene,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        render: {
          pixelArt: false,
          antialias: true
        }
      };

      phaserGameRef.current = new Phaser.Game(config);
      
      // Pass character data to scene
      phaserGameRef.current.registry.set('character', character);
      phaserGameRef.current.registry.set('gameMode', gameMode);
    }

    // Handle window resize
    const handleResize = () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [gameMode, character]);

  const handleBackToMenu = () => {
    onStateChange('menu');
  };

  return (
    <div className="relative w-full h-full">
      <div ref={gameRef} className="w-full h-full" />
      <GameHUD onBackToMenu={handleBackToMenu} />
    </div>
  );
};

export default GameManager; 