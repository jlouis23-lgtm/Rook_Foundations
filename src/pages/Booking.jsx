import { useEffect } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import Reveal from '@/components/ui/Reveal';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import WhatHappensNextSection from '@/components/booking/WhatHappensNextSection';
import { usePageMeta } from '@/hooks/use-page-meta';

// Each format has its own colour so they read as different things while
// still sitting in the same palette as the rest of the site. `deep` is a
// darker shade of the same colour used wherever the colour is applied to
// text, so it stays readable.
const STRATEGY = { accent: '#2d8c62', deep: '#1f6b4a' };
const CHESS = { accent: '#b8790a', deep: '#8a5a06' };
const SEAFORTH = { accent: '#4a7eb8', deep: '#2f5f96' };

// The order of a Seaforth Commanders session, shown as a simple sequence.
const seaforthSteps = ['Welcome', 'Choose an opponent', 'Play', 'Record the score', 'Rotate', 'Play again', 'Pack away and chat'];

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
    'Explore the three main Rook Foundations session formats for school after-school and lunchtime clubs: Strategy Games, a dedicated Chess Club that builds progressively, and Seaforth Commanders, a club for playing Seaforth against other children.'
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
            Three ways to bring games into school clubs
          </h1>
          <p className="mx-auto max-w-2xl font-nunito text-lg leading-relaxed text-[#2D2520]/80">
            Rook Foundations currently offers three main session formats for after-school and lunchtime clubs in schools: Strategy Games, Chess Club and Seaforth Commanders. All three are built around games, and each has a different focus: a varied programme of games and puzzles, a chess programme that builds step by step, and a club for playing Seaforth against other children.
          </p>
          <p className="mx-auto mt-4 max-w-2xl font-nunito text-base leading-relaxed text-[#2D2520]/75">
            These are our current main formats, and all three are available now. More options will be introduced as Rook Foundations develops.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
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
            <a
              href="#seaforth-commanders"
              className="group inline-flex min-h-11 items-center gap-2 font-fredoka text-lg text-[#2D2520] transition-colors hover:text-[#2f5f96]"
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: SEAFORTH.accent }} aria-hidden="true" />
              Seaforth Commanders
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

      {/* Format 3: Seaforth Commanders. A playing club: the game itself is the
          main activity, so this deliberately does not borrow the Chess Club's
          teaching and progression wording. */}
      <section id="seaforth-commanders" className="relative scroll-mt-24 overflow-hidden py-20">
        <div className="relative z-10 mx-auto grid max-w-6xl gap-x-16 gap-y-10 px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:px-12">
          <FormatHeading
            label="Format three"
            title="Seaforth Commanders"
            tagline="A club for playing Seaforth against other children."
            colour={SEAFORTH}
          />

          <Reveal className="space-y-5">
            <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Seaforth Commanders gives children the opportunity to play Seaforth against other children in a focused and friendly competitive environment. The game itself is the main activity. Rook Foundations provides the space, organisation, suitable pairings, scoring and fair play that let children get on with playing.
            </p>

            <h3 className="pt-3 font-fredoka text-xl text-[#2D2520]">What children can expect</h3>
            <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Children play against other children, think about the position in front of them, and play several games where time allows. The atmosphere is quiet, focused and friendly, with a healthy sense of competition. Children are welcome to talk about their games, and the room may become livelier as games get close. Many children enjoy playing their friends, trying to win, meeting different opponents, watching their scores build and talking about the close games afterwards.
            </p>

            <h3 className="pt-3 font-fredoka text-xl text-[#2D2520]">How a session works</h3>
            <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 font-nunito text-[1.02rem] font-700 leading-relaxed text-[#2D2520]/90">
              {seaforthSteps.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  {step}
                  {i < seaforthSteps.length - 1 && (
                    <span aria-hidden="true" style={{ color: SEAFORTH.deep }}>→</span>
                  )}
                </li>
              ))}
            </ol>
            <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Children choose who they would like to play first. After the first games, the practitioner organises rotations so that children meet others of broadly similar Seaforth ability. Pairings are never based on scores. If a game finishes quickly, children can move to a new opponent or reset the pieces and play again. Up to 12 children can take part, which allows up to six games at once.
            </p>
            <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              The practitioner runs the club rather than turning every game into a lesson: organising rotations, recording scores, supporting fair play and clarifying rules. If a move is not allowed, the child is told and the board is reset. A child who forgets a rule is encouraged to try to remember it first. Adults can offer advice during games, but children are encouraged to think for themselves.
            </p>
            <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Sessions run for 30 or 60 minutes. The 60-minute session follows the same format and allows more games to be played.
            </p>

            <h3 className="pt-3 font-fredoka text-xl text-[#2D2520]">Scoring</h3>
            <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              A win earns 2 points and a loss earns 1. Attendance does not earn points. Scores are recorded through the term, and everyone starts again from zero at the beginning of each new scoring period. Certificates are awarded at the end of the term.
            </p>

            <h3 className="pt-3 font-fredoka text-xl text-[#2D2520]">Who it suits</h3>
            <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Seaforth Commanders suits children who enjoy competition, playing against other children and a good mental challenge, and who can take part appropriately in a focused games setting. No previous Seaforth experience is needed, but children do need to understand the basic rules to play independently. Rook Foundations has a Seaforth workbook that introduces the game, with support from the practitioner where needed. Children who are new to Seaforth can be supported to learn it, but the club itself is about playing.
            </p>
            <p className="font-nunito text-[0.95rem] leading-relaxed text-[#2D2520]/75">
              Seaforth was created by Will Davies.
            </p>
          </Reveal>
        </div>
      </section>

      {/* What a session looks like, and how to book */}
      <section className="relative overflow-hidden border-t border-[#2D2520]/10 py-20">
        <ChessBg variant="page" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-12">
          <Reveal>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
              What a session looks like
            </h2>
            <p className="mt-4 font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              Strategy Games and Chess Club sessions are structured but responsive. Most move through a warm-up, an explanation or demonstration, guided activity, independent or paired practice, a game or challenge, and time to reflect. The pace, activities and level of challenge are adapted to the children in the room. Seaforth Commanders follows its own format, described above.
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
              All three formats are available to book now. Sessions are arranged with you first: get in touch to agree what suits your school or family, then book the agreed sessions on the Pricing page.
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
