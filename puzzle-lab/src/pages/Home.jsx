import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ExerciseCard from '@/components/ExerciseCard';
import { EXERCISES } from '@/data/exercises';

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden py-16 sm:py-20 border-b border-gold/10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, ${'#F4C26130'} 0%, transparent 40%), radial-gradient(circle at 80% 60%, ${'#4a7eb820'} 0%, transparent 40%)`,
          }}
        />
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 font-nunito text-gold-deep text-sm font-800 uppercase tracking-widest mb-5">
            <Sparkles size={14} /> Ages 5–12
          </span>
          <h1 className="font-fredoka text-ink mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
            A playground for young minds
          </h1>
          <p className="font-nunito text-ink/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Puzzle Lab is a free collection of puzzles and thinking games from Rook Foundations —
            no accounts, no saved scores, just a bit of brain-stretching fun. Pick a puzzle below
            and choose a level that fits.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {EXERCISES.map((exercise, i) => (
              <ExerciseCard key={exercise.id} exercise={exercise} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center bg-white border border-gold/15 rounded-3xl py-10 px-8">
          <h2 className="font-fredoka text-ink text-2xl mb-3">Why these puzzles?</h2>
          <p className="font-nunito text-ink/60 text-sm leading-relaxed">
            Each activity targets a different thinking skill — memory, pattern recognition, focus,
            and working memory — the same kinds of skills we build through structured play at{' '}
            <span className="font-700 text-ink/80">Rook Foundations</span>. Every puzzle has three
            levels, so children can find their own comfortable challenge and grow from there.
          </p>
        </div>
      </section>
    </div>
  );
}
