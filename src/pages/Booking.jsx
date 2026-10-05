import { useEffect } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import Reveal from '@/components/ui/Reveal';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import WhatHappensNextSection from '@/components/booking/WhatHappensNextSection';
import { usePageMeta } from '@/hooks/use-page-meta';

// Each format has its own colour so the two read as different things while
// still sitting in the same palette as the rest of the site. `deep` is a
// darker shade of the same colour used wherever the colour is applied to
// text, so it stays readable.
const STRATEGY = { accent: '#2d8c62', deep: '#1f6b4a' };
const CHESS = { accent: '#b8790a', deep: '#8a5a06' };

// Games children may meet in the Strategy Games format. A selection, not a
// fixed list: the point of the format is that the activity changes.
const gameExamples = ['Quoridor', 'Mastermind', 'Tower of Hanoi', 'Go', 'Reversi', 'Quarto', 'Pylos', 'Marble Solitaire'];

// What the format gives children opportunities to practise. Deliberately
// phrased as opportunities, not outcomes.
const practiceAreas = [
  'strategic thinking',
  'planning',
  'problem solving',
  'decision making',
  'concentration',
  'communication',
  'reasoning',
  'adapting to new rules and situations',
  'persistence',
  'reflection',
];

function FormatHeading({ label, title, tagline, colour }) {
  return (
    <div className="lg:self-start">
      <div className="mb-5 h-[3px] w-12 rounded-full" style={{ backgroundColor: colour.accent }} aria-hidden="true" />
      <p className="font-nunito text-sm font-800 uppercase tracking-widest" style={{ color: colour.deep }}>
        {label}
      </p>
      <h2 className="mt-2 font-fredoka leading-tight text-[#2D2520]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
        {title}
      </h2>
      <p className="mt-3 font-fredoka text-lg italic leading-snug text-[#2D2520]/80">{tagline}</p>
    </div>
  );
}

export default function Booking() {
  usePageMeta(
    'Explore Sessions | Rook Foundations',
    'Explore the two main Rook Foundations session formats for school after-school and lunchtime clubs: Strategy Games, and a dedicated Chess Club that builds progressively.'
  );
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">
      {/* Introduction */}
      <section className="relative overflow-hidden pb-16 pt-14">
        <ChessBg variant="booking" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
          <span className="mb-5 inline-flex items-center font-nunito text-sm font-800 uppercase tracking-widest text-[#b8790a]">
            Sessions for school clubs
          </span>
          <h1 className="mb-6 font-fredoka leading-[1.1] text-[#2D2520]" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Two ways to bring games into school clubs
          </h1>
          <p className="mx-auto max-w-2xl font-nunito text-lg leading-relaxed text-[#2D2520]/80">
            Rook Foundations currently offers two main session formats for after-school and lunchtime clubs in schools: Strategy Games and Chess Club. Both use games and structured activities to give children opportunities to think, communicate, solve problems and work things out for themselves. Each has a different focus.
          </p>
          <p className="mx-auto mt-4 max-w-2xl font-nunito text-base leading-relaxed text-[#2D2520]/75">
            These are our current main formats, and both are available now. More options will be introduced as Rook Foundations develops.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
            <a
              href="#strategy-games"
              className="group inline-flex min-h-11 items-center gap-2 font-fredoka text-lg text-[#2D2520] transition-colors hover:text-[#1f6b4a]"
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: STRATEGY.accent }} aria-hidden="true" />
              Strategy Games
              <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
            <a
              href="#chess-club"
              className="group inline-flex min-h-11 items-center gap-2 font-fredoka text-lg text-[#2D2520] transition-colors hover:text-[#8a5a06]"
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: CHESS.accent }} aria-hidden="true" />
              Chess Club
              <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Format 1: Strategy Games */}
      <section id="strategy-games" className="relative scroll-mt-24 overflow-hidden border-t border-[#2D2520]/10 py-20">
        <div className="relative z-10 mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:px-12">
          <FormatHeading
            label="Format one"
            title="Strategy Games"
            tagline="A varied programme of games, puzzles and activities."
            colour={STRATEGY}
          />

          <Reveal className="space-y-5">
            <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Each session draws on a different mix of strategy games, puzzles and activities. The game is the vehicle for the learning. What matters is what children do with it: making a decision, noticing a pattern, planning a few moves ahead, or trying something different when the first idea does not work.
            </p>

            <h3 className="pt-3 font-fredoka text-xl text-[#2D2520]">Why the games change</h3>
            <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Different games create different problems, rules and decisions. A spatial puzzle asks for something different from a game of Quoridor, and a code-breaking game like Mastermind asks for something different again. Moving between them gives children opportunities to practise thinking in different ways, and to adapt when the rules change.
            </p>
            <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Children might meet games such as{' '}
              {gameExamples.slice(0, -1).join(', ')} or {gameExamples[gameExamples.length - 1]}, alongside puzzles and hands-on activities. The activity changes from session to session, and each one is chosen to suit the children in the group.
            </p>

            <h3 className="pt-3 font-fredoka text-xl text-[#2D2520]">What children have the opportunity to practise</h3>
            <ul className="m-0 flex list-none flex-wrap gap-x-2 gap-y-1 p-0 font-nunito text-[1.02rem] leading-relaxed text-[#2D2520]/85">
              {practiceAreas.map((area, i) => (
                <li key={area} className="flex items-center gap-2">
                  {area}
                  {i < practiceAreas.length - 1 && (
                    <span aria-hidden="true" style={{ color: STRATEGY.accent }}>·</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="font-nunito text-[0.95rem] leading-relaxed text-[#2D2520]/75">
              These are opportunities, not guarantees. Every child, and every group, is different, so sessions are adapted as they go.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Format 2: Chess Club */}
      <section id="chess-club" className="relative scroll-mt-24 overflow-hidden bg-[#F5F3EE] py-20">
        <div className="relative z-10 mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:px-12">
          <FormatHeading
            label="Format two"
            title="Chess Club"
            tagline="A dedicated chess programme with a clear progression."
            colour={CHESS}
          />

          <div>
            <Reveal className="space-y-5">
              <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
                Strategy Games moves between many games. Chess Club stays with one and builds on it. Children learn and practise the game of chess step by step, moving from how the pieces move towards playing and thinking more independently. It is designed for beginners through to intermediate players, and each child works at their own pace.
              </p>
              <MotionLink
                whileTap={ctaTap}
                to="/classes/chess-curriculum"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#E8A020] px-7 py-3.5 font-fredoka text-base font-600 text-white transition-all hover:-translate-y-0.5 hover:bg-[#d4940e] hover:shadow-lg hover:shadow-[#E8A020]/25"
              >
                See the full chess curriculum <ArrowRight size={16} aria-hidden="true" />
              </MotionLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What a session looks like, and how to book */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="page" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-12">
          <Reveal>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
              What a session looks like
            </h2>
            <p className="mt-4 font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Sessions are structured but responsive. Most move through a warm-up, an explanation or demonstration, guided activity, independent or paired practice, a game or challenge, and time to reflect. The pace, activities and level of challenge are adapted to the children in the room.
            </p>
            <p className="mt-4 font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Lunchtime clubs run for 30 minutes and after-school clubs for 60 minutes. Private sessions for individual families are also available. You can see every price on the{' '}
              <MotionLink to="/pricing" onClick={() => window.scrollTo(0, 0)} className="font-700 text-[#8a5a06] underline underline-offset-2 hover:no-underline">
                Pricing page
              </MotionLink>
              .
            </p>
          </Reveal>

          <Reveal className="mt-14 border-t border-[#2D2520]/10 pt-12 text-center">
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Both formats are available to book now. Sessions are arranged with you first: get in touch to agree what suits your school or family, then book the agreed sessions on the Pricing page.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <MotionLink
                whileTap={ctaTap}
                to="/contact"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#E8A020] px-7 py-3.5 font-fredoka text-base font-600 text-white transition-all hover:-translate-y-0.5 hover:bg-[#d4940e] hover:shadow-lg hover:shadow-[#E8A020]/25"
              >
                Get in touch <ArrowRight size={16} aria-hidden="true" />
              </MotionLink>
              <MotionLink
                whileTap={ctaTap}
                to="/pricing#book"
                className="inline-flex min-h-11 items-center gap-1.5 font-nunito text-sm font-700 text-[#8a5a06] underline underline-offset-4 hover:no-underline"
              >
                Already agreed? Book on the Pricing page <ArrowRight size={14} aria-hidden="true" />
              </MotionLink>
            </div>
            <p className="mt-8 font-nunito text-sm text-[#2D2520]/75">
              Want to know more about the thinking behind the sessions?{' '}
              <MotionLink to="/our-approach" onClick={() => window.scrollTo(0, 0)} className="font-700 text-[#8a5a06] underline underline-offset-2 hover:no-underline">
                Explore how we teach
              </MotionLink>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="bg-[#F5F3EE] pb-24 pt-20">
        <WhatHappensNextSection />
      </section>
    </div>
  );
}
