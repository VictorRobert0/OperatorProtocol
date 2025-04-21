import React from 'react';
import { Player } from '../types/game';
import { Heart, ShieldAlert, Timer, Crosshair, Target, Skull } from 'lucide-react';

interface GameHUDProps {
  player: Player;
  matchTime: number;
  roundTime: number;
  roundNumber: number;
  attackersScore: number;
  defendersScore: number;
  spikeStatus: 'notPlanted' | 'planted' | 'defused' | 'exploded';
}

const GameHUD: React.FC<GameHUDProps> = ({
  player,
  matchTime,
  roundTime,
  roundNumber,
  attackersScore,
  defendersScore,
  spikeStatus
}) => {
  // Format times as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate health percentage for health bar
  const healthPercentage = (player.health / 100) * 100;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Crosshair className="text-white w-6 h-6 opacity-70" />
      </div>
      
      {/* Top bar - scores and round info */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="ml-2 font-bold">{attackersScore}</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="ml-2 font-bold">{defendersScore}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="text-lg font-bold">Round {roundNumber}</div>
          <div className="flex items-center">
            <Timer className="w-4 h-4 mr-1" />
            <span>{formatTime(roundTime)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {spikeStatus === 'planted' && (
            <div className="bg-red-500 px-2 py-1 rounded-md animate-pulse">
              SPIKE PLANTED
            </div>
          )}
          <div>Match Time: {formatTime(matchTime)}</div>
        </div>
      </div>
      
      {/* Bottom bar - player info */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-between items-center">
        {/* Player health */}
        <div className="flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500" />
          <div className="w-32 bg-gray-700 rounded-full h-3">
            <div 
              className="bg-red-500 rounded-full h-3" 
              style={{ width: `${healthPercentage}%` }}
            ></div>
          </div>
          <span className="font-bold">{player.health}</span>
        </div>
        
        {/* Weapon info */}
        <div className="flex items-center space-x-2">
          <span className="font-bold">{player.weapon.name}</span>
          <div className="px-2 py-1 bg-gray-700 rounded-md">
            {player.weapon.currentAmmo} / {player.weapon.magazine}
          </div>
          {player.weapon.isReloading && (
            <div className="text-yellow-400 animate-pulse">Reloading...</div>
          )}
        </div>
        
        {/* Player abilities */}
        <div className="flex space-x-2">
          {player.character.abilities.map((ability) => (
            <div 
              key={ability.id}
              className={`w-10 h-10 rounded-md flex items-center justify-center ${
                ability.isReady ? 'bg-blue-500' : 'bg-gray-700'
              }`}
              title={ability.name}
            >
              {ability.name.charAt(0)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Player death overlay */}
      {!player.isAlive && (
        <div className="absolute inset-0 bg-red-900 bg-opacity-40 flex flex-col items-center justify-center">
          <Skull className="w-24 h-24 text-white mb-4" />
          <div className="text-white text-3xl font-bold">YOU ARE DEAD</div>
          <div className="text-white text-xl mt-2">Waiting for next round...</div>
        </div>
      )}
    </div>
  );
};

export default GameHUD;