# Animal Kingdom: QA report

**Date:** 23 November 2026 · **Data version:** 2026-11-23
**Result:** 88 of 88 automated checks passed (44 data and engine checks in `content/validate.js`, 44 browser checks in `content/qa.js`). All 300 photos were also checked by eye.

## 1. Data (validate.js, reading the workbook export)

- Exactly 5 groups and exactly 300 animals: 60 per group, each split 20 Easy, 20 Medium and 20 Challenging.
- No duplicate Animal ID, common name, scientific name or image.
- Every animal has a scientific name, a photo file, a photographer, a licence, a licence URL and a Commons source link.
- Licences across the 300 photos:

  | Licence | Photos |
  |---|---|
  | CC BY-SA | 188 |
  | CC BY | 74 |
  | Public domain | 29 |
  | CC0 | 9 |

  No NC or ND licences are used. `export_data.py` refuses to export if one appears.
- Every photo is in `Images/<Group>/` and named `group_common_scientific.jpg`. Each is between 20 and 600 KB, 47 MB in total.
- Exactly 100 facts with no duplicates. Each has an organisation, a source title and a URL. 99 of them link to an animal with a photo. The exception is the dung beetle fact, which is about *Scarabaeus satyrus*, a species that is not in the photo bank.
- Every fact has a supporting quote from its source page in the facts workbook.

## 2. Engine (1,600 simulated games plus targeted tests)

- No animal repeats within a game.
- There are never three animals of the same group in a row, all five groups appear in every game, and the groups stay balanced.
- Years 5–6 never sees a Challenging animal.
- Difficulty rises during a game:
  - **Years 7–8:** Challenging animals make up 14% of the first quarter and 45% of the last quarter.
  - **Years 5–6:** Medium animals make up 25% of the first quarter and 59% of the last quarter.
- The rise is not predictable: 15% of the last quarter in Years 7–8 is still Easy animals.
- A very fast player sees all 200 Years 5–6 animals before any repeat.
- Scoring is +1 for a correct answer and −1 for a wrong one, with a floor of 0. A wrong first answer leaves the score at 0.
- The fact picker never repeats any of the last 10 facts shown (tested over 2,000 games).

## 3. Gameplay in the browser (qa.js, Chromium)

- **Homepage:**
  - Title and subtitle are shown.
  - Start is disabled until a pathway is chosen.
  - Both pathways and both durations are offered.
  - One real photo per group is shown.
- **Years 5–6, 3 minutes:**
  - The clock shows 3:00 when the first photo appears.
  - Every photo has a credit line.
  - The wrong-answer wording is "NOT QUITE! A … is actually a … <explanation>".
  - There is no −1 when the score is already 0. When the score is above 0, a wrong answer shows −1 and costs a point.
  - The correct-answer wording is "CORRECT! Well done! A … is a …".
  - Keys 1–5 answer.
  - The game ends at 0:00.
  - The results screen shows score, attempted, correct, incorrect, accuracy, pathway and time.
  - An encouraging title is shown.
  - The fact card shows the photo and source.
  - Play Again starts a fresh game and shows a different fact. Return to Homepage works.
- **Years 7–8, 5 minutes (40 answers):**
  - No repeats.
  - Never three of one group in a row.
  - All five groups appear.
  - Challenging animals appear.
  - 40 correct out of 40 earns "Animal Classification Champion!".
- **Timer:** while the first photo is still loading, the clock stays at 3:00 and the buttons are locked. The clock starts once the photo is on screen.
- **Credits:** all 300 photos are listed with photographer, licence and a link to the Commons file.
- **Images:** all 300 photos load and are at least 300 px wide.
- **Errors:** no script errors.

## 4. Screen sizes

Each size was checked for four things: no sideways scrolling, the photo and all five buttons visible without scrolling, and buttons at least 44 px. All sizes passed:

| Size | Viewport |
|---|---|
| Phone | 390×844 |
| Small phone | 360×640 |
| Tablet portrait | 820×1180 |
| Tablet landscape | 1180×820 |
| ICT room | 1366×768 |
| Desktop | 1920×1080 |
| Dark mode | 1366×768 |

Screenshots are in this folder as `qa-*.png`.

## 5. Photo check by eye

Every photo was viewed on contact sheets and checked against four questions: is it the right animal, is it a genuine photograph, is it child-appropriate, and is the animal clearly visible?

Earlier visual checks had already replaced several wrong picks: an Egyptian tomb painting for the cat, a spacecraft for the Iberian ribbed newt, and a shrine for the jewel beetle.

This final check replaced 13 more:

| Problem | Animals |
|---|---|
| A diagram or drawing | Gila monster (family-tree diagram), eyelash viper (book illustration) |
| The wrong life stage | Marmalade hoverfly (larva), black garden ant (nest with pupae) |
| No animal visible | Natterjack toad |
| A flock that is too small to read | Budgerigar |
| Unclear or specimen-like | Hercules beetle, periodical cicada, king cobra, golden mantella, common basilisk |
| A juvenile or chick | Starling, tawny owl |

Two species with no usable openly licensed photo were swapped for others in the same group: the southern corroboree frog for the marbled salamander, and the hairy frog (the only photo found was taxidermy) for the yellow-bellied toad.

## Known limits

- A few photos are zoo or terrarium photos, for example the Surinam toad and the Chinese giant salamander. They are genuine live animals.
- The feedback band covers the top of the photo while it is shown, for 1.3 seconds after a correct answer and 2.6 seconds after a wrong one.
