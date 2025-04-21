import { create } from 'zustand';
import { GameState, Player, Vector3 } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { WEAPONS } from '../data/weapons';

interface GameStore {
  gameState: GameState;
  localPlayer: Player | null;
  isConnected: boolean;
  isPaused: boolean;
  joinGame: (username: string, team: 'attackers' | 'defenders', characterId: string) => void;
  updatePlayerPosition: (playerId: string, position: Vector3, rotation: Vector3) => void;
  fireWeapon: (playerId: string) => void;
  reloadWeapon: (playerId: string) => void;
  useAbility: (playerId: string, abilityId: string) => void;
  takeDamage: (playerId: string, amount: number) => void;
  plantSpike: () => void;
  defuseSpike: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
}

const initialGameState: GameState = {
  players: {},
  matchTime: 0,
  roundTime: 100, // seconds
  roundNumber: 1,
  matchStatus: 'waiting',
  spikeStatus: 'notPlanted',
  attackersScore: 0,
  defendersScore: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: initialGameState,
  localPlayer: null,
  isConnected: false,
  isPaused: false,

  joinGame: (username, team, characterId) => {
    const character = CHARACTERS.find(c => c.id === characterId) || CHARACTERS[0];
    const defaultWeapon = WEAPONS.find(w => w.id === 'classic') || WEAPONS[0];
    
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      username,
      position: { x: 0, y: 1.7, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      health: 100,
      team,
      character,
      weapon: {
        ...defaultWeapon,
        currentAmmo: defaultWeapon.magazine,
        isReloading: false
      },
      isAlive: true
    };

    set(state => ({
      gameState: {
        ...state.gameState,
        players: {
          ...state.gameState.players,
          [newPlayer.id]: newPlayer
        }
      },
      localPlayer: newPlayer,
      isConnected: true
    }));
  },

  updatePlayerPosition: (playerId, position, rotation) => {
    set(state => ({
      gameState: {
        ...state.gameState,
        players: {
          ...state.gameState.players,
          [playerId]: {
            ...state.gameState.players[playerId],
            position,
            rotation
          }
        }
      }
    }));
  },

  fireWeapon: (playerId) => {
    const player = get().gameState.players[playerId];
    if (!player || player.weapon.currentAmmo <= 0 || player.weapon.isReloading) return;

    set(state => ({
      gameState: {
        ...state.gameState,
        players: {
          ...state.gameState.players,
          [playerId]: {
            ...state.gameState.players[playerId],
            weapon: {
              ...state.gameState.players[playerId].weapon,
              currentAmmo: state.gameState.players[playerId].weapon.currentAmmo - 1
            }
          }
        }
      }
    }));
  },

  reloadWeapon: (playerId) => {
    const player = get().gameState.players[playerId];
    if (!player || player.weapon.isReloading || player.weapon.currentAmmo === player.weapon.magazine) return;

    set(state => ({
      gameState: {
        ...state.gameState,
        players: {
          ...state.gameState.players,
          [playerId]: {
            ...state.gameState.players[playerId],
            weapon: {
              ...state.gameState.players[playerId].weapon,
              isReloading: true
            }
          }
        }
      }
    }));

    // Simulate reload time
    setTimeout(() => {
      set(state => ({
        gameState: {
          ...state.gameState,
          players: {
            ...state.gameState.players,
            [playerId]: {
              ...state.gameState.players[playerId],
              weapon: {
                ...state.gameState.players[playerId].weapon,
                currentAmmo: state.gameState.players[playerId].weapon.magazine,
                isReloading: false
              }
            }
          }
        }
      }));
    }, player.weapon.reloadTime * 1000);
  },

  useAbility: (playerId, abilityId) => {
    const player = get().gameState.players[playerId];
    if (!player) return;

    const abilityIndex = player.character.abilities.findIndex(a => a.id === abilityId);
    if (abilityIndex === -1 || !player.character.abilities[abilityIndex].isReady) return;

    set(state => {
      const updatedAbilities = [...state.gameState.players[playerId].character.abilities];
      updatedAbilities[abilityIndex] = {
        ...updatedAbilities[abilityIndex],
        isReady: false
      };

      return {
        gameState: {
          ...state.gameState,
          players: {
            ...state.gameState.players,
            [playerId]: {
              ...state.gameState.players[playerId],
              character: {
                ...state.gameState.players[playerId].character,
                abilities: updatedAbilities
              }
            }
          }
        }
      };
    });

    // Reset ability after cooldown
    const ability = player.character.abilities[abilityIndex];
    setTimeout(() => {
      set(state => {
        const updatedAbilities = [...state.gameState.players[playerId]?.character.abilities || []];
        if (updatedAbilities[abilityIndex]) {
          updatedAbilities[abilityIndex] = {
            ...updatedAbilities[abilityIndex],
            isReady: true
          };
        }

        return {
          gameState: {
            ...state.gameState,
            players: {
              ...state.gameState.players,
              [playerId]: {
                ...state.gameState.players[playerId],
                character: {
                  ...state.gameState.players[playerId].character,
                  abilities: updatedAbilities
                }
              }
            }
          }
        };
      });
    }, ability.cooldown * 1000);
  },

  takeDamage: (playerId, amount) => {
    set(state => {
      const player = state.gameState.players[playerId];
      if (!player) return state;

      const newHealth = Math.max(0, player.health - amount);
      const isAlive = newHealth > 0;

      return {
        gameState: {
          ...state.gameState,
          players: {
            ...state.gameState.players,
            [playerId]: {
              ...player,
              health: newHealth,
              isAlive
            }
          }
        }
      };
    });
  },

  plantSpike: () => {
    set(state => ({
      gameState: {
        ...state.gameState,
        spikeStatus: 'planted'
      }
    }));
  },

  defuseSpike: () => {
    set(state => ({
      gameState: {
        ...state.gameState,
        spikeStatus: 'defused'
      }
    }));
  },

  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  
  resetGame: () => set({
    gameState: initialGameState,
    localPlayer: null,
    isConnected: false,
    isPaused: false
  })
}));