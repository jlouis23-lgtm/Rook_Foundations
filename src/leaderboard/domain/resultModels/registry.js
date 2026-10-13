import { headToHead } from './headToHead';

// A result model defines how a result is shaped and validated, and how a
// ruleset's point table applies to it. New models (placement, solo, custom)
// register here; the console picks its entry pad from the same id.
const RESULT_MODELS = {
  [headToHead.id]: headToHead
};

export function getResultModel(id) {
  const model = RESULT_MODELS[id];
  if (!model) throw new Error(`Unknown result model: ${id}`);
  return model;
}
