export const DIFFICULTIES = [
  { id: 'explorer', label: 'Explorer', ages: 'Ages 5–7', color: '#2d8c62' },
  { id: 'thinker', label: 'Thinker', ages: 'Ages 8–9', color: '#4a7eb8' },
  { id: 'champion', label: 'Champion', ages: 'Ages 10–12', color: '#7a48c0' },
];

export function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickRandom(array, count) {
  return shuffle(array).slice(0, count);
}
