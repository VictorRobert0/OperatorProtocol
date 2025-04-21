import { Character } from '../types/game';

export const CHARACTERS: Character[] = [
  {
    id: 'jett',
    name: 'Jett',
    abilities: [
      {
        id: 'updraft',
        name: 'Updraft',
        description: 'INSTANTLY propel upwards.',
        cooldown: 15,
        isReady: true
      },
      {
        id: 'tailwind',
        name: 'Tailwind',
        description: 'INSTANTLY dash a short distance in the direction you\'re moving.',
        cooldown: 20,
        isReady: true
      },
      {
        id: 'cloudburst',
        name: 'Cloudburst',
        description: 'INSTANTLY throw a cloud of fog that obscures vision on impact.',
        cooldown: 30,
        isReady: true
      },
      {
        id: 'bladestorm',
        name: 'Blade Storm',
        description: 'EQUIP a set of highly accurate throwing knives.',
        cooldown: 60,
        isReady: true
      }
    ]
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    abilities: [
      {
        id: 'curveball',
        name: 'Curveball',
        description: 'EQUIP a flare orb that takes a curving path and detonates shortly after throwing.',
        cooldown: 20,
        isReady: true
      },
      {
        id: 'hot-hands',
        name: 'Hot Hands',
        description: 'EQUIP a fireball. FIRE to throw a fireball that explodes after a set amount of time or upon hitting the ground.',
        cooldown: 30,
        isReady: true
      },
      {
        id: 'blaze',
        name: 'Blaze',
        description: 'EQUIP a flame wall. FIRE to create a line of flame that moves forward.',
        cooldown: 35,
        isReady: true
      },
      {
        id: 'run-it-back',
        name: 'Run It Back',
        description: 'INSTANTLY place a marker at Phoenix\'s location. While this ability is active, dying or allowing the timer to expire will return Phoenix to this location.',
        cooldown: 90,
        isReady: true
      }
    ]
  },
  {
    id: 'sage',
    name: 'Sage',
    abilities: [
      {
        id: 'slow-orb',
        name: 'Slow Orb',
        description: 'EQUIP a slowing orb. FIRE to throw a slowing orb forward that detonates upon landing.',
        cooldown: 25,
        isReady: true
      },
      {
        id: 'healing-orb',
        name: 'Healing Orb',
        description: 'EQUIP a healing orb. FIRE with your crosshairs over a damaged ally to activate a heal-over-time on them.',
        cooldown: 30,
        isReady: true
      },
      {
        id: 'barrier-orb',
        name: 'Barrier Orb',
        description: 'EQUIP a barrier orb. FIRE places a solid wall that can be rotated.',
        cooldown: 40,
        isReady: true
      },
      {
        id: 'resurrection',
        name: 'Resurrection',
        description: 'EQUIP a resurrection ability. FIRE with your crosshairs placed over a dead ally to begin resurrecting them.',
        cooldown: 120,
        isReady: true
      }
    ]
  },
  {
    id: 'omen',
    name: 'Omen',
    abilities: [
      {
        id: 'paranoia',
        name: 'Paranoia',
        description: 'INSTANTLY fire a shadow projectile forward, briefly reducing the vision range of all players it touches.',
        cooldown: 25,
        isReady: true
      },
      {
        id: 'dark-cover',
        name: 'Dark Cover',
        description: 'EQUIP a shadow orb and see its range indicator. FIRE to throw the shadow orb to the marked location.',
        cooldown: 30,
        isReady: true
      },
      {
        id: 'shrouded-step',
        name: 'Shrouded Step',
        description: 'EQUIP a shadow walk ability and see its range indicator. FIRE to begin a brief channel, then teleport to the marked location.',
        cooldown: 35,
        isReady: true
      },
      {
        id: 'from-the-shadows',
        name: 'From the Shadows',
        description: 'EQUIP a tactical map. FIRE to begin teleporting to the selected location.',
        cooldown: 100,
        isReady: true
      }
    ]
  }
];