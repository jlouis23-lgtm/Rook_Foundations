import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import Reveal from '@/components/ui/Reveal';
import { MotionLink } from '@/components/ui/MotionLink';
import { usePageMeta } from '@/hooks/use-page-meta';

const EASE = [0.22, 1, 0.36, 1];
const AMBER = '#b8790a';
const AMBER_DEEP = '#8a5a06';

// What children might do at an independent club. These are possibilities,
// not a timetable: not every activity will feature at every session.
const activities = [
  { title: 'Strategy games', body: 'A varied selection of games, chosen to encourage children to explore different ways of thinking.' },
  { title: 'Chess', body: 'Opportunities to learn and play chess alongside other games.' },
  { title: 'Puzzles and challenges', body: 'Problem-solving activities that encourage children to plan, predict, make decisions and explain their reasoning.' },
  { title: 'Playing together', body: "Opportunities to play, work in teams and build on one another's ideas in a fun, supportive environment." },
];

// The three ways to take part with Rook Foundations, and where each stands
// today. Availability is always written out in words, never colour alone.
const waysToTakePart = [
  {
    title: 'School programmes',
    body: "Delivered within schools as part of a school's enrichment provision, including after-school and lunchtime clubs.",
    status: 'Available now',
    link: { to: '/sessions', label: 'Explore our session formats' },
  },
  {
    title: 'Private sessions',
    body: 'Sessions arranged directly with families, separate from any club.',
    status: 'Available now',
    link: { to: '/pricing', label: 'See pricing' },
  },
  {
    title: 'Rook Foundations Clubs',
    body: 'Independently organised by Rook Foundations, with weekend sessions planned outside the school environment.',
    status: 'Coming soon',
    current: true,
  },
];

const safeguardingPoints = [
  'DBS-checked staff',
  'Safeguarding training completed',
  'Safe, structured, supervised sessions',
  "Children's welfare comes first",
];

// A heading on the left, content on the right: the same quiet two-column
// rhythm used on the Explore Sessions page.
function Block({ id, label, title, children, tint = false }) {
  return (
    <section id={id} className={`relative py-16 ${tint ? 'bg-[#F5F3EE]' : 'border-t border-[#2D2520]/10'}`}>
      <div className="relative z-10 mx-auto grid max-w-6xl gap-x-16 gap-y-6 px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:px-12">
        <div>
          <div className="mb-5 h-[3px] w-12 rounded-full bg-[#E8A020]" aria-hidden="true" />
          {label && (
            <p className="font-nunito text-sm font-800 uppercase tracking-widest" style={{ color: AMBER_DEEP }}>
              {label}
            </p>
          )}
          <h2 className="mt-2 font-fredoka leading-tight text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
            {title}
          </h2>
        </div>
        <Reveal className="space-y-5">{children}</Reveal>
      </div>
    </section>
  );
}

export default function Events() {
  usePageMeta(
    'Rook Foundations Clubs | Coming Soon',
    'Independent Rook Foundations clubs for children, planned for weekends and coming soon: strategy games, chess, puzzles and other structured activities.'
  );
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        <ChessBg variant="hero" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="mb-5 inline-flex items-center font-nunito text-sm font-800 uppercase tracking-widest" style={{ color: AMBER }}>
              Independent clubs
            </span>
            <h1 className="mb-3 font-fredoka leading-[1.1] text-[#2D2520]" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Rook Foundations Clubs
            </h1>
            <p className="mb-6 font-fredoka text-[#E8A020]" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              Coming soon
            </p>
            <p className="mx-auto max-w-2xl font-nunito text-lg leading-relaxed text-[#2D2520]/80">
              Independent clubs run by Rook Foundations, giving children opportunities to spend time playing, exploring and learning through strategy games, chess, puzzles and other structured activities.
            </p>
            <p className="mt-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2D2520]/12 bg-[#2D2520]/[0.06] px-3.5 py-1.5 font-nunito text-xs font-800 uppercase tracking-wide text-[#2D2520]/80">
                <Clock size={12} className="text-[#2D2520]/60" aria-hidden="true" /> Not yet available to book
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      <Block title="What are Rook Foundations Clubs?">
        <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
          Rook Foundations Clubs are independently organised by Rook Foundations. They take place outside the school environment, and they are separate from both our school programmes and our private sessions.
        </p>
        <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
          They are intended to give children the opportunity to attend a Rook Foundations session outside school and take part in a varied programme of activities. They will provide a different experience from school-based sessions or one-to-one and small-group private bookings.
        </p>
      </Block>

      <Block title="What might children do?">
        <dl className="m-0 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {activities.map((item) => (
            <div key={item.title}>
              <dt className="font-fredoka text-xl text-[#2D2520]">{item.title}</dt>
              <dd className="m-0 mt-1.5 font-nunito text-[1rem] leading-relaxed text-[#2D2520]/80">{item.body}</dd>
            </div>
          ))}
        </dl>
        <p className="font-nunito text-[0.95rem] leading-relaxed text-[#2D2520]/75">
          Not every activity will feature at every session. Different sessions may have different themes, and activities can be adapted over time as children become more familiar with different games and challenges.
        </p>
      </Block>

      <Block title="Planned weekend clubs" tint>
        <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
          The first planned format is weekend-based: Rook Foundations sessions for children to attend outside the school week, with opportunities to play, explore, think, solve problems and spend time with others.
        </p>
        <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
          Further details will be announced when clubs open. More club formats may be introduced as Rook Foundations develops.
        </p>
      </Block>

      {/* The distinction between the three ways to take part */}
      <section className="relative border-t border-[#2D2520]/10 py-16">
        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-12">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
              Rook Foundations Clubs are different from our school programmes
            </h2>
            <p className="mt-4 font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
              School programmes are delivered within schools and may include after-school and lunchtime enrichment sessions. Rook Foundations Clubs are independently organised by Rook Foundations and are intended to provide weekend opportunities for children to attend Rook Foundations sessions outside school.
            </p>
          </Reveal>

          <ul className="m-0 mx-auto mt-10 max-w-3xl list-none divide-y divide-[#2D2520]/10 border-y border-[#2D2520]/10 p-0">
            {waysToTakePart.map((way) => (
              <li key={way.title} className="grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
                <div>
                  <h3 className="font-fredoka text-xl text-[#2D2520]">{way.title}</h3>
                  <p className="mt-1 font-nunito text-xs font-800 uppercase tracking-widest" style={{ color: way.current ? AMBER_DEEP : '#1f6b4a' }}>
                    {way.status}
                  </p>
                </div>
                <div>
                  <p className="font-nunito text-[1rem] leading-relaxed text-[#2D2520]/80">{way.body}</p>
                  {way.link && (
                    <MotionLink
                      to={way.link.to}
                      onClick={() => window.scrollTo(0, 0)}
                      className="group mt-2 inline-flex min-h-11 items-center gap-1.5 font-nunito text-sm font-700 underline underline-offset-4 hover:no-underline"
                      style={{ color: AMBER_DEEP }}
                    >
                      {way.link.label}
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </MotionLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Block title="Safeguarding and safety" tint>
        <p className="font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
          The safety and welfare of every child is our priority, and the same standards that apply to our current sessions will carry through into Rook Foundations Clubs. We follow established safeguarding best practice to help ensure every child has a safe, supportive and positive experience.
        </p>
        <ul className="m-0 grid list-none gap-x-8 gap-y-2 p-0 sm:grid-cols-2">
          {safeguardingPoints.map((point) => (
            <li key={point} className="flex items-start gap-3 font-nunito text-[1rem] leading-relaxed text-[#2D2520]/85">
              <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8A020]" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </Block>

      {/* Closing status: clearly not bookable, and no booking pathway */}
      <section className="relative pb-24 pt-16">
        <Reveal className="relative z-10 mx-auto max-w-2xl px-6 text-center lg:px-12">
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
            Rook Foundations Clubs are coming soon
          </h2>
          <p className="mt-4 font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
            Our independent club programme is currently being developed. Further information, including locations, dates and booking details, will be added when clubs are ready to launch.
          </p>
          <p className="mt-3 font-nunito text-[0.95rem] leading-relaxed text-[#2D2520]/75">
            Clubs cannot be booked yet. Private sessions and school programmes are available now.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-8">
            <MotionLink
              to="/sessions"
              onClick={() => window.scrollTo(0, 0)}
              className="group inline-flex min-h-11 items-center gap-1.5 font-nunito text-sm font-700 underline underline-offset-4 hover:no-underline"
              style={{ color: AMBER_DEEP }}
            >
              Explore our session formats
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </MotionLink>
            <MotionLink
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="group inline-flex min-h-11 items-center gap-1.5 font-nunito text-sm font-700 underline underline-offset-4 hover:no-underline"
              style={{ color: AMBER_DEEP }}
            >
              Get in touch to hear when clubs open
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </MotionLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
