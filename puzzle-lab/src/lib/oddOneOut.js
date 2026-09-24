import { shuffle, randomInt } from './difficulty';
import { SHAPES, COLORS } from './patterns';

const CONFIG = {
  explorer: { gridSize: 6, mode: 'shape' },
  thinker: { gridSize: 9, mode: 'color' },
  champion: { gridSize: 12, mode: 'rotation' },
};

const ROTATIONS = [35, 50, 65, 100, 145, 160, 200, 235, 280, 325];

export function generateRound(difficulty) {
  const { gridSize, mode } = CONFIG[difficulty];
  const baseShape = shuffle(SHAPES)[0];
  const baseColor = shuffle(COLORS)[0];
  const oddIndex = randomInt(0, gridSize - 1);

  const items = Array.from({ length: gridSize }, (_, i) => {
    const isOdd = i === oddIndex;
    if (mode === 'shape') {
      const oddShape = shuffle(SHAPES.filter((s) => s !== baseShape))[0];
      return { id: i, shape: isOdd ? oddShape : baseShape, color: baseColor, rotation: 0 };
    }
    if (mode === 'color') {
      const oddColor = shuffle(COLORS.filter((c) => c !== baseColor))[0];
      return { id: i, shape: baseShape, color: isOdd ? oddColor : baseColor, rotation: 0 };
    }
    // rotation mode
    const rotation = isOdd ? shuffle(ROTATIONS)[0] : 0;
    return { id: i, shape: baseShape, color: baseColor, rotation };
  });

  return { items, oddIndex };
}
