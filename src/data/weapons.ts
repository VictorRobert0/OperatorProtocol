import { Weapon } from '../types/game';

export const WEAPONS: Weapon[] = [
  {
    id: 'classic',
    name: 'Classic',
    damage: 26,
    fireRate: 0.4,
    magazine: 12,
    currentAmmo: 12,
    reloadTime: 1.5,
    isReloading: false
  },
  {
    id: 'phantom',
    name: 'Phantom',
    damage: 39,
    fireRate: 0.1,
    magazine: 30,
    currentAmmo: 30,
    reloadTime: 2.5,
    isReloading: false
  },
  {
    id: 'vandal',
    name: 'Vandal',
    damage: 40,
    fireRate: 0.1,
    magazine: 25,
    currentAmmo: 25,
    reloadTime: 2.5,
    isReloading: false
  },
  {
    id: 'operator',
    name: 'Operator',
    damage: 150,
    fireRate: 0.6,
    magazine: 5,
    currentAmmo: 5,
    reloadTime: 3.7,
    isReloading: false
  },
  {
    id: 'sheriff',
    name: 'Sheriff',
    damage: 55,
    fireRate: 0.4,
    magazine: 6,
    currentAmmo: 6,
    reloadTime: 1.75,
    isReloading: false
  }
];