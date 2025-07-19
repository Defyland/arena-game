import React, { useState, useEffect } from 'react';

interface GameHUDProps {
  onBackToMenu: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({ onBackToMenu }) => {
  const [playerStats, setPlayerStats] = useState({
    health: 100,
    maxHealth: 100,
    energy: 80,
    maxEnergy: 80,
    level: 1,
    experience: 0,
    maxExperience: 100
  });

  const [skills, setSkills] = useState([
    { key: 'Q', cooldown: 0, maxCooldown: 3000 },
    { key: 'W', cooldown: 0, maxCooldown: 5000 },
    { key: 'E', cooldown: 0, maxCooldown: 8000 },
    { key: 'R', cooldown: 0, maxCooldown: 10000 }
  ]);

  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMenu(!showMenu);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showMenu]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <div className="game-menu space-y-2 min-w-[200px]">
          {/* Health Bar */}
          <div className="flex items-center space-x-2">
            <span className="text-red-400 text-sm w-8">❤️</span>
            <div className="flex-1 bg-gray-700 rounded-full h-3">
              <div 
                className="health-bar h-full" 
                style={{ width: `${(playerStats.health / playerStats.maxHealth) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-300">
              {playerStats.health}/{playerStats.maxHealth}
            </span>
          </div>

          {/* Energy Bar */}
          <div className="flex items-center space-x-2">
            <span className="text-blue-400 text-sm w-8">⚡</span>
            <div className="flex-1 bg-gray-700 rounded-full h-3">
              <div 
                className="energy-bar h-full" 
                style={{ width: `${(playerStats.energy / playerStats.maxEnergy) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-300">
              {playerStats.energy}/{playerStats.maxEnergy}
            </span>
          </div>

          {/* Experience Bar */}
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400 text-sm w-8">⭐</span>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-full rounded-full transition-all duration-300" 
                style={{ width: `${(playerStats.experience / playerStats.maxExperience) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-300">
              Nv.{playerStats.level}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom HUD - Skills */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="flex space-x-3">
          {skills.map((skill, index) => (
            <div key={skill.key} className="relative">
              <div 
                className={`skill-button ${skill.cooldown > 0 ? 'cooldown' : ''}`}
              >
                {skill.key}
              </div>
              
              {/* Cooldown overlay */}
              {skill.cooldown > 0 && (
                <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-white">
                    {Math.ceil(skill.cooldown / 1000)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pause Menu */}
      {showMenu && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <div className="game-menu text-center space-y-6">
            <h2 className="text-3xl font-bold text-game-accent">Pausa</h2>
            
            <div className="space-y-3">
              <button 
                className="game-button w-48"
                onClick={() => setShowMenu(false)}
              >
                Continuar
              </button>
              
              <button 
                className="game-button w-48 bg-gray-700 hover:bg-gray-600"
              >
                Configurações
              </button>
              
              <button 
                className="game-button w-48 bg-red-700 hover:bg-red-600"
                onClick={onBackToMenu}
              >
                Sair do Jogo
              </button>
            </div>
            
            <p className="text-sm text-gray-400">
              Pressione ESC para continuar
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameHUD; 