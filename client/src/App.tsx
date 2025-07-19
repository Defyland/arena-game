import React, { useState } from 'react';
import MainMenu from './components/menus/MainMenu';
import CharacterSelect from './components/menus/CharacterSelect';
import GameManager from './game/GameManager';

export type GameState = 'menu' | 'character-select' | 'pvp' | 'pve';
export type Character = 'melee' | 'ranged';

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>('melee');

  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState);
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  return (
    <div className="w-screen h-screen bg-black">
      {gameState === 'menu' && (
        <MainMenu onStateChange={handleGameStateChange} />
      )}
      
      {gameState === 'character-select' && (
        <CharacterSelect 
          onCharacterSelect={handleCharacterSelect}
          onStateChange={handleGameStateChange}
        />
      )}
      
      {(gameState === 'pvp' || gameState === 'pve') && (
        <GameManager 
          gameMode={gameState} 
          character={selectedCharacter}
          onStateChange={handleGameStateChange} 
        />
      )}
    </div>
  );
}

export default App; 