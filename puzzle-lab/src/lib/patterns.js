import { shuffle } from './difficulty';

export const SHAPES = ['circle', 'square', 'triangle', 'star', 'heart', 'hexagon'];
export const COLORS = ['#E8A020', '#2d8c62', '#4a7eb8', '#7a48c0', '#c0446b', '#1f9e9e'];

const CONFIG = {
  explorer: { unitLen: 2, visibleLen: 5, options: 3 },
  thinker: { unitLen: 3, visibleLen: 6, options: 4 },
  champion: { unitLen: 4, visibleLen: 7, options: 4 },
};

function sameItem(a, b) {
  return a.shape === b.shape && a.color === b.color;
}

export function generateRound(difficulty) {
  const { unitLen, visibleLen, options } = CONFIG[difficulty];
  const shapes = shuffle(SHAPES).slice(0, unitLen);
  const colors = shuffle(COLORS).slice(0, unitLen);
  const unit = shapes.map((shape, i) => ({ shape, color: colors[i] }));

  const sequence = Array.from({ length: visibleLen }, (_, i) => unit[i % unitLen]);
  const answer = unit[visibleLen % unitLen];

  const decoyPool = [];
  unit.forEach((item) => {
    if (!sameItem(item, answer)) decoyPool.push(item);
  });
  // Near-miss decoys: same shape as answer with a different colour, and vice versa
  const otherColors = COLORS.filter((c) => c !== answer.color);
  const otherShapes = SHAPES.filter((s) => s !== answer.shape);
  decoyPool.push({ shape: answer.shape, color: shuffle(otherColors)[0] });
  decoyPool.push({ shape: shuffle(otherShapes)[0], color: answer.color });
  decoyPool.push({ shape: shuffle(otherShapes)[0], color: shuffle(otherColors)[0] });

  const uniqueDecoys = [];
  shuffle(decoyPool).forEach((item) => {
    if (!sameItem(item, answer) && !uniqueDecoys.some((d) => sameItem(d, item))) {
      uniqueDecoys.push(item);
    }
  });

  const finalOptions = shuffle([answer, ...uniqueDecoys.slice(0, options - 1)]);

  return { sequence, answer, options: finalOptions };
}
