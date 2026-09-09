import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import PeopleIcon from '@/components/pricing/PeopleIcon';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import Reveal from '@/components/ui/Reveal';
import { usePageMeta } from '@/hooks/use-page-meta';

const EASE = [0.22, 1, 0.36, 1];

// Same purple/amber/green progression already used for the Individual/Pair/
// Group cards on the Pricing page — reused here rather than inventing a new
// colour language, since these three formats sit on the same personalised
// → collaborative spectrum (Paired Chess is the most 1:1, the Club is the
// most collaborative).
const sessionFormats = [
  {
    key: 'paired-chess',
    title: 'Paired Chess',
    people: 2,
    groupSize: 'Up to 2 children',
    price: '£10 per child / hour',
    descriptor: 'Personalised Learning',
    descriptorStyle: 'bg-[#7a48c0] text-white',
    cardStyle: 'bg-[#7a48c0]/10 border-[#7a48c0]/30',
    description:
      "Our chess sessions are designed for children who are interested in developing their chess skills alongside an experienced player. Sessions are deliberately kept small, allowing the tutor to provide individualised guidance, questioning and feedback. Children are encouraged to explain their decisions, consider alternative moves and reflect on their thinking throughout the session. The format provides a more structured and personalised learning experience than our larger group sessions.",
    bestSuitedFor: 'Children developing their chess skills who benefit from close guidance and discussion.',
    note: 'Chess sessions are currently limited to a maximum of two children when delivered as a paired session. An individual chess option is also available at £18 per child, per hour — see pricing below.',
  },
  {
    key: 'strategy-reasoning',
    title: 'Strategy and Reasoning Sessions',
    people: 4,
    groupSize: 'Up to 4 children',
    price: '£8 per child / hour',
    descriptor: 'Small-Group Learning',
    descriptorStyle: 'bg-[#b8790a] text-white',
    cardStyle: 'bg-amber-50/60 border-[#E8A020]/30 shadow-lg shadow-[#E8A020]/8',
    description:
      'These sessions use a variety of strategy, logic and visual-spatial games, including a range of SmartGames-style challenges and puzzles. Children work through carefully selected challenges designed to encourage them to reason, problem-solve and explain how they arrived at a solution. With groups of up to four, the tutor can provide a high level of interaction and personalised support. Sessions include structured questioning, reflective practice and detailed observation and note-taking, helping to create a richer learning experience for each child.',
    bestSuitedFor: 'Children developing logical reasoning, problem-solving and visual-spatial skills.',
    note: 'These sessions are distinct from the larger Strategy Game Club below — they are more structured, more personalised and more reflective.',
  },
  {
    key: 'strategy-game-club',
    title: 'Strategy Game Club',
    people: 8,
    groupSize: 'Up to 8 children',
    price: '£5 per child / hour',
    descriptor: 'Collaborative Learning',
    descriptorStyle: 'bg-[#2d8c62] text-white',
    cardStyle: 'bg-green-50/60 border-green-200',
    description:
      'Our club sessions give more children the opportunity to explore strategy games and puzzles together. Children rotate between a variety of activities, working individually, in pairs or collaboratively to complete different challenges. Each activity is supported by structured questions and specific challenges, encouraging children to think carefully about their approach and attempt different solutions. Unlike our smaller sessions, the club is less personalised and reflective, but allows a greater number of children to participate within the same session.',
    bestSuitedFor: 'Schools looking to introduce strategy games to a larger group of children through an engaging, collaborative club format.',
    note: 'The Strategy Game Club is not a chess session — it focuses on other strategy, logic and puzzle-based games.',
  },
];

// Left-accent row treatment reused verbatim from SessionIncludesGrid (the
// "What's consistent about every session" list on the Our Learning Approach
// page) — flat, no card background, deliberately lighter than the session
// cards above so this section reads as options rather than another set of
// products to choose between.
const deliveryOptions = [
  {
    accent: '#2d8c62',
    title: 'Lunchtime Workshops',
    body: 'A structured strategy-game activity that can be incorporated into the school lunch period.',
  },
  {
    accent: '#4a7eb8',
    title: 'In-School Workshops',
    body: 'Sessions delivered during the school day, either as a one-off experience or as part of a planned programme.',
  },
  {
    accent: '#7a48c0',
    title: 'After-School Clubs',
    body: 'Regular strategy-game sessions providing children with an engaging activity beyond the school day.',
  },
  {
    accent: '#c05050',
    title: 'Multi-Session Programmes',
    body: 'A sequence of structured sessions for smaller groups, allowing children to develop their skills progressively over time.',
  },
  {
    accent: '#2a8c88',
    title: 'One-Off Experiences',
    body: 'Schools can also bring Rook Foundations in for a single workshop or experience without committing to a longer programme.',
  },
];

// Two funding models schools can choose between. Presented as two equal
// neutral cards (bg-white border, NOT the coloured play-card treatment used
// for the three session formats above) so this doesn't read as a fourth or
// fifth "product" to pick between — it's a different kind of choice
// (how payment works), so it gets a visually distinct, quieter treatment.
// Parent-funded is established as the default through ORDER and a small
// pill tag, not through making the other card smaller or duller — both
// cards are the same size/weight so School-Funded doesn't read as
// secondary. The second card renders an invisible copy of the same tag
// purely so both headings align at the same height across the row.
const fundingModels = [
  {
    key: 'parent-funded',
    tag: 'Our standard model',
    showTag: true,
    title: 'Parent-Funded Extracurricular Activities',
    body: "Our standard extracurricular provision is designed to be simple for schools. Rook Foundations manages bookings, payments and parent communication directly, meaning there is no direct cost to the school. The school simply provides a suitable space and helps let families know the sessions are available.",
  },
  {
    key: 'school-funded',
    tag: 'Our standard model',
    showTag: false,
    title: 'School-Funded Enrichment Programmes',
    body: "Schools can also commission Rook Foundations directly to provide funded enrichment programmes, workshops or targeted sessions for pupils — from a single themed workshop to a structured programme for a specific year group. These can be tailored to the school's objectives, timetable and available budget.",
  },
];

const pricingRows = [
  { label: 'Individual chess', groupSize: '1 child', price: '£18 / hour' },
  { label: 'Paired chess', groupSize: 'Up to 2 children', price: '£10 per child / hour' },
  { label: 'Strategy & reasoning', groupSize: 'Up to 4 children', price: '£8 per child / hour' },
  { label: 'Strategy Game Club', groupSize: 'Up to 8 children', price: '£5 per child / hour' },
  { label: '8-child club session', groupSize: '8 children', price: '£40 / hour', subPrice: '(£5 per child)', highlight: true },
];

function SessionFormatCard({ format, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`play-card relative flex flex-col border rounded-3xl p-7 ${format.cardStyle}`}
    >
      <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${format.descriptorStyle} font-nunito text-xs font-700 px-4 py-1.5 rounded-full shadow-md whitespace-nowrap`}>
        {format.descriptor}
      </span>

      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-2xl bg-[#E8A020]/10 flex items-center justify-center">
          <PeopleIcon count={format.people} size={format.people > 4 ? 34 : 40} style={{ color: '#E8A020' }} />
        </div>
      </div>

      <div className="mb-5 text-center">
        <h3 className="font-fredoka text-[#2D2520] text-2xl leading-tight">{format.title}</h3>
        <p className="font-nunito text-[#E8A020] text-sm font-700 mt-1.5">
          {format.groupSize} · {format.price}
        </p>
      </div>

      <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mb-5">
        {format.description}
      </p>

      <div className="mt-auto pt-4 border-t border-[#2D2520]/8">
        <p className="font-fredoka text-[#2D2520] text-sm font-600 mb-1.5">Best suited for</p>
        <p className="font-nunito text-[#2D2520]/60 text-xs leading-relaxed mb-4">{format.bestSuitedFor}</p>
        <p className="font-nunito text-[#2D2520]/45 text-xs leading-relaxed italic">{format.note}</p>
      </div>
    </motion.div>
  );
}

function DeliveryRow({ option, index }) {
  const { accent, title, body } = option;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06, ease: EASE }}
      className="pl-4 pr-2 py-3 border-l-[3px] rounded-r-lg transition-colors duration-200 hover:bg-[#2D2520]/[0.025]"
      style={{ borderColor: accent }}
    >
      <h3 className="font-fredoka text-[#2D2520] text-base leading-tight">{title}</h3>
      <p className="font-nunito text-[#2D2520]/55 text-sm leading-snug mt-1.5">{body}</p>
    </motion.div>
  );
}

export default function Schools() {
  usePageMeta(
    'Strategy Games for Schools | Rook Foundations',
    'Rook Foundations brings structured strategy-game sessions, workshops and clubs into schools — building strategic thinking, logical reasoning and visual-spatial skills through chess and puzzle-based play.'
  );
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">

      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="schools" />
        <Reveal className="max-w-3xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            For schools
          </span>
          <h1 className="font-fredoka text-[#2D2520] leading-[1.1] mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Strategy Games for Schools
          </h1>
          <p className="font-fredoka text-[#E8A020] mb-6" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
            Building thinking skills through play
          </p>
          <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed max-w-2xl mx-auto">
            Rook Foundations provides structured strategy-game experiences designed to develop children's strategic thinking, logical reasoning and visual-spatial skills.
          </p>
          <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed max-w-2xl mx-auto mt-4">
            Sessions can range from highly personalised small-group learning to larger, collaborative game sessions, allowing schools to choose an approach that suits their pupils, timetable and objectives.
          </p>
          <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed max-w-2xl mx-auto mt-4">
            Rook Foundations takes responsibility for preparing, organising and delivering each session, with activities adapted to meet the needs of the school and the children taking part.
          </p>

          {/* Quiet professional-credibility note — a scaled-down version of
              the homepage hero's "Trusted & Connected" coda (same hairline
              border + muted icon-led chip treatment), sized for a single
              fact rather than a row of badges, and placed last so it reads
              as a closing reassurance rather than a claim. */}
          <div className="max-w-md mx-auto mt-10 pt-8 border-t border-[#2D2520]/8 flex items-center justify-center gap-2">
            <GraduationCap size={15} className="text-[#E8A020] flex-shrink-0" aria-hidden="true" />
            <p className="font-nunito text-[#2D2520]/60 text-xs sm:text-sm">
              <span className="font-700">Professional Membership:</span> Led by a Professional Affiliate Member of the Chartered College of Teaching.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Our Sessions */}
      <section className="py-20 bg-white border-y border-[#2D2520]/8 relative overflow-hidden">
        <ChessBg variant="page" />
        <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-14">
            <span className="inline-flex items-center font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              Our sessions
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Three ways to bring strategy games into your school
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-xl md:max-w-none mx-auto">
            {sessionFormats.map((format, i) => (
              <SessionFormatCard key={format.key} format={format} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Flexible Delivery */}
      <section className="py-20 relative overflow-hidden">
        <ChessBg variant="testimonials" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              Flexible delivery
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Designed to fit around your school
            </h2>
            <p className="font-nunito text-[#2D2520]/55 text-base mt-4 max-w-xl mx-auto leading-relaxed">
              Rook Foundations does not require schools to adopt a rigid programme structure. Sessions can be delivered in a variety of ways depending on what works best for your school.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
            {deliveryOptions.map((option, i) => (
              <DeliveryRow key={option.title} option={option} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Flexible Partnership Options — deliberately placed here, between
          Flexible Delivery and Pricing, so the funding model is established
          BEFORE the reader reaches a table of numbers. Without this, "£18
          per hour / £10 per child..." reads ambiguously as something the
          school itself might be expected to pay. */}
      <section className="py-20 bg-white border-y border-[#2D2520]/8 relative overflow-hidden">
        <ChessBg variant="page" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              Working with your school
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Flexible Partnership Options
            </h2>
            <p className="font-nunito text-[#2D2520]/55 text-base mt-4 max-w-xl mx-auto leading-relaxed">
              Rook Foundations can work with schools through two straightforward funding models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fundingModels.map((model, i) => (
              <motion.div
                key={model.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white border border-[#2D2520]/10 rounded-3xl p-7"
              >
                <span className={`inline-flex items-center font-nunito text-[#b8790a] bg-[#E8A020]/10 text-xs font-800 uppercase tracking-widest rounded-full px-3 py-1 mb-4 ${model.showTag ? '' : 'invisible'}`}>
                  {model.tag}
                </span>
                <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 leading-snug">{model.title}</h3>
                <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{model.body}</p>
              </motion.div>
            ))}
          </div>

          <p className="font-nunito text-[#2D2520]/55 text-sm text-center leading-relaxed mt-10 max-w-xl mx-auto">
            This flexible approach allows each school to choose the model that works best for its pupils, families and wider provision.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-[#F5F3EE] relative overflow-hidden">
        <ChessBg variant="pricing" />
        <div className="max-w-2xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              Pricing
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Simple, flexible pricing
            </h2>
            <p className="font-nunito text-[#2D2520]/55 text-base mt-4 max-w-xl mx-auto leading-relaxed">
              The rates below apply to our parent-funded extracurricular activities. School-funded programmes are quoted individually based on your school's requirements.
            </p>
          </div>

          <Reveal className="bg-white border border-[#2D2520]/10 rounded-3xl overflow-hidden shadow-sm" direction="up">
            {pricingRows.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between gap-4 px-6 py-5 ${
                  i < pricingRows.length - 1 ? 'border-b border-[#2D2520]/8' : ''
                } ${row.highlight ? 'bg-[#E8A020]/8' : ''}`}
              >
                <div>
                  <p className="font-fredoka text-[#2D2520] text-base sm:text-lg leading-snug">{row.label}</p>
                  <p className="font-nunito text-[#2D2520]/55 text-xs sm:text-sm mt-0.5">{row.groupSize}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-fredoka leading-tight ${row.highlight ? 'text-[#E8A020] text-2xl sm:text-3xl' : 'text-[#2D2520] text-lg sm:text-xl'}`}>
                    {row.price}
                  </p>
                  {row.subPrice && (
                    <p className="font-nunito text-[#2D2520]/50 text-xs mt-0.5">{row.subPrice}</p>
                  )}
                </div>
              </div>
            ))}
          </Reveal>

          <p className="font-nunito text-[#2D2520]/45 text-sm text-center italic mt-6">
            All prices are based on one-hour sessions.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#E8A020] py-20 relative overflow-hidden">
        <ChessBg variant="pricingcta" color="#ffffff" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl mx-auto px-6 lg:px-12 text-center relative z-10"
        >
          <div className="mb-6 text-center">
            <span className="text-white leading-none" style={{ fontSize: '2.5rem' }}>♜</span>
          </div>
          <h2 className="font-fredoka text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>
            A session built around your school
          </h2>
          <p className="font-nunito text-white/80 text-base leading-relaxed mb-4 max-w-xl mx-auto">
            Whether you are looking for a one-off workshop, a lunchtime activity, an after-school club or a structured programme, Rook Foundations can adapt its provision around your school's needs.
          </p>
          <p className="font-nunito text-white/80 text-base leading-relaxed mb-4 max-w-xl mx-auto">
            We take care of the planning, preparation and delivery, providing the games, challenges and structured activities required for each session.
          </p>
          <p className="font-nunito text-white/80 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            The result is a ready-to-deliver experience that gives children meaningful opportunities to think, reason, solve problems and communicate their ideas through play.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 bg-white text-[#E8A020] font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Talk to Us About Your School <ArrowRight size={18} />
          </MotionLink>
        </motion.div>
      </section>
    </div>
  );
}
