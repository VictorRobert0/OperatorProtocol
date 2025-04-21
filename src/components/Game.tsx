import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { multiplayerService } from '../services/multiplayer';
import { GameRenderer } from '../engine/GameRenderer';
import GameHUD from './GameHUD';
import CharacterSelection from './CharacterSelection';
import { Maximize2 } from 'lucide-react';

interface GameProps {
  username: string;
}

const Game: React.FC<GameProps> = ({ username }) => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRenderer = useRef<GameRenderer | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<'attackers' | 'defenders'>('attackers');
  const [gameStarted, setGameStarted] = useState(false);
  
  const { 
    gameState, 
    localPlayer, 
    joinGame, 
    updatePlayerPosition, 
    fireWeapon,
    reloadWeapon
  } = useGameStore();
  
  // Input management with performance optimizations
  const keys = useRef<Set<string>>(new Set());
  const mousePosition = useRef({ x: 0, y: 0 });
  const isPointerLocked = useRef(false);
  const lastUpdateTime = useRef(0);
  const movementFrame = useRef(0);
  
  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacterId(characterId);
  };
  
  const handleTeamSelect = (team: 'attackers' | 'defenders') => {
    setSelectedTeam(team);
  };
  
  const handleConfirmSelection = () => {
    joinGame(username, selectedTeam, selectedCharacterId);
    setGameStarted(true);
    
    multiplayerService.connect().then(() => {
      if (localPlayer) {
        multiplayerService.joinGame(localPlayer);
      }
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  
  useEffect(() => {
    if (gameStarted && gameContainerRef.current && localPlayer) {
      gameRenderer.current = new GameRenderer();
      gameRenderer.current.initialize(gameContainerRef.current, localPlayer.id);
      
      return () => {
        if (gameRenderer.current) {
          gameRenderer.current.cleanup();
        }
      };
    }
  }, [gameStarted, localPlayer]);
  
  useEffect(() => {
    if (gameRenderer.current) {
      gameRenderer.current.updatePlayers(gameState.players);
    }
  }, [gameState.players]);
  
  useEffect(() => {
    if (!gameStarted) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
      
      if (e.key.toLowerCase() === 'r' && localPlayer) {
        reloadWeapon(localPlayer.id);
      }

      // Handle fullscreen toggle with F11
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase());
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current || !localPlayer) return;
      
      const sensitivity = 0.002;
      const newRotation = {
        x: localPlayer.rotation.x - e.movementY * sensitivity,
        y: localPlayer.rotation.y - e.movementX * sensitivity,
        z: 0
      };
      
      newRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newRotation.x));
      
      updatePlayerPosition(localPlayer.id, localPlayer.position, newRotation);
      multiplayerService.sendPlayerPosition(localPlayer.id, localPlayer.position, newRotation);
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      if (!isPointerLocked.current && gameContainerRef.current) {
        gameContainerRef.current.requestPointerLock();
      }
      
      if (isPointerLocked.current && localPlayer && e.button === 0) {
        fireWeapon(localPlayer.id);
        multiplayerService.fireWeapon(localPlayer.id);
      }
    };
    
    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === gameContainerRef.current;
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    
    // Optimized movement loop with delta time
    const movePlayer = (timestamp: number) => {
      if (!localPlayer || !isPointerLocked.current) {
        movementFrame.current = requestAnimationFrame(movePlayer);
        return;
      }
      
      const deltaTime = timestamp - lastUpdateTime.current;
      if (deltaTime < 16) { // Cap at ~60fps
        movementFrame.current = requestAnimationFrame(movePlayer);
        return;
      }
      
      const moveSpeed = 0.2 * (deltaTime / 16); // Base speed adjusted by delta time
      const { position, rotation } = localPlayer;
      let moved = false;
      const newPosition = { ...position };
      
      // Calculate movement vectors
      const forwardX = Math.sin(rotation.y);
      const forwardZ = Math.cos(rotation.y);
      const rightX = Math.sin(rotation.y + Math.PI / 2);
      const rightZ = Math.cos(rotation.y + Math.PI / 2);
      
      // Diagonal movement normalization
      let dx = 0;
      let dz = 0;
      
      if (keys.current.has('w')) { dx += forwardX; dz -= forwardZ; }
      if (keys.current.has('s')) { dx -= forwardX; dz += forwardZ; }
      if (keys.current.has('a')) { dx -= rightX; dz += rightZ; }
      if (keys.current.has('d')) { dx += rightX; dz -= rightZ; }
      
      // Normalize diagonal movement
      if (dx !== 0 || dz !== 0) {
        const length = Math.sqrt(dx * dx + dz * dz);
        dx = (dx / length) * moveSpeed;
        dz = (dz / length) * moveSpeed;
        
        newPosition.x += dx;
        newPosition.z += dz;
        moved = true;
      }
      
      if (moved) {
        updatePlayerPosition(localPlayer.id, newPosition, rotation);
        multiplayerService.sendPlayerPosition(localPlayer.id, newPosition, rotation);
      }
      
      lastUpdateTime.current = timestamp;
      movementFrame.current = requestAnimationFrame(movePlayer);
    };
    
    movementFrame.current = requestAnimationFrame(movePlayer);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      cancelAnimationFrame(movementFrame.current);
    };
  }, [gameStarted, localPlayer, updatePlayerPosition, fireWeapon, reloadWeapon]);
  
  if (!gameStarted) {
    return (
      <CharacterSelection
        onSelectCharacter={handleCharacterSelect}
        onSelectTeam={handleTeamSelect}
        onConfirm={handleConfirmSelection}
      />
    );
  }
  
  return (
    <div className="relative w-full h-screen">
      <div 
        ref={gameContainerRef} 
        className="w-full h-full cursor-none"
      />
      
      {localPlayer && (
        <>
          <GameHUD
            player={localPlayer}
            matchTime={gameState.matchTime}
            roundTime={gameState.roundTime}
            roundNumber={gameState.roundNumber}
            attackersScore={gameState.attackersScore}
            defendersScore={gameState.defendersScore}
            spikeStatus={gameState.spikeStatus}
          />
          
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-2 rounded-lg bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default Game;