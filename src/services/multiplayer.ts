import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';
import { Player, Vector3 } from '../types/game';

class MultiplayerService {
  private socket: Socket | null = null;
  private isConnected = false;

  constructor() {
    this.setupSocketEvents = this.setupSocketEvents.bind(this);
  }

  connect(serverUrl: string = 'https://mock-valorant-server.example.com'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // In a real implementation, this would connect to an actual server
        // For this demo, we'll simulate multiplayer locally
        console.log('Connecting to server (simulated)...');
        
        // Simulate socket connection
        setTimeout(() => {
          this.isConnected = true;
          console.log('Connected to server (simulated)');
          resolve();
        }, 1000);
      } catch (error) {
        console.error('Failed to connect:', error);
        reject(error);
      }
    });
  }

  setupSocketEvents() {
    if (!this.socket) return;

    this.socket.on('playerJoined', (player: Player) => {
      const { gameState } = useGameStore.getState();
      useGameStore.setState({
        gameState: {
          ...gameState,
          players: {
            ...gameState.players,
            [player.id]: player
          }
        }
      });
    });

    this.socket.on('playerLeft', (playerId: string) => {
      const { gameState } = useGameStore.getState();
      const updatedPlayers = { ...gameState.players };
      delete updatedPlayers[playerId];
      
      useGameStore.setState({
        gameState: {
          ...gameState,
          players: updatedPlayers
        }
      });
    });

    this.socket.on('playerMoved', (playerId: string, position: Vector3, rotation: Vector3) => {
      useGameStore.getState().updatePlayerPosition(playerId, position, rotation);
    });

    this.socket.on('playerFired', (playerId: string) => {
      useGameStore.getState().fireWeapon(playerId);
    });

    this.socket.on('playerDamaged', (playerId: string, amount: number) => {
      useGameStore.getState().takeDamage(playerId, amount);
    });

    this.socket.on('spikePlanted', () => {
      useGameStore.getState().plantSpike();
    });

    this.socket.on('spikeDefused', () => {
      useGameStore.getState().defuseSpike();
    });
  }

  joinGame(player: Player) {
    // Simulate player joining a game
    console.log('Joining game as:', player.username);
    
    // In a real implementation, this would emit a socket event
    // For demo purposes, we're just updating the local state
    setTimeout(() => {
      // Add some simulated players
      const botPlayers = this.generateBotPlayers(player.team);
      const allPlayers = {
        [player.id]: player,
        ...botPlayers
      };
      
      const { gameState } = useGameStore.getState();
      useGameStore.setState({
        gameState: {
          ...gameState,
          players: allPlayers,
          matchStatus: 'inProgress'
        }
      });
      
      console.log('Joined game with simulated players');
    }, 1500);
  }

  sendPlayerPosition(playerId: string, position: Vector3, rotation: Vector3) {
    // In a real implementation, this would emit a socket event
    // For demo purposes, just update local state
    useGameStore.getState().updatePlayerPosition(playerId, position, rotation);
  }

  fireWeapon(playerId: string) {
    // In a real implementation, this would emit a socket event
    useGameStore.getState().fireWeapon(playerId);
    // Simulate hitting random players occasionally
    this.simulateRandomHits(playerId);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    console.log('Disconnected from server');
  }

  private generateBotPlayers(playerTeam: 'attackers' | 'defenders'): Record<string, Player> {
    const botPlayers: Record<string, Player> = {};
    const { CHARACTERS, WEAPONS } = require('../data');
    
    // Generate 4 teammates
    for (let i = 0; i < 4; i++) {
      const id = `bot-team-${i}`;
      const characterIndex = Math.floor(Math.random() * CHARACTERS.length);
      const weaponIndex = Math.floor(Math.random() * WEAPONS.length);
      
      botPlayers[id] = {
        id,
        username: `Teammate ${i + 1}`,
        position: {
          x: Math.random() * 10 - 5,
          y: 1.7,
          z: Math.random() * 10 - 5
        },
        rotation: { x: 0, y: 0, z: 0 },
        health: 100,
        team: playerTeam,
        character: CHARACTERS[characterIndex],
        weapon: {
          ...WEAPONS[weaponIndex],
          currentAmmo: WEAPONS[weaponIndex].magazine
        },
        isAlive: true
      };
    }
    
    // Generate 5 opponents
    const oppositeTeam = playerTeam === 'attackers' ? 'defenders' : 'attackers';
    for (let i = 0; i < 5; i++) {
      const id = `bot-enemy-${i}`;
      const characterIndex = Math.floor(Math.random() * CHARACTERS.length);
      const weaponIndex = Math.floor(Math.random() * WEAPONS.length);
      
      botPlayers[id] = {
        id,
        username: `Enemy ${i + 1}`,
        position: {
          x: Math.random() * 10 + 15,
          y: 1.7,
          z: Math.random() * 10 - 5
        },
        rotation: { x: 0, y: 0, z: 0 },
        health: 100,
        team: oppositeTeam,
        character: CHARACTERS[characterIndex],
        weapon: {
          ...WEAPONS[weaponIndex],
          currentAmmo: WEAPONS[weaponIndex].magazine
        },
        isAlive: true
      };
    }
    
    return botPlayers;
  }

  private simulateRandomHits(shooterId: string) {
    // Randomly determine if a hit occurs (30% chance)
    if (Math.random() > 0.3) return;
    
    const { gameState } = useGameStore.getState();
    const shooter = gameState.players[shooterId];
    if (!shooter) return;
    
    // Find enemy players
    const enemyPlayers = Object.values(gameState.players).filter(
      p => p.team !== shooter.team && p.isAlive
    );
    
    if (enemyPlayers.length === 0) return;
    
    // Randomly select an enemy to hit
    const randomEnemyIndex = Math.floor(Math.random() * enemyPlayers.length);
    const targetEnemy = enemyPlayers[randomEnemyIndex];
    
    // Apply damage
    const damage = shooter.weapon.damage;
    useGameStore.getState().takeDamage(targetEnemy.id, damage);
    
    console.log(`${shooter.username} hit ${targetEnemy.username} for ${damage} damage`);
  }
}

export const multiplayerService = new MultiplayerService();