import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Castle, RotateCcw, Lightbulb, Star, ArrowRight, UserRound, Trophy } from 'lucide-react';
import PuzzleHeader from '@/components/PuzzleHeader';
import {
  OBJECTS,
  LEVELS,
  MAX_LEVEL,
  CAPACITY,
  findConflict,
  solveLevel,
  minMovesForLevel,
  starsForMoves,
  loadProgress,
  saveLevelResult,
} from '@/lib/castleCrossing';

const COLOR = '#9c3d54';

function ObjectChip({ objId, onPointerDown, interactive, dimmed }) {
  const obj = OBJECTS[objId];
  return (
    <button
      onPointerDown={interactive ? onPointerDown : undefined}
      className="flex flex-col items-center gap-1 w-16 py-2 rounded-2xl border-2 bg-white touch-none"
      style={{
        borderColor: '#e5e0d3',
        opacity: dimmed ? 0.25 : 1,
        cursor: interactive ? 'grab' : 'default',
      }}
    >
      <span className="text-3xl leading-none">{obj.emoji}</span>
      <span className="font-nunito text-[10px] font-700 text-ink/70 text-center leading-tight">{obj.label}</span>
    </button>
  );
}

export default function CastleCrossing() {
  const [level, setLevel] = useState(1);
  const [positions, setPositions] = useState({});
  const [qmSide, setQmSide] = useState('start');
  const [ferryLoad, setFerryLoad] = useState([]);
  const [moves, setMoves] = useState(0);
  const [phase, setPhase] = useState('play'); // play | sailing | fail | win
  const [sailingTo, setSailingTo] = useState(null);
  const [failInfo, setFailInfo] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [dragging, setDragging] = useState(null);
  const [progress, setProgress] = useState(() => loadProgress());
  const [winStats, setWinStats] = useState(null);

  const timers = useRef([]);
  const levelObj = useMemo(() => LEVELS[level - 1], [level]);
  const minMoves = useMemo(() => minMovesForLevel(levelObj), [levelObj]);

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function resetLevel(lvl) {
    clearTimers();
    const lv = LEVELS[lvl - 1];
    setPositions(Object.fromEntries(lv.objects.map((o) => [o, 'start'])));
    setQmSide('start');
    setFerryLoad([]);
    setMoves(0);
    setPhase('play');
    setSailingTo(null);
    setFailInfo(null);
    setHintLevel(0);
    setDragging(null);
    setWinStats(null);
  }

  useEffect(() => {
    resetLevel(level);
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const levelProgress = progress[level];

  function findZone(x, y) {
    const el = document.elementFromPoint(x, y);
    const target = el?.closest('[data-zone]');
    return target?.getAttribute('data-zone') || null;
  }

  function handleDrop(zone, objId, source) {
    if (!zone) return;
    if (source === 'bank' && zone === 'ferry') {
      if (ferryLoad.length >= CAPACITY || ferryLoad.includes(objId)) return;
      setFerryLoad((f) => [...f, objId]);
    } else if (source === 'ferry' && zone === `bank-${qmSide}`) {
      setFerryLoad((f) => f.filter((id) => id !== objId));
    }
  }

  function beginDrag(e, objId, source) {
    if (phase !== 'play') return;
    e.preventDefault();
    setDragging({ objId, source, x: e.clientX, y: e.clientY });

    function onMove(ev) {
      setDragging((d) => (d ? { ...d, x: ev.clientX, y: ev.clientY } : d));
    }
    function onUp(ev) {
      const zone = findZone(ev.clientX, ev.clientY);
      handleDrop(zone, objId, source);
      setDragging(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  function setSail() {
    if (phase !== 'play') return;
    const departing = qmSide;
    const arriving = departing === 'start' ? 'dest' : 'start';
    const remaining = levelObj.objects.filter((o) => positions[o] === departing && !ferryLoad.includes(o));
    const conflict = findConflict(remaining, levelObj.rules);

    if (conflict) {
      setPhase('fail');
      setFailInfo(conflict);
      return;
    }

    setPhase('sailing');
    setSailingTo(arriving);
    const cargo = [...ferryLoad];

    const timer = setTimeout(() => {
      const nextPositions = { ...positions };
      cargo.forEach((o) => {
        nextPositions[o] = arriving;
      });
      const nextMoves = moves + 1;
      const allAcross = arriving === 'dest' && levelObj.objects.every((o) => nextPositions[o] === 'dest');

      setPositions(nextPositions);
      setQmSide(arriving);
      setFerryLoad([]);
      setMoves(nextMoves);

      if (allAcross) {
        const stars = starsForMoves(nextMoves, minMoves);
        const updated = saveLevelResult(level, nextMoves, stars);
        setProgress(updated);
        setWinStats({ stars, moves: nextMoves, minMoves, bestMoves: updated[level].bestMoves });
        setPhase('win');
        confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 }, colors: [COLOR, '#E8A020', '#2d8c62'] });
      } else {
        setPhase('play');
      }
    }, 900);
    timers.current.push(timer);
  }

  function nextLevel() {
    if (level >= MAX_LEVEL) return;
    setLevel((l) => l + 1);
  }

  function showHint() {
    setHintLevel((h) => Math.min(h + 1, 3));
  }

  const riskiestObject = useMemo(() => {
    const counts = {};
    levelObj.rules.forEach((r) => {
      counts[r.a] = (counts[r.a] || 0) + 1;
      counts[r.b] = (counts[r.b] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : levelObj.objects[0];
  }, [levelObj]);

  const hintText = useMemo(() => {
    if (hintLevel === 0) return null;
    if (hintLevel === 1) return 'Think about which object causes the biggest problem.';
    if (hintLevel === 2) return `Perhaps the ${OBJECTS[riskiestObject].label} should travel first.`;
    const result = solveLevel(levelObj, positions, qmSide);
    if (!result || result.path.length === 0) return "Try Reset and take a different first step!";
    const next = result.path[0];
    const bankName = next.from === 'start' ? 'the Old Castle' : 'the New Castle';
    if (next.items.length === 0) return `Try sailing back to ${next.to === 'dest' ? 'the New Castle' : 'the Old Castle'} empty-handed next.`;
    const names = next.items.map((o) => OBJECTS[o].label).join(' and ');
    return `From ${bankName}, try taking the ${names} next.`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hintLevel, positions, qmSide, levelObj, riskiestObject]);

  const ferryDockSide = phase === 'sailing' ? sailingTo : qmSide;

  function Bank({ side }) {
    const isHere = qmSide === side && phase === 'play';
    const objectsHere = levelObj.objects.filter((o) => positions[o] === side && !ferryLoad.includes(o));
    const isDest = side === 'dest';
    return (
      <div
        data-zone={`bank-${side}`}
        className="flex-1 rounded-3xl border-2 p-5 min-h-[200px]"
        style={{
          borderColor: qmSide === side ? COLOR : '#e5e0d3',
          backgroundColor: isDest ? '#faf2e0' : '#eef3ea',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl leading-none">{isDest ? '🏰' : '🏚️'}</span>
          <span className="font-fredoka text-ink text-base">{isDest ? 'New Castle' : 'Old Castle'}</span>
          {qmSide === side && (
            <span className="inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: `${COLOR}15` }}>
              <UserRound size={12} style={{ color: COLOR }} />
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {objectsHere.map((o) => (
            <ObjectChip
              key={o}
              objId={o}
              interactive={isHere}
              onPointerDown={(e) => beginDrag(e, o, 'bank')}
              dimmed={dragging?.objId === o && dragging.source === 'bank'}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
      <PuzzleHeader
        Icon={Castle}
        color={COLOR}
        title="Castle Crossing"
        description="Ferry every animal and supply safely to the new castle. Some things can't be left alone together — plan your crossings carefully."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <span className="font-nunito text-ink/70 text-sm font-700">
            Level {level} of {MAX_LEVEL} · {levelObj.name}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="font-fredoka text-ink text-lg leading-none">{moves}</div>
            <div className="font-nunito text-ink/45 text-[10px] font-800 uppercase tracking-widest mt-1">Moves</div>
          </div>
          {levelProgress?.bestMoves != null && (
            <div className="text-center">
              <div className="font-fredoka text-ink text-lg leading-none">{levelProgress.bestMoves}</div>
              <div className="font-nunito text-ink/45 text-[10px] font-800 uppercase tracking-widest mt-1">Best</div>
            </div>
          )}
          <button
            onClick={showHint}
            disabled={hintLevel >= 3 || phase !== 'play'}
            className="inline-flex items-center gap-1.5 font-nunito font-700 text-sm px-4 py-2 rounded-2xl border-2 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:hover:translate-y-0"
            style={{ borderColor: COLOR, color: COLOR }}
          >
            <Lightbulb size={15} /> Hint
          </button>
          <button
            onClick={() => resetLevel(level)}
            className="inline-flex items-center gap-1.5 font-nunito font-700 text-sm px-4 py-2 rounded-2xl border-2 hover:-translate-y-0.5 transition-all"
            style={{ borderColor: COLOR, color: COLOR }}
          >
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>

      <AnimatePresence>
        {hintText && phase === 'play' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 rounded-2xl px-4 py-3"
            style={{ backgroundColor: `${COLOR}12` }}
          >
            <Lightbulb size={16} style={{ color: COLOR }} className="flex-shrink-0" />
            <p className="font-nunito text-sm text-ink/80">{hintText}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        <div className="bg-white border border-ink/8 rounded-3xl p-6 sm:p-8">
          {phase === 'fail' && failInfo ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
              <motion.div
                animate={{ rotate: [0, -10, 10, -8, 8, 0] }}
                transition={{ duration: 0.6 }}
                className="text-6xl mb-5 flex items-center justify-center gap-3"
              >
                <span>{OBJECTS[failInfo.a].emoji}</span>
                <span>{OBJECTS[failInfo.b].emoji}</span>
              </motion.div>
              <h3 className="font-fredoka text-ink text-2xl mb-2" style={{ color: COLOR }}>
                {failInfo.consequence}
              </h3>
              <p className="font-nunito text-ink/60 text-sm mb-6 max-w-sm mx-auto">{failInfo.text}</p>
              <button
                onClick={() => resetLevel(level)}
                className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
                style={{ backgroundColor: COLOR }}
              >
                <RotateCcw size={18} /> Try Again
              </button>
            </motion.div>
          ) : phase === 'win' && winStats ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
                  >
                    <Star size={40} fill={i <= winStats.stars ? '#E8A020' : 'none'} color={i <= winStats.stars ? '#E8A020' : '#DDD8CC'} />
                  </motion.span>
                ))}
              </div>
              <h3 className="font-fredoka text-ink text-2xl mb-2">Everyone made it safely!</h3>
              <p className="font-nunito text-ink/60 text-sm mb-6">
                {winStats.moves} moves · best possible was {winStats.minMoves} · your best is {winStats.bestMoves}
              </p>
              {level >= MAX_LEVEL ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 bg-[#2d8c6215] text-[#2d8c62] font-nunito font-800 text-sm rounded-2xl py-3 px-4 max-w-xs mx-auto">
                    <Trophy size={18} /> You've crossed every castle!
                  </div>
                  <button
                    onClick={() => setLevel(1)}
                    className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
                    style={{ backgroundColor: COLOR }}
                  >
                    Play again from Level 1
                  </button>
                </div>
              ) : (
                <button
                  onClick={nextLevel}
                  className="inline-flex items-center gap-2 font-fredoka text-white text-base px-8 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
                  style={{ backgroundColor: COLOR }}
                >
                  Next Level <ArrowRight size={18} />
                </button>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col lg:flex-row items-stretch gap-4">
              <Bank side="start" />

              <div className="lg:w-40 flex-shrink-0 flex flex-col items-center justify-center gap-3 py-2">
                <div className="relative w-full h-16 lg:h-40 rounded-2xl overflow-hidden" style={{ backgroundColor: '#bcdcef' }}>
                  <motion.div
                    className="absolute text-4xl"
                    style={
                      {
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }
                    }
                    animate={{
                      left: ferryDockSide === 'start' ? '6%' : '66%',
                    }}
                    transition={{ duration: 0.85, ease: 'easeInOut' }}
                  >
                    ⛴️
                  </motion.div>
                </div>
                <div data-zone="ferry" className="flex gap-2 rounded-2xl border-2 p-2" style={{ borderColor: COLOR }}>
                  {[0, 1].map((i) => {
                    const objId = ferryLoad[i];
                    return (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-xl border-2 border-dashed flex items-center justify-center"
                        style={{ borderColor: '#DDD8CC' }}
                      >
                        {objId && (
                          <span
                            onPointerDown={(e) => beginDrag(e, objId, 'ferry')}
                            className="text-2xl cursor-grab active:cursor-grabbing touch-none"
                            style={{ opacity: dragging?.objId === objId && dragging.source === 'ferry' ? 0.25 : 1 }}
                          >
                            {OBJECTS[objId].emoji}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={setSail}
                  disabled={phase !== 'play'}
                  className="font-fredoka text-white text-sm px-5 py-2.5 rounded-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 whitespace-nowrap"
                  style={{ backgroundColor: COLOR }}
                >
                  Set Sail ⛵
                </button>
              </div>

              <Bank side="dest" />
            </div>
          )}
        </div>

        <div className="bg-[#faf7f0] rounded-2xl border border-ink/8 p-5">
          <p className="font-nunito text-ink/50 text-xs font-800 uppercase tracking-widest mb-3">Rule Book</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {levelObj.rules.map((r, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-white rounded-xl border border-ink/8 px-3 py-2.5">
                <span className="text-xl">{OBJECTS[r.a].emoji}</span>
                <span className="font-nunito text-ink/40 text-xs font-800">🚫</span>
                <span className="text-xl">{OBJECTS[r.b].emoji}</span>
                <span className="font-nunito text-ink/70 text-xs leading-snug">{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {dragging && (
          <motion.div
            className="fixed z-50 pointer-events-none text-4xl"
            style={{ left: dragging.x - 20, top: dragging.y - 20 }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1.1 }}
          >
            {OBJECTS[dragging.objId].emoji}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
