import React, { useState } from 'react';
import { GameState, Character } from '../../App';
import { CHARACTERS } from '../../types/Player';

interface CharacterSelectProps {
  onCharacterSelect: (character: Character) => void;
  onStateChange: (state: GameState) => void;
}

const CharacterSelect: React.FC<CharacterSelectProps> = ({ 
  onCharacterSelect, 
  onStateChange 
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>('melee');
  const [selectedMode, setSelectedMode] = useState<'pvp' | 'pve'>('pve');

  const handleStartGame = () => {
    onCharacterSelect(selectedCharacter);
    onStateChange(selectedMode);
  };

  const characterData = CHARACTERS[selectedCharacter];

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="flex space-x-8">
        {/* Character Selection */}
        <div className="game-menu">
          <h2 className="text-3xl font-bold text-game-accent mb-6">
            Escolha seu Personagem
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {(Object.keys(CHARACTERS) as Character[]).map((char) => (
              <button
                key={char}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCharacter === char
                    ? 'border-game-accent bg-game-accent/20'
                    : 'border-gray-600 bg-gray-800 hover:border-gray-400'
                }`}
                onClick={() => setSelectedCharacter(char)}
              >
                <div className="text-2xl mb-2">
                  {char === 'melee' ? '⚔️' : '🏹'}
                </div>
                <h3 className="font-bold text-white">
                  {CHARACTERS[char].name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {CHARACTERS[char].description}
                </p>
              </button>
            ))}
          </div>

          {/* Game Mode Selection */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Modo de Jogo</h3>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-lg ${
                  selectedMode === 'pve'
                    ? 'bg-game-primary text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedMode('pve')}
              >
                🧟 PvE (Hordas)
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  selectedMode === 'pvp'
                    ? 'bg-game-primary text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setSelectedMode('pvp')}
              >
                ⚔️ PvP (Arena)
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              className="game-button flex-1"
              onClick={handleStartGame}
            >
              Iniciar Batalha
            </button>
            <button 
              className="game-button bg-gray-700 hover:bg-gray-600"
              onClick={() => onStateChange('menu')}
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Character Details */}
        <div className="game-menu min-w-[300px]">
          <h3 className="text-2xl font-bold text-game-accent mb-4">
            {characterData.name}
          </h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Vida:</span>
              <span className="text-red-400">{characterData.health}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Energia:</span>
              <span className="text-blue-400">{characterData.energy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Velocidade:</span>
              <span className="text-green-400">{characterData.speed}</span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-bold text-white mb-3">Habilidades</h4>
            <div className="space-y-2">
              {characterData.skills.map((skill) => (
                <div key={skill.id} className="bg-gray-800 p-2 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-game-accent">
                      {skill.key} - {skill.name}
                    </span>
                    <span className="text-blue-400">{skill.energyCost} EN</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Cooldown: {skill.cooldown / 1000}s
                    {skill.damage && ` • Dano: ${skill.damage}`}
                    {skill.range && ` • Alcance: ${skill.range}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect; 