import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import Reveal from '@/components/ui/Reveal';
import { usePageMeta } from '@/hooks/use-page-meta';
import { niceGuidance } from '@/data/laterLifeResearch';

const EASE = [0.22, 1, 0.36, 1];

// This page has its own palette and typeface so that Later Life Enrichment
// reads as a separate offering from the children's work: light purple backgrounds,
// a deep green accent in place of the brand amber, and Atkinson Hyperlegible
// Next, which was designed for readers with low vision. Body copy sits at
// ink/75 or darker, and the green meets AA contrast as text and behind white.
const ACCENT = '#2F6B57';

// The "Enriching Lives Across Generations" band sits on a vivid violet
// gradient taken from its illustration's sky. Text on it is white, and the
// eyebrow uses the illustration's gold (both well above AA on the darkest
// and lightest ends of the gradient).
const GENERATIONS_BG = 'linear-gradient(160deg, #2A1D52 0%, #4B2F86 55%, #6B44A8 100%)';
const GOLD_ON_DARK = '#F7D58C';

// Hero image. Photo by Vitaly Gariev on Unsplash (unsplash.com/photos/7dvnANH_Gjo),
// used under the Unsplash License, which allows commercial use without
// attribution. Set to null to fall back to a single centred column.
const heroImage = {
  src: '/images/later-life/chess-lounge.jpg',
  alt: 'Two older men smiling as they play chess at a table in a bright lounge, with tea and biscuits beside the board.',
  width: 1600,
  height: 900,
};

const whyPoints = [
  'Some thinking skills change as people grow older, and the pattern differs a great deal from one person to the next. Normal ageing is not the same as dementia.',
  'Dementia is the name for a group of conditions that can affect memory, thinking, communication and everyday life. Alzheimer’s disease is one cause of dementia.',
  'A diagnosis never describes the whole person. People living with cognitive difficulties still have interests, preferences and the right to take part in decisions about what they do.',
];

const connectionPoints = [
  'Shared enjoyment',
  'Conversation',
  'Cooperation',
  'Friendly interaction',
  'Problem-solving with others',
  'Reconnecting with existing interests',
  'Exploring new interests',
  'Meaningful participation',
];

// Left-accent rows, the same flat treatment used for the delivery options on
// the School Information page.
const activities = [
  {
    accent: '#5E8C7A',
    title: 'Strategy Games',
    body: 'Chess, draughts and other accessible strategy games that involve planning and decision-making.',
  },
  {
    accent: '#4a7eb8',
    title: 'Logic and Spatial Puzzles',
    body: 'Single-player puzzles that involve recognising patterns, arranging pieces and working towards a solution.',
  },
  {
    accent: '#7a48c0',
    title: 'Memory and Matching Games',
    body: 'Activities involving recognition, matching and the use of visual or familiar cues.',
  },
  {
    accent: '#c05050',
    title: 'Cooperative Challenges',
    body: 'Activities that let participants solve problems together and share the experience.',
  },
  {
    accent: '#2a8c88',
    title: 'Word and Conversation Games',
    body: 'Activities that create opportunities for language, discussion and exchanging ideas.',
  },
  {
    accent: '#b8790a',
    title: 'Familiar Games and Personal Interests',
    body: 'Activities chosen around participants’ preferences, pastimes and previous experience.',
  },
];

const sessionSteps = [
  'Introduce the session and explain the activities on offer.',
  'Offer participants a choice of games.',
  'Explain the rules and show how each activity works.',
  'Help people get started.',
  'Adapt the level of help or challenge where appropriate.',
  'Encourage conversation and shared participation where it is welcomed.',
  'Let people change activity or take a break whenever they wish.',
  'Finish the session on a positive note.',
];

const organisationPoints = [
  'Access to a variety of games and puzzles',
  'A session led by a practitioner',
  'A convenient addition to your activities programme',
  'An affordable approach to recreational enrichment',
  'A wider purpose that supports educational opportunities for children',
];

const generationSteps = [
  {
    title: 'An organisation commissions a session',
    body: 'A care home or community organisation arranges enrichment sessions with Rook Foundations.',
  },
  {
    title: 'Older adults take part',
    body: 'Participants enjoy games and puzzles, led by a Rook Foundations practitioner.',
  },
  {
    title: 'Income supports our wider work',
    body: 'Income from the service contributes to Rook Foundations’ educational enrichment work.',
  },
  {
    title: 'Children gain new opportunities',
    body: 'We use that support to develop games and learning opportunities for children and young people.',
  },
];

const childOutcomes = [
  'Develop problem-solving and strategic thinking',
  'Learn to approach challenges with greater confidence',
  'Build resilience through manageable challenges',
  'Practise reflection and independent thinking',
  'Develop communication and collaborative skills',
  'Experience games as opportunities for learning and personal development',
];

const settings = [
  { title: 'Residential care homes', body: 'For residents who would enjoy regular, welcoming activity.' },
  { title: 'Nursing homes', body: 'Where the activities are appropriate and agreed with the provider.' },
  { title: 'Day centres for older adults', body: 'Group sessions for people who come together during the day.' },
  { title: 'Community organisations', body: 'Groups and clubs supporting older people in their local area.' },
  { title: 'Other suitable settings', body: 'Residential or community-based places where the sessions would fit.' },
];

const whoMayEnjoy = [
  'Older people who enjoy puzzles and recreational games',
  'People who would like to try something unfamiliar',
  'People who value company and shared experiences',
  'People who would like opportunities to stay mentally engaged',
  'People who experience loneliness or have fewer chances for meaningful participation',
  'Some people with mild cognitive difficulties or early-stage dementia, where taking part is appropriate and suitable adjustments can be made',
];

const principles = [
  { title: 'Dignity', body: 'Every participant is treated as an adult with a lifetime of interests and experience.' },
  { title: 'Choice', body: 'People choose what they play, with whom, and for how long.' },
  { title: 'Accessibility', body: 'We adapt activities where practicable so that more people can join in.' },
  { title: 'Appropriate challenge', body: 'Games should feel absorbing, not stressful, and never a test.' },
  { title: 'A welcoming environment', body: 'A calm, friendly session that people are glad to be part of.' },
  { title: 'Voluntary participation', body: 'Joining in is always optional, and people can stop at any time.' },
];

function SectionHeader({ eyebrow, title, intro, className = '', onDark = false }) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <span
        className="inline-flex items-center gap-1.5 font-hyperlegible text-sm font-800 uppercase tracking-widest mb-4"
        style={{ color: onDark ? GOLD_ON_DARK : ACCENT }}
      >
        {eyebrow}
      </span>
      <h2
        className={`font-hyperlegible font-700 ${onDark ? 'text-white' : 'text-[#1E2B26]'}`}
        style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`font-hyperlegible text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed ${
            onDark ? 'text-white/85' : 'text-[#1E2B26]/75'
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

function AccentRow({ accent, title, body, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06, ease: EASE }}
      className="pl-4 pr-2 py-3 border-l-[3px] rounded-r-lg"
      style={{ borderColor: accent }}
    >
      <h3 className="font-hyperlegible font-700 text-[#1E2B26] text-lg leading-tight">{title}</h3>
      <p className="font-hyperlegible text-[#1E2B26]/75 text-base leading-relaxed mt-1.5">{body}</p>
    </motion.div>
  );
}

function BulletList({ items, className = '' }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 font-hyperlegible text-[#1E2B26]/80 text-base leading-relaxed">
          <span className="mt-[0.6rem] h-1.5 w-1.5 rounded-full flex-shrink-0 bg-[#2F6B57]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function LaterLifeEnrichment() {
  usePageMeta(
    'Later Life Enrichment | Games and Puzzles for Older Adults | Rook Foundations',
    'Chess, strategy games and puzzles for older adults in care homes and community settings, led by a Rook Foundations practitioner. Affordable recreational enrichment that also helps fund educational enrichment for children.'
  );
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#F4F1FA] pt-32">

      {/* Hero */}
      <section className="relative overflow-hidden pt-8 pb-20">
        <div
          className={`max-w-6xl mx-auto px-6 lg:px-12 relative z-10 ${
            heroImage ? 'grid lg:grid-cols-2 gap-12 lg:gap-16 items-center' : 'max-w-3xl text-center'
          }`}
        >
          <Reveal className={heroImage ? 'text-center lg:text-left' : ''}>
            <span
              className="inline-flex items-center gap-1.5 font-hyperlegible text-sm font-800 uppercase tracking-widest mb-5"
              style={{ color: ACCENT }}
            >
              For care homes and community settings
            </span>
            <h1 className="font-hyperlegible font-700 text-[#1E2B26] leading-[1.1] mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Later Life Enrichment
            </h1>
            <p className="font-hyperlegible font-700 mb-6" style={{ color: ACCENT, fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
              Games and puzzles for older adults
            </p>
            <p className="font-hyperlegible text-[#1E2B26]/80 text-lg leading-relaxed">
              Rook Foundations brings chess, strategy games, puzzles and other accessible activities to care homes, day centres and community organisations. Our practitioner brings the games, introduces them and supports everyone to take part at a comfortable pace.
            </p>
            <p className="font-hyperlegible text-[#1E2B26]/80 text-lg leading-relaxed mt-4">
              Every session also helps us develop educational enrichment for children and young people.
            </p>

            <div className={`mt-8 flex flex-col sm:flex-row items-center gap-4 ${heroImage ? 'justify-center lg:justify-start' : 'justify-center'}`}>
              <MotionLink
                whileTap={ctaTap}
                to="/contact"
                onClick={() => window.scrollTo(0, 0)}
                className="inline-flex items-center justify-center gap-2 bg-[#2F6B57] text-white font-hyperlegible font-700 text-lg px-8 py-4 rounded-2xl hover:bg-[#245446] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2F6B57]/25"
              >
                Discuss a Session
                <ArrowRight size={18} />
              </MotionLink>
              <a
                href="#session"
                className="font-hyperlegible font-700 text-base underline underline-offset-4 decoration-[#2F6B57] decoration-2 text-[#1E2B26] hover:text-[#2F6B57] transition-colors py-2"
              >
                What does a session look like?
              </a>
            </div>

            <p className="font-hyperlegible text-[#1E2B26]/70 text-sm leading-relaxed mt-6">
              Recreational enrichment for older adults. This is not a clinical service or a medical treatment.
            </p>
          </Reveal>

          {heroImage && (
            <Reveal direction="left" delay={0.1}>
              <figure className="rounded-3xl overflow-hidden border border-[#1E2B26]/10 shadow-lg shadow-[#1E2B26]/5 bg-white">
                <img
                  src={heroImage.src}
                  alt={heroImage.alt}
                  width={heroImage.width}
                  height={heroImage.height}
                  className="w-full h-auto block"
                />
              </figure>
            </Reveal>
          )}
        </div>
      </section>

      {/* Why games and puzzles */}
      <section className="py-20 bg-white border-y border-[#1E2B26]/8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <SectionHeader eyebrow="The idea" title="Why games and puzzles?" />
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <Reveal className="space-y-4 font-hyperlegible text-[#1E2B26]/80 text-base sm:text-lg leading-relaxed">
              <p>
                Games and puzzles ask people to look closely, plan ahead, make choices and work things out. They can be enjoyed alone or alongside others, and many people already have a favourite. Thinking, choice and company together make them a natural fit for recreational enrichment.
              </p>
              <p>
                Our sessions are built around enjoyment and taking part. They offer opportunities for cognitive engagement, problem-solving and conversation, at a level of challenge that suits each person.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="bg-[#E9E3F5] border border-[#1E2B26]/10 rounded-3xl p-7 sm:p-8">
              <h3 className="font-hyperlegible font-700 text-[#1E2B26] text-xl mb-4 leading-snug">
                Ageing, memory and dementia
              </h3>
              <BulletList items={whyPoints} />
              <p className="font-hyperlegible text-[#1E2B26] text-base leading-relaxed mt-6 pt-6 border-t border-[#1E2B26]/10 font-700">
                Rook Foundations&rsquo; games and activities are intended to encourage cognitive engagement and meaningful participation. They are not a treatment for dementia, and the service cannot promise to prevent dementia or slow the progression of cognitive decline.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Connection and shared enjoyment */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <SectionHeader
            eyebrow="Time together"
            title="Shared time, shared enjoyment"
            intro="A game gives people something to do together and a reason to talk. Some residents enjoy trying something new. Others prefer a familiar game, a quiet one-to-one session, or conversation that grows naturally around the table."
          />
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <Reveal>
              <h3 className="font-hyperlegible font-700 text-[#1E2B26] text-xl mb-4">Games can create opportunities for</h3>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {connectionPoints.map((p) => (
                  <li key={p} className="flex gap-3 font-hyperlegible text-[#1E2B26]/80 text-base leading-snug">
                    <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full flex-shrink-0 bg-[#2F6B57]" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="space-y-4 font-hyperlegible text-[#1E2B26]/80 text-base leading-relaxed">
              <p>
                Many older people experience loneliness or have fewer chances to take part in activities that feel meaningful. Welcoming, structured group activity is one way to create those chances. It cannot remove loneliness or treat low mood, and we do not claim that it can.
              </p>
              <p>
                Later life can also bring loss and difficult periods. Some people welcome the chance to enjoy an activity and spend time with others during those times. Our sessions are recreational enrichment that can sit alongside other support. They are not counselling or psychological treatment, and a game is never a substitute for being able to talk about loss when someone wants to.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-20 bg-white border-y border-[#1E2B26]/8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          <SectionHeader
            eyebrow="Our activities"
            title="A Variety of Games, Puzzles and Activities"
            intro="Our practitioner brings a selection and chooses with the group. Nothing is fixed in advance, and we are glad to bring games people already know."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
            {activities.map((a, i) => (
              <AccentRow key={a.title} index={i} {...a} />
            ))}
          </div>

          <Reveal className="mt-12 bg-[#F4F1FA] border border-[#1E2B26]/10 rounded-3xl p-7 sm:p-10">
            <span
              className="inline-flex items-center rounded-full border border-[#2F6B57]/40 px-3 py-1 font-hyperlegible text-xs font-800 uppercase tracking-wider mb-4"
              style={{ color: ACCENT }}
            >
              In development
            </span>
            <h3 className="font-hyperlegible font-700 text-[#1E2B26] text-xl sm:text-2xl leading-snug mb-4">
              Our own games, tournaments and leagues
            </h3>
            <div className="space-y-4 font-hyperlegible text-[#1E2B26]/80 text-base sm:text-lg leading-relaxed">
              <p>
                We are in the process of designing our own games for these sessions. We also plan to run tournaments, so that people can play against each other.
              </p>
              <p>
                Over time, we aim to add leaderboards. Points gathered at the end of each session would count towards a league or points system. The aim is to encourage people to think and learn, and to give them more opportunities to make connections with one another.
              </p>
              <p className="text-[#1E2B26]/75 text-base">
                Taking part in tournaments and leagues will always be optional, and people will still be able to play simply for enjoyment.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Session */}
      <section id="session" className="py-20 bg-[#E9E3F5] relative overflow-hidden scroll-mt-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <SectionHeader
            eyebrow="Proposed session format"
            title="What Does a Session Look Like?"
            intro="A Rook Foundations practitioner brings a selection of games and puzzles to your organisation. This is how we plan to run sessions. The exact format is agreed with each organisation so that it fits your residents, your space and your day."
          />

          <div className="max-w-3xl mx-auto">
            <Reveal>
              <h3 className="font-hyperlegible font-700 text-[#1E2B26] text-xl mb-4">During a session, the practitioner could</h3>
              <ol className="space-y-4">
                {sessionSteps.map((step, i) => (
                  <li key={step} className="flex gap-4 items-start">
                    <span
                      className="flex-shrink-0 h-8 w-8 rounded-full border-2 border-[#2F6B57] bg-white flex items-center justify-center font-hyperlegible font-700 text-[#1E2B26] text-base leading-none"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span className="font-hyperlegible text-[#1E2B26]/80 text-base sm:text-lg leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="font-hyperlegible text-[#1E2B26]/75 text-base leading-relaxed mt-6">
                Depending on what is agreed with your organisation, activities can be offered individually, in small groups, or both. A session is relaxed recreation, never an assessment.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Affordable, practitioner-led */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          <SectionHeader
            eyebrow="For your organisation"
            title="Affordable, practitioner-led enrichment"
            intro="We want engaging activities to be within reach of care providers, without you having to buy a large collection of games or plan a whole programme yourselves."
          />
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <Reveal>
              <BulletList items={organisationPoints} />
            </Reveal>
            <Reveal delay={0.1} className="space-y-4 font-hyperlegible text-[#1E2B26]/80 text-base leading-relaxed">
              <p>
                A Rook Foundations practitioner brings the games and puzzles and leads the session, so your team does not have to prepare or source anything.
              </p>
              <p>
                Sessions are designed to complement the work of your activities team. They do not replace care staff, occupational therapists or other professionals.
              </p>
              <p>
                We do not publish a price on this page. Please{' '}
                <MotionLink
                  whileTap={ctaTap}
                  to="/contact"
                  onClick={() => window.scrollTo(0, 0)}
                  className="font-700 underline underline-offset-4 decoration-[#2F6B57] decoration-2 text-[#1E2B26] hover:text-[#2F6B57]"
                >
                  get in touch
                </MotionLink>{' '}
                to ask about availability, possible arrangements, costs and whether the sessions would suit your setting.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Enriching Lives Across Generations */}
      <section id="generations" className="py-20 relative overflow-hidden scroll-mt-24" style={{ background: GENERATIONS_BG }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <SectionHeader
            eyebrow="Our wider purpose"
            title="Enriching Lives Across Generations"
            intro="At Rook Foundations, we believe games can create meaningful opportunities for people at different stages of life. Our Later Life Enrichment service brings engaging activities to older adults, while the income it generates helps us develop educational games and enrichment opportunities for children and young people."
            className="!mb-10"
            onDark
          />

          {/* Illustration, generated as SVG; it deliberately looks unlike the
              rest of the site. */}
          <Reveal>
            <figure className="mb-12">
              <img
                src="/images/later-life/generations.svg"
                alt="A surreal dawn over a chessboard stretching to the horizon. A king and queen stand together on the left. Gold coins rise from them in an arc across the sky and turn into birds as they fly towards a small glowing pawn standing on the board."
                width={1200}
                height={640}
                loading="lazy"
                className="w-full h-auto block rounded-[2rem] shadow-2xl shadow-black/40 ring-1 ring-white/15"
              />
              <figcaption className="font-hyperlegible italic text-white/80 text-base text-center mt-4">
                From one generation&rsquo;s games, the next generation&rsquo;s first moves.
              </figcaption>
            </figure>
          </Reveal>

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {generationSteps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 shadow-lg shadow-black/20"
              >
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4B2F86] text-white font-hyperlegible font-700 text-base leading-none mb-3"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="font-hyperlegible font-700 text-[#1E2B26] text-lg leading-snug mb-2">{s.title}</h3>
                <p className="font-hyperlegible text-[#1E2B26]/80 text-base leading-relaxed">{s.body}</p>
              </motion.li>
            ))}
          </ol>

          <Reveal className="mt-12 bg-white rounded-3xl p-7 sm:p-10 shadow-lg shadow-black/20">
            <p className="font-hyperlegible font-700 text-[#1E2B26] text-xl sm:text-2xl leading-snug">
              Income generated through our Later Life Enrichment service will help support the development of educational games and enrichment opportunities for children and young people.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-[#1E2B26]/10">
              <div>
                <h3 className="font-hyperlegible font-700 text-[#1E2B26] text-lg mb-3">For children and young people, we aim to help them</h3>
                <BulletList items={childOutcomes} />
              </div>
              <div className="space-y-4 font-hyperlegible text-[#1E2B26]/80 text-base leading-relaxed">
                <p>
                  This connects to how we already work with children: they are encouraged to approach a problem, receive the support they need, try again, reflect on what they have learned and apply it more independently.{' '}
                  <MotionLink
                    whileTap={ctaTap}
                    to="/our-approach"
                    onClick={() => window.scrollTo(0, 0)}
                    className="font-700 underline underline-offset-4 decoration-[#2F6B57] decoration-2 text-[#1E2B26] hover:text-[#2F6B57]"
                  >
                    Read about our learning approach
                  </MotionLink>
                  .
                </p>
                <p>
                  We also hope to create calm, supportive environments where children can practise responding constructively to challenge and to the pressures of modern life. These are aspirations for our work, not guaranteed or clinically proven outcomes.
                </p>
                <p className="text-[#1E2B26]/75">
                  The income supports Rook Foundations&rsquo; educational work as a whole. It is a shared mission, not a charge on any individual: participants are never asked to fund anything, and no session is linked to a particular child.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <SectionHeader
            eyebrow="Who it is for"
            title="Who Is It For?"
            intro="The service is intended for organisations that support older adults, and for the people who use them."
          />
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <h3 className="font-hyperlegible font-700 text-[#1E2B26] text-xl mb-4">Settings</h3>
              <div className="space-y-3">
                {settings.map((s, i) => (
                  <AccentRow key={s.title} index={i} accent="#2F6B57" {...s} />
                ))}
              </div>
            </div>
            <Reveal delay={0.1}>
              <h3 className="font-hyperlegible font-700 text-[#1E2B26] text-xl mb-4">People who may enjoy it</h3>
              <BulletList items={whoMayEnjoy} />
              <p className="font-hyperlegible text-[#1E2B26]/75 text-base leading-relaxed mt-6">
                Not every activity suits every person or every setting. We agree what is suitable with each organisation and adapt where practicable.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Person-centred approach */}
      <section className="py-20 bg-white border-y border-[#1E2B26]/8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          <SectionHeader
            eyebrow="How we work"
            title="A Thoughtful, Person-Centred Approach"
            intro="People are at the centre of every session. Taking part is always voluntary."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
            {principles.map((p, i) => (
              <AccentRow key={p.title} index={i} accent={i % 2 ? '#5E8C7A' : '#2F6B57'} {...p} />
            ))}
          </div>
          <p className="font-hyperlegible text-[#1E2B26]/75 text-base text-center leading-relaxed mt-10 max-w-2xl mx-auto">
            This follows national guidance for people living with dementia, which recommends offering a range of activities tailored to the person&rsquo;s preferences (
            <a
              href={niceGuidance.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-700 underline underline-offset-4 decoration-[#2F6B57] decoration-2 text-[#1E2B26] hover:text-[#2F6B57]"
            >
              {niceGuidance.text}
            </a>
            ).
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#2F6B57] py-20 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl mx-auto px-6 lg:px-12 text-center relative z-10"
        >
          <h2 className="font-hyperlegible font-700 text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
            Let&rsquo;s talk about a session
          </h2>
          <p className="font-hyperlegible text-white text-lg leading-relaxed mb-4 max-w-xl mx-auto">
            A Rook Foundations practitioner can bring games, puzzles and meaningful activities to your residents or members, with sessions shaped around your setting.
          </p>
          <p className="font-hyperlegible text-white text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Every session also helps us invest in educational enrichment for children and young people. Get in touch to ask about availability, arrangements and pricing.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 bg-white text-[#1E2B26] font-hyperlegible font-700 text-lg px-8 py-4 rounded-2xl hover:bg-[#E9E3F5] transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Discuss a Session <ArrowRight size={18} />
          </MotionLink>
        </motion.div>
      </section>
    </div>
  );
}
