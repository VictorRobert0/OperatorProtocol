import React, { useState } from 'react';
import { Character } from '../types/game';
import { CHARACTERS } from '../data/characters';

interface CharacterSelectionProps {
  onSelectCharacter: (characterId: string) => void;
  onSelectTeam: (team: 'attackers' | 'defenders') => void;
  onConfirm: () => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ 
  onSelectCharacter, 
  onSelectTeam,
  onConfirm
}) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<'attackers' | 'defenders' | null>(null);

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacterId(characterId);
    onSelectCharacter(characterId);
  };

  const handleTeamSelect = (team: 'attackers' | 'defenders') => {
    setSelectedTeam(team);
    onSelectTeam(team);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Select Your Agent</h1>
        
        {/* Team Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Choose Your Side</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className={`p-4 rounded-lg flex-1 flex flex-col items-center transition-all ${
                selectedTeam === 'attackers' 
                  ? 'bg-red-600 border-2 border-red-400' 
                  : 'bg-red-900 hover:bg-red-800'
              }`}
              onClick={() => handleTeamSelect('attackers')}
            >
              <span className="text-xl font-bold">Attackers</span>
              <span className="mt-2 text-sm">Plant the spike and defend it</span>
            </button>
            
            <button
              className={`p-4 rounded-lg flex-1 flex flex-col items-center transition-all ${
                selectedTeam === 'defenders' 
                  ? 'bg-blue-600 border-2 border-blue-400' 
                  : 'bg-blue-900 hover:bg-blue-800'
              }`}
              onClick={() => handleTeamSelect('defenders')}
            >
              <span className="text-xl font-bold">Defenders</span>
              <span className="mt-2 text-sm">Defend sites and defuse spikes</span>
            </button>
          </div>
        </div>
        
        {/* Character Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {CHARACTERS.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isSelected={selectedCharacterId === character.id}
              onSelect={() => handleCharacterSelect(character.id)}
            />
          ))}
        </div>
        
        {/* Confirm Button */}
        <div className="flex justify-center">
          <button
            className={`px-8 py-4 rounded-lg text-xl font-bold transition-all ${
              selectedCharacterId && selectedTeam
                ? 'bg-green-600 hover:bg-green-500'
                : 'bg-gray-700 cursor-not-allowed'
            }`}
            disabled={!selectedCharacterId || !selectedTeam}
            onClick={onConfirm}
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character, isSelected, onSelect }) => {
  return (
    <div 
      className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
        isSelected ? 'border-2 border-yellow-400 shadow-lg shadow-yellow-400/30' : ''
      }`}
      onClick={onSelect}
    >
      <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
        <div className="text-6xl font-bold opacity-30">{character.name.charAt(0)}</div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{character.name}</h3>
        
        <div className="space-y-2">
          {character.abilities.map((ability) => (
            <div key={ability.id} className="flex items-center text-sm">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center mr-2">
                {ability.name.charAt(0)}
              </div>
              <span className="opacity-80">{ability.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSelection;