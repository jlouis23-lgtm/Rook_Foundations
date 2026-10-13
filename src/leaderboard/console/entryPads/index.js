import HeadToHeadPad from './HeadToHeadPad';

// The console shows the pad that matches the session ruleset's result model.
// A new result model adds its pad here.
const ENTRY_PADS = {
  headToHead: HeadToHeadPad
};

export function getEntryPad(resultModel) {
  return ENTRY_PADS[resultModel] ?? null;
}
