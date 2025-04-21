export interface Player {
  id: string;
  username: string;
  position: Vector3;
  rotation: Vector3;
  health: number;
  team: 'attackers' | 'defenders';
  character: Character;
  weapon: Weapon;
  isAlive: boolean;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Weapon {
  id: string;
  name: string;
  damage: number;
  fireRate: number;
  magazine: number;
  currentAmmo: number;
  reloadTime: number;
  isReloading: boolean;
}

export interface Character {
  id: string;
  name: string;
  abilities: Ability[];
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  isReady: boolean;
}

export interface GameState {
  players: Record<string, Player>;
  matchTime: number;
  roundTime: number;
  roundNumber: number;
  matchStatus: 'waiting' | 'inProgress' | 'finished';
  spikeStatus: 'notPlanted' | 'planted' | 'defused' | 'exploded';
  attackersScore: number;
  defendersScore: number;
}

export interface GameSettings {
  maxPlayers: number;
  roundTime: number;
  maxRounds: number;
}