// Animal Kingdom engine: question selection, scoring and fact picking. No DOM here, so validate.js
// and qa.js can test it in Node. Data comes only from the workbooks via export_data.py (ak-data.json).
(function (root) {
  'use strict';
  var GROUPS = ['Mammal', 'Insect', 'Bird', 'Reptile', 'Amphibian'];

  // Which difficulties each pathway draws from, and how likely each is at the start (p = 0) and the end
  // (p = 1) of the game. p is the share of the clock used, so 3- and 5-minute games progress the same way.
  var PATHWAYS = {
    Y56: { label: 'Years 5–6', pool: ['Easy', 'Medium'],
      start: { Easy: 0.8, Medium: 0.2 }, end: { Easy: 0.35, Medium: 0.65 } },
    Y78: { label: 'Years 7–8', pool: ['Easy', 'Medium', 'Challenging'],
      start: { Easy: 0.5, Medium: 0.4, Challenging: 0.1 }, end: { Easy: 0.1, Medium: 0.4, Challenging: 0.5 } }
  };
  var MAX_RUN = 2; // never more than 2 animals of the same group in a row

  function weightsAt(pathway, p) {
    var cfg = PATHWAYS[pathway], w = {};
    p = Math.max(0, Math.min(1, p || 0));
    cfg.pool.forEach(function (d) { w[d] = cfg.start[d] + (cfg.end[d] - cfg.start[d]) * p; });
    return w;
  }

  function weightedPick(items, weightOf, rnd) {
    var total = 0, i;
    for (i = 0; i < items.length; i++) total += Math.max(0, weightOf(items[i]));
    if (total <= 0) return items[Math.floor(rnd() * items.length)];
    var r = rnd() * total;
    for (i = 0; i < items.length; i++) {
      r -= Math.max(0, weightOf(items[i]));
      if (r < 0) return items[i];
    }
    return items[items.length - 1];
  }

  function poolFor(animals, pathway) {
    var cfg = PATHWAYS[pathway];
    return animals.filter(function (a) { return cfg.pool.indexOf(a.difficulty) >= 0; });
  }

  // A game session. opts: { animals, pathway: 'Y56'|'Y78', seconds, rnd }
  function Session(opts) {
    this.pathway = opts.pathway;
    this.seconds = opts.seconds;
    this.rnd = opts.rnd || Math.random;
    this.pool = poolFor(opts.animals, opts.pathway);
    this.seen = {};
    this.history = []; // {id, group, difficulty, answer, correct}
    this.groupCount = {};
    GROUPS.forEach(function (g) { this.groupCount[g] = 0; }, this);
    this.score = 0; this.correct = 0; this.wrong = 0;
    this.current = null;
  }

  Session.prototype.next = function (elapsedSeconds) {
    var self = this, rnd = this.rnd;
    var p = this.seconds ? elapsedSeconds / this.seconds : 0;
    var left = this.pool.filter(function (a) { return !self.seen[a.id]; });
    if (!left.length) { this.seen = {}; left = this.pool.slice(); } // only after every animal in the pool
    // 1. group: avoid a third in a row; favour groups shown least so far so all five keep appearing
    var recent = this.history.slice(-MAX_RUN).map(function (h) { return h.group; });
    var blocked = recent.length === MAX_RUN && recent.every(function (g) { return g === recent[0]; }) ? recent[0] : null;
    var groups = GROUPS.filter(function (g) {
      return g !== blocked && left.some(function (a) { return a.group === g; });
    });
    if (!groups.length) groups = GROUPS.filter(function (g) { return left.some(function (a) { return a.group === g; }); });
    var minCount = Math.min.apply(null, groups.map(function (g) { return self.groupCount[g]; }));
    var group = weightedPick(groups, function (g) { return 1 / (1 + 1.5 * (self.groupCount[g] - minCount)); }, rnd);
    // 2. difficulty: weighted by how far through the game we are
    var inGroup = left.filter(function (a) { return a.group === group; });
    var w = weightsAt(this.pathway, p);
    var diffs = Object.keys(w).filter(function (d) { return inGroup.some(function (a) { return a.difficulty === d; }); });
    var diff = weightedPick(diffs, function (d) { return w[d]; }, rnd);
    // 3. animal: random within that group and difficulty
    var bucket = inGroup.filter(function (a) { return a.difficulty === diff; });
    var animal = bucket[Math.floor(rnd() * bucket.length)];
    this.seen[animal.id] = true;
    this.current = animal;
    return animal;
  };

  Session.prototype.answer = function (group) {
    var a = this.current;
    if (!a) return null;
    var ok = group === a.group;
    if (ok) { this.score += 1; this.correct += 1; } else { this.score = Math.max(0, this.score - 1); this.wrong += 1; }
    this.groupCount[a.group] += 1;
    this.history.push({ id: a.id, group: a.group, difficulty: a.difficulty, answer: group, correct: ok });
    this.current = null;
    return { correct: ok, animal: a, score: this.score };
  };

  Session.prototype.results = function () {
    var attempted = this.correct + this.wrong;
    return {
      score: this.score, attempted: attempted, correct: this.correct, wrong: this.wrong,
      accuracy: attempted ? Math.round(100 * this.correct / attempted) : 0,
      pathway: PATHWAYS[this.pathway].label, minutes: this.seconds / 60
    };
  };

  // Pick a fact at random, avoiding the ids in `recent` (last few games) where possible.
  function pickFact(facts, recent, rnd) {
    rnd = rnd || Math.random;
    var avoid = {};
    (recent || []).forEach(function (id) { avoid[id] = true; });
    var choices = facts.filter(function (f) { return !avoid[f.id]; });
    if (!choices.length) choices = facts;
    return choices[Math.floor(rnd() * choices.length)];
  }

  function encouragement(r) {
    if (r.attempted === 0) return { title: 'Ready when you are!', line: 'Have another go and classify as many animals as you can.' };
    var n = r.correct, s = n === 1 ? '' : 's';
    if (r.accuracy >= 90 && n >= 15) return { title: 'Animal Classification Champion!', line: 'You correctly classified ' + n + ' animal' + s + '. Great work!' };
    if (r.accuracy >= 75) return { title: 'Expert Classifier!', line: 'You correctly classified ' + n + ' animal' + s + '. Brilliant sorting!' };
    if (r.accuracy >= 50) return { title: 'Great Explorer!', line: 'You correctly classified ' + n + ' animal' + s + '. Keep looking closely at the clues.' };
    return { title: 'Keep Exploring!', line: 'You correctly classified ' + n + ' animal' + s + '. Every game teaches you more animals.' };
  }

  var api = { GROUPS: GROUPS, PATHWAYS: PATHWAYS, MAX_RUN: MAX_RUN, weightsAt: weightsAt, poolFor: poolFor,
    Session: Session, pickFact: pickFact, encouragement: encouragement };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.AKEngine = api;
})(this);
