export const OBJECTS = {
  horse: { label: 'Horse', emoji: '🐴' },
  hay: { label: 'Hay Bale', emoji: '🌾' },
  sword: { label: 'Sword Rack', emoji: '⚔️' },
  treasure: { label: 'Treasure Chest', emoji: '💰' },
  falcon: { label: 'Falcon', emoji: '🦅' },
  food: { label: 'Food Stores', emoji: '🍞' },
};

const RULE_HORSE_HAY = { a: 'horse', b: 'hay', text: 'The Horse cannot be left with the Hay Bale.', consequence: 'The Horse ate the Hay!' };
const RULE_HORSE_SWORD = { a: 'horse', b: 'sword', text: 'The Horse cannot be left with the Sword Rack.', consequence: 'The Horse knocked over the Sword Rack!' };
const RULE_TREASURE_SWORD = { a: 'treasure', b: 'sword', text: 'The Treasure Chest cannot be left with the Sword Rack.', consequence: 'Thieves stole the Treasure while the guards were distracted!' };
const RULE_FALCON_HORSE = { a: 'falcon', b: 'horse', text: 'The Falcon cannot be left with the Horse.', consequence: 'The Falcon got spooked and flew away!' };
const RULE_FOOD_HORSE = { a: 'food', b: 'horse', text: 'The Food Stores cannot be left with the Horse.', consequence: 'The Horse ate the Food Stores!' };

export const LEVELS = [
  { id: 1, name: 'Hungry Horse', objects: ['horse', 'hay'], rules: [RULE_HORSE_HAY] },
  { id: 2, name: 'The Armoury', objects: ['horse', 'hay', 'sword'], rules: [RULE_HORSE_HAY, RULE_HORSE_SWORD] },
  { id: 3, name: 'The Royal Treasure', objects: ['horse', 'hay', 'sword', 'treasure'], rules: [RULE_HORSE_HAY, RULE_HORSE_SWORD, RULE_TREASURE_SWORD] },
  { id: 4, name: 'The Royal Falcon', objects: ['horse', 'hay', 'sword', 'treasure', 'falcon'], rules: [RULE_HORSE_HAY, RULE_HORSE_SWORD, RULE_TREASURE_SWORD, RULE_FALCON_HORSE] },
  { id: 5, name: 'Castle Supplies', objects: ['horse', 'hay', 'sword', 'treasure', 'falcon', 'food'], rules: [RULE_HORSE_HAY, RULE_HORSE_SWORD, RULE_TREASURE_SWORD, RULE_FALCON_HORSE, RULE_FOOD_HORSE] },
];

export const MAX_LEVEL = LEVELS.length;
export const CAPACITY = 2;

function encodeState(objects, positions, qmSide) {
  const onStart = objects.filter((o) => positions[o] === 'start').sort().join(',');
  return `${qmSide}|${onStart}`;
}

export function findConflict(objectsOnBank, rules) {
  return rules.find((r) => objectsOnBank.includes(r.a) && objectsOnBank.includes(r.b)) || null;
}

function subsetsUpTo(items, max) {
  const out = [[]];
  for (let i = 0; i < items.length; i++) {
    out.push([items[i]]);
    if (max >= 2) {
      for (let j = i + 1; j < items.length; j++) out.push([items[i], items[j]]);
    }
  }
  return out;
}

/**
 * BFS over safe game states. Returns { moves, path } for the shortest
 * sequence of crossings that gets every object (and the Quartermaster)
 * to the destination bank without ever leaving a conflicting pair
 * unsupervised, or null if no such sequence exists.
 */
export function solveLevel(level, fromPositions, fromSide) {
  const objects = level.objects;
  const initialPositions = fromPositions || Object.fromEntries(objects.map((o) => [o, 'start']));
  const initialSide = fromSide || 'start';

  const goalPositions = Object.fromEntries(objects.map((o) => [o, 'dest']));
  const goalKey = encodeState(objects, goalPositions, 'dest');
  const startKey = encodeState(objects, initialPositions, initialSide);
  if (startKey === goalKey) return { moves: 0, path: [] };

  const queue = [{ positions: initialPositions, qmSide: initialSide, path: [] }];
  const visited = new Set([startKey]);

  while (queue.length) {
    const { positions, qmSide, path } = queue.shift();
    const otherSide = qmSide === 'start' ? 'dest' : 'start';
    const here = objects.filter((o) => positions[o] === qmSide);

    for (const subset of subsetsUpTo(here, CAPACITY)) {
      const remaining = here.filter((o) => !subset.includes(o));
      if (findConflict(remaining, level.rules)) continue;

      const nextPositions = { ...positions };
      subset.forEach((o) => {
        nextPositions[o] = otherSide;
      });
      const key = encodeState(objects, nextPositions, otherSide);
      if (visited.has(key)) continue;
      visited.add(key);

      const nextPath = [...path, { from: qmSide, to: otherSide, items: subset }];
      if (key === goalKey) return { moves: nextPath.length, path: nextPath };
      queue.push({ positions: nextPositions, qmSide: otherSide, path: nextPath });
    }
  }

  return null;
}

export function minMovesForLevel(level) {
  const result = solveLevel(level);
  return result ? result.moves : null;
}

export function starsForMoves(moves, minMoves) {
  if (moves <= minMoves) return 3;
  if (moves <= minMoves + 2) return 2;
  return 1;
}

const STORAGE_KEY = 'puzzle-lab:castle-crossing:progress';

export function loadProgress() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLevelResult(levelId, moves, stars) {
  if (typeof window === 'undefined') return {};
  const progress = loadProgress();
  const existing = progress[levelId];
  const bestMoves = existing?.bestMoves ? Math.min(existing.bestMoves, moves) : moves;
  const bestStars = existing?.stars ? Math.max(existing.stars, stars) : stars;
  progress[levelId] = { completed: true, bestMoves, stars: bestStars };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // storage unavailable (private browsing, quota) - progress just won't persist
  }
  return progress;
}
