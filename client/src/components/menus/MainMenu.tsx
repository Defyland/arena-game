import React from 'react';
import { GameState } from '../../App';

interface MainMenuProps {
  onStateChange: (state: GameState) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStateChange }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <div className="game-menu text-center space-y-8">
        <h1 className="text-6xl font-bold text-game-accent mb-8 tracking-wider">
          GEMINI
        </h1>
        <p className="text-xl text-gray-300 mb-12">
          Batalhas Épicas Te Aguardam
        </p>
        
        <div className="space-y-4">
          <button 
            className="game-button w-64 text-xl"
            onClick={() => onStateChange('character-select')}
          >
            🎮 Jogar
          </button>
          
          <button 
            className="game-button w-64 text-xl bg-game-secondary hover:bg-blue-700"
          >
            ⚙️ Configurações
          </button>
          
          <button 
            className="game-button w-64 text-xl bg-gray-700 hover:bg-gray-600"
          >
            📊 Estatísticas
          </button>
        </div>
        
        <div className="mt-12 text-gray-500 text-sm">
          <p>Use WASD ou setas para mover</p>
          <p>Q, W, E, R para habilidades</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu; 