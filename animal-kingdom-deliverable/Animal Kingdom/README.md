# Animal Kingdom: The Classification Challenge

A Finite Games science game for **Years 5–8**. A real photograph of an animal appears and the player decides
which group it belongs to: **MAMMAL, INSECT, BIRD, REPTILE or AMPHIBIAN**. Score as many as you can in
3 or 5 minutes. At the end you get your results and one animal fact with its source.

Open `animal-kingdom.html` in a browser. It must sit next to the `Images/` folder, because the photos load from there.

## How the game works

| | |
|---|---|
| Groups | Mammal, Insect, Bird, Reptile, Amphibian (no other classes) |
| Animals | 300 different species, exactly 60 per group, each with its own real photograph |
| Pathways | **Years 5–6**: the 200 Easy and Medium animals. Familiar animals come first and less familiar ones are mixed in as the game goes on. **Years 7–8**: all 300, including the 100 Challenging ones, with a wider and harder range |
| Durations | 3 or 5 minutes, for either pathway. The clock starts only when the first photo is on screen |
| Scoring | +1 for a correct answer and −1 for a wrong one. The score never goes below 0, and there are no speed points |
| Feedback | "CORRECT! Well done! A tiger is a mammal." or "NOT QUITE! A tiger is actually a mammal. Mammals have hair or fur and feed their young with milk." |
| Results | Final score, animals attempted, correct, incorrect, accuracy, pathway and time, an encouraging title, Play Again and Return to Homepage |
| Fact | One of 100 verified facts with the animal's photo and the source. It never repeats any of the last 10 facts shown on that computer |
| Keyboard | Keys 1–5 answer, for ICT-room keyboards |

### How animals are chosen (engine.js)

1. **Group**: an animal is never shown if it would make three of the same group in a row, and groups shown least so far are favoured so all five keep appearing.
2. **Difficulty**: weighted by how much of the clock has been used, so 3- and 5-minute games progress the same way.
   - Years 5–6 goes from Easy 80% / Medium 20% to Easy 35% / Medium 65%.
   - Years 7–8 goes from Easy 50% / Medium 40% / Challenging 10% to 10% / 40% / 50%.

   These are probabilities, not a fixed order, so difficulty rises without being predictable.
3. **Animal**: picked at random from that group and difficulty. No animal repeats in a game. Only a player who has seen every animal in the pathway starts again.

## Files

| File | What it is |
|---|---|
| `Animal_Kingdom_Master_Database.xlsx` | **Source of truth for animals and photos.** It has these sheets: Database Summary (live formula checks), Mammals, Insects, Birds, Reptiles, Amphibians (60 rows each) and Image Register (full licence record for each photo) |
| `Animal_Facts_Database.xlsx` | **Source of truth for the 100 facts.** It has two sheets: Animal Facts (with the supporting quote from each source) and Facts Summary |
| `Images/<Group>/` | The 300 photos, named `group_common_scientific.jpg`, for example `mammal_lion_panthera_leo.jpg` |
| `animal-kingdom.html` | The built game |
| `Documentation/QA-report.md` | QA results and screenshots |
| `content/` | The pipeline (see below) |

### Workbook columns

- **Group sheets**: Animal ID (AK-MAM-001 …), Common Name, Scientific Name, Animal Group, Difficulty, Familiarity Rank, Pathways, Image Filename, Image Source, Image URL, Photographer, Licence, Licence URL, Attribution, Attribution Required, Species Check, Visual Check, Verification Status (Confirmed/Pending) and Date Verified.
- **Image Register**: all of the above, plus local path, original file URL, commercial use allowed, modification allowed, share-alike, changes made, source size, Commons description and species check method.
- **Animal Facts**: Fact ID, Animal Name, Scientific Name, Animal Group, Linked Animal ID, Fact, Subject Category, Source Organisation, Source Title, Source URL, Supporting Quote From Source, Verification Result and Date Verified.

## Photos and licences

- Every photo is a genuine photograph from **Wikimedia Commons**. None are AI images, drawings, models, museum specimens or taxidermy.
- Each photo is licensed **CC0, Public Domain, CC BY or CC BY-SA**. Non-commercial (NC) and no-derivatives (ND) licences are never used, so the game can be sold and the photos can be resized.
- Photos are resized to at most 1024 px on the long side and saved as JPEG. That is the only change made.
- Credits appear in three places:
  - under every photo in the game
  - on the in-game **Photo credits and sources** page, which lists all 300 with links
  - in the Image Register
- Each animal was checked in two steps:
  1. The scientific name was matched to the English Wikipedia species article.
  2. The photo was looked at to confirm the right animal, a real photograph and child-appropriate content.

  A row is **Confirmed** only when both checks pass and every licence field is filled in.

## Pipeline (content/)

```
src/species.txt ─ fetch_wiki.py ─ fetch_commons.py ─ download_images.py ─┐
src/facts_final.tsv + verify_*.tsv ───────────────────────────────────────┤
                                                   make_xlsx.py (v1 seed only)
                                                              │
                    Animal_Kingdom_Master_Database.xlsx + Animal_Facts_Database.xlsx  ← edit these
                                                              │
                     export_data.py → ak-data.json → build.js → animal-kingdom.html
                                                              │
                                           validate.js (data + engine) · qa.js (browser)
```

To change content, edit the workbooks, then run:

```
cd content
python3 export_data.py      # refuses to write anything if a rule is broken
node build.js
node validate.js
node qa.js
```

`export_data.py` refuses the export in any of these cases:

- a group without exactly 60 Confirmed animals
- a duplicate ID, name or scientific name
- an empty licence field
- an NC/ND licence
- a missing image file
- anything other than exactly 100 facts
- a fact without a source

To swap a photo, put the new file in `Images/<Group>/` and update that animal's row (filename, URL, photographer, licence, licence URL and attribution).

Wikimedia rate-limits automated access heavily. The scripts cache every page they read (`src/cache/`) and back off on HTTP 429.
