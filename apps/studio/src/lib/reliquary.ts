// Reliquary — Secret Password Unlockable Relics

export interface Relic {
  id: string;
  name: string;
  description: string;
  lore: string;
  hashedPassword: string;
  tier: 1 | 2 | 3;
  icon: string;
  riddle?: string;
}

// SHA-256 hashes — no plaintext passwords in the codebase
export const RELICS: Relic[] = [
  {
    id: 'one-armed-mannequin',
    name: 'One-Armed Mannequin',
    description: 'Salvaged from a Mayfair window display during a blackout.',
    lore: 'The missing arm was never found — only a handwritten note reading "I gave it willingly."',
    hashedPassword: '0e41c7d8c0dbe214604fe5b0ecfd5a54aeb93c01bd144896535341af1a24e96e',
    tier: 1,
    icon: '🦾',
  },
  {
    id: 'gucci-incense',
    name: 'Gucci Incense',
    description: 'A stick of Nag Champa wrapped in a torn Gucci label.',
    lore: 'Burns with the scent of ambition and sandalwood.',
    hashedPassword: 'fb1d2d7b10245525cb347e3e38ebc07f27335972d20555a737847640c10c74a6',
    tier: 1,
    icon: '🪔',
    riddle: 'Where smoke meets silk, the next word hides in Italian luxury.',
  },
  {
    id: '8-legged-harrods-tripod',
    name: '8-Legged Harrods Tripod',
    description: 'A camera tripod modified with five extra legs by an unknown Harrods employee.',
    lore: 'No one knows why. It stands perfectly still on any surface.',
    hashedPassword: '7b8c5f482c1f23fdefe5e6ef654fa735f11691101cda69411a4a83ec2d4e801c',
    tier: 1,
    icon: '🕷️',
    riddle: 'Eight legs hold steady in the palace of green and gold.',
  },
  {
    id: 'stilettos-uber-driver',
    name: 'Stilettos Stolen from a One-Eyed Uber Driver',
    description: 'Size 7. Patent leather. Found on the backseat of a cancelled ride.',
    lore: "The driver's one eye was reportedly his best feature.",
    hashedPassword: '3da4f41c1387f2aa4f4a3701e47efaeb2a8859d9011039d2f66594fd831ef14a',
    tier: 1,
    icon: '👠',
    riddle: 'The sharp heel clicks where one eye watches the road.',
  },
  {
    id: 'starbucks-bando-pin',
    name: 'Starbucks Bando ID Pin',
    description: "An employee name tag reading 'BANDO'.",
    lore: 'No such employee exists in any Starbucks database. The pin radiates faint warmth.',
    hashedPassword: '2bef04411899fc2e5c82c5c966b707211de94a7a07fe3ff530fd331d2fbdaf6e',
    tier: 2,
    icon: '📛',
    riddle: 'A name that does not exist serves coffee that never cools.',
  },
  {
    id: 'versace-brick',
    name: 'The Versace Brick',
    description: 'A house brick wrapped in authentic Versace silk.',
    lore: 'Used as a doorstop at an unlicensed salon in Peckham since 2014.',
    hashedPassword: '5313dcd2d76e53df7c383cd56a0089da26f47748c766de627447f510b9a2e81e',
    tier: 2,
    icon: '🧱',
    riddle: 'Heavy as truth, dressed in Medusa. Peckham holds the door.',
  },
  {
    id: 'balenciaga-prayer-mat',
    name: 'Balenciaga Prayer Mat',
    description: 'Triple-stitched. Found rolled up inside a bass bin at a Dalston warehouse rave.',
    lore: 'Smells of fog machine fluid.',
    hashedPassword: '5b24c087276422bfdb54225df0ac30dc662f8c388fb1f0a559f3d95f70ca6692',
    tier: 2,
    icon: '🧎',
    riddle: 'Kneel where the bass drops and the fog rolls thick.',
  },
  {
    id: 'tesco-finest-monocle',
    name: 'Tesco Finest Monocle',
    description: 'A single corrective lens mounted in a gold-plated Tesco Clubcard.',
    lore: 'Prescription unknown. Grants clarity of taste.',
    hashedPassword: 'b922b7e0ba4cfdb9d843570dfde0af429181655f71f76fb45ffc923f074adfbc',
    tier: 2,
    icon: '🧐',
    riddle: 'Every little helps — especially a single lens of gold.',
  },
  {
    id: 'severed-aux-cable',
    name: 'The Severed Aux Cable of Brixton',
    description: 'Cut mid-song during a legendary sound clash.',
    lore: 'Both halves still carry signal if held by someone worthy.',
    hashedPassword: '6a897dffaf13054579235c93baab9b112de2b6d41beb6649e63dac1c45301551',
    tier: 3,
    icon: '🔌',
    riddle: 'Two halves of a song, severed where the bass was born.',
  },
  {
    id: 'hermes-oyster-card',
    name: 'Hermès Oyster Card',
    description: 'A Zone 1-6 travelcard inside an Hermès leather case.',
    lore: 'Has never been topped up, yet never runs out.',
    hashedPassword: '8cfde6efdfc4ed5ab1f6acbbd1ba49bf31932f84d0a4c090eb41c7d151e8b180',
    tier: 3,
    icon: '💳',
    riddle: 'Infinite journeys wrapped in leather, from zone to zone without end.',
  },
  {
    id: 'fendi-frying-pan',
    name: 'The Fendi Frying Pan',
    description: 'Cast iron, Fendi-stamped handle.',
    lore: 'Used to cook a full English at London Fashion Week 2019. Grease stains are part of the patina.',
    hashedPassword: 'bb45e55a4f040e05422d38285c0708ca3f6741c9335e9afff8b980fed66e9e7d',
    tier: 3,
    icon: '🍳',
    riddle: 'Grease and glamour sizzle together on the runway.',
  },
  {
    id: 'off-white-traffic-cone',
    name: 'Off-White Traffic Cone',
    description: "Virgil's unreleased collab with TfL.",
    lore: 'The quotation marks read "CAUTION". Found outside a chicken shop in Tottenham.',
    hashedPassword: '3e0e7ac11647b30619cad89a05f9f0775892b881bd5f000d20fef9302ac8ca8a',
    tier: 3,
    icon: '🔶',
    riddle: 'Quotation marks guard the final threshold. Tottenham knows.',
  },
];

export async function hashPassword(plaintext: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(plaintext: string, relicId: string): Promise<boolean> {
  const relic = RELICS.find((r) => r.id === relicId);
  if (!relic) return false;
  const hash = await hashPassword(plaintext);
  return hash === relic.hashedPassword;
}

// Try a password against all locked relics, return the first match or null
export async function tryPasswordAgainstAll(
  plaintext: string,
  currentUnlocks: ReliquaryUnlocks
): Promise<string | null> {
  const hash = await hashPassword(plaintext);
  for (const relic of RELICS) {
    if (!currentUnlocks[relic.id] && hash === relic.hashedPassword) {
      return relic.id;
    }
  }
  return null;
}

export function getRelicById(id: string): Relic | undefined {
  return RELICS.find((r) => r.id === id);
}

export interface ReliquaryUnlocks {
  [relicId: string]: { unlockedAt: string };
}

const STORAGE_KEY = 'boveda-reliquary-unlocks';

export function loadUnlocks(): ReliquaryUnlocks {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveUnlocks(unlocks: ReliquaryUnlocks): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocks));
}

export function unlockRelic(relicId: string): ReliquaryUnlocks {
  const current = loadUnlocks();
  const updated = {
    ...current,
    [relicId]: { unlockedAt: new Date().toISOString() },
  };
  saveUnlocks(updated);
  return updated;
}

export function isRelicUnlocked(relicId: string): boolean {
  const unlocks = loadUnlocks();
  return !!unlocks[relicId];
}

// Get the active riddle: the riddle from the last unlocked relic (clue for the next)
export function getActiveRiddle(currentUnlocks: ReliquaryUnlocks): { riddle: string; fromRelic: string } | null {
  // Walk relics in order, find the last one that's unlocked
  let lastUnlockedIndex = -1;
  for (let i = RELICS.length - 1; i >= 0; i--) {
    if (currentUnlocks[RELICS[i].id]) {
      lastUnlockedIndex = i;
      break;
    }
  }
  if (lastUnlockedIndex === -1) return null;
  const nextRelic = RELICS[lastUnlockedIndex + 1];
  if (!nextRelic?.riddle) return null;
  return { riddle: nextRelic.riddle, fromRelic: RELICS[lastUnlockedIndex].name };
}
