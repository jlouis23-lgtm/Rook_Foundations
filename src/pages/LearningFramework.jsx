import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ArrowDown, ChevronRight, Sparkles, BookOpen, Target, Lightbulb,
  HeartHandshake, Compass, Puzzle, Brain, RotateCcw, Share2, SlidersHorizontal, Eye, Ear,
  Hand, MessageSquare, PenLine, Search, Users, Trophy, TrendingUp, ClipboardCheck, FileText,
  UserCircle, GraduationCap, RefreshCw, Quote, MessageCircle,
} from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import Reveal from '@/components/ui/Reveal';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import { usePageMeta } from '@/hooks/use-page-meta';

const toc = [
  { id: 'purpose', label: 'Our Purpose' },
  { id: 'what-is-learning', label: 'What Learning Means' },
  { id: 'six-stages', label: 'The Six Stages' },
  { id: 'personalised', label: 'Personalised Learning' },
  { id: 'engaging', label: 'Ways of Engaging' },
  { id: 'scaffolding', label: 'Responsive Support' },
  { id: 'choice', label: 'Choice & Agency' },
  { id: 'competition', label: 'Competition & Collaboration' },
  { id: 'growth', label: 'Failure & Growth' },
  { id: 'targets', label: 'Learning Targets' },
  { id: 'evidence', label: 'Evidence & Adaptation' },
  { id: 'profile', label: 'Learner Profile' },
  { id: 'instructor', label: "The Instructor's Role" },
  { id: 'cycle', label: 'The Learning Cycle' },
  { id: 'principle', label: 'The Core Principle' },
];

const purposeSkills = [
  'concentration', 'planning', 'problem-solving', 'decision-making', 'patience',
  'persistence', 'reflection', 'adaptability', 'independent thinking', 'confidence',
];

const learningEvidence = [
  'acquire new knowledge',
  'discover or apply a new strategy',
  'solve a problem they previously could not solve',
  'improve their ability to plan',
  'explain their reasoning',
  'recognise why an approach succeeded or failed',
  'adapt their approach',
  'persevere when faced with difficulty',
  'apply strategies more independently',
  'transfer broader principles across different activities and contexts',
];

const stages = [
  {
    num: 1, accent: '#2d8c62', Icon: HeartHandshake, title: 'Relationship', purpose: 'Understand the learner.',
    body: 'I begin by building rapport and developing an understanding of the child.',
    subLabel: 'This includes understanding:',
    items: ['their interests', 'what motivates them', 'previous experience', 'confidence', 'communication', 'response to difficulty', 'engagement patterns', 'forms of encouragement that are effective for them'],
  },
  {
    num: 2, accent: '#c9860f', Icon: Compass, title: 'Curiosity', purpose: 'Create a reason to engage.',
    body: 'I create opportunities for children to become interested in the problem, activity or game.',
    subLabel: 'Curiosity may be encouraged through:',
    items: ['choice', 'questions', 'demonstrations', 'puzzles', 'challenges', 'novel games', "connections to the child's existing interests"],
  },
  {
    num: 3, accent: '#4a7eb8', Icon: Puzzle, title: 'Challenge', purpose: 'Create an opportunity for meaningful thinking.',
    body: 'I introduce a problem that provides an appropriate level of difficulty. Challenge should be sufficient to encourage thinking without unnecessarily creating frustration or disengagement.',
    subLabel: 'The instructor may adapt:',
    items: ['difficulty', 'game', 'rules', 'environment', 'group size', 'level of support'],
  },
  {
    num: 4, accent: '#7a48c0', Icon: Brain, title: 'Thinking', purpose: 'Allow the child to do the thinking.',
    body: "The child is given an opportunity to actively reason, experiment and make decisions. The instructor's role is not simply to provide answers, but to support the child in developing their own thinking.",
    subLabel: 'Children may be encouraged to:',
    items: ['consider possibilities', 'plan ahead', 'anticipate consequences', 'compare approaches', 'explain decisions', 'test ideas', 'revise their thinking'],
  },
  {
    num: 5, accent: '#c05050', Icon: RotateCcw, title: 'Reflection', purpose: 'Make learning visible.',
    body: 'Children are encouraged to consider what happened and why.',
    subLabel: 'Reflection may involve questions such as:',
    items: ['What worked?', "What didn't work?", 'Why do you think that happened?', 'What would you change next time?', 'What did you notice?'],
    extra: 'Reflection allows outcomes, including mistakes and losses, to become opportunities for learning.',
  },
  {
    num: 6, accent: '#2a8c88', Icon: Share2, title: 'Transfer', purpose: 'Connect learning beyond the immediate activity.',
    body: 'I encourage children to identify broader principles that may be useful beyond the immediate activity. I do not assume that highly specific game strategies automatically transfer into everyday life. Instead, I focus on broader behaviours and principles such as:',
    items: ['planning before acting', 'remaining focused', 'considering consequences', 'persisting through difficulty', 'adapting an approach', 'thinking before making decisions', 'reflecting on previous experiences'],
    extra: 'Transfer may occur between different games, activities and, where appropriate, wider contexts.',
  },
];

const personalisationFactors = [
  'different games', 'different levels of difficulty', 'competitive or collaborative environments',
  'visual demonstrations', 'verbal explanations', 'hands-on exploration', 'written activities',
  'independent challenges', 'questioning', 'different levels of instructor support',
  'different group sizes', 'different forms of encouragement',
];

const engagementModes = [
  { Icon: Eye, label: 'See', body: 'Demonstrations, diagrams, boards and visual examples.' },
  { Icon: Ear, label: 'Hear', body: 'Verbal explanations, discussion and questioning.' },
  { Icon: Hand, label: 'Do', body: 'Physical manipulation, gameplay, construction and hands-on problem-solving.' },
  { Icon: MessageSquare, label: 'Explain', body: 'Articulating reasoning and explaining decisions.' },
  { Icon: PenLine, label: 'Write', body: 'Recording ideas, strategies or reflections where appropriate.' },
  { Icon: Search, label: 'Explore', body: 'Independent experimentation and problem-solving.' },
];

const scaffoldingSteps = ['Independent attempt', 'Observation', 'Questioning', 'Prompt', 'Hint', 'Partial demonstration', 'Direct assistance where necessary'];

const scaffoldingFactors = ['age', 'experience', 'confidence', 'engagement', 'complexity of the task', 'previous evidence', "the child's current needs"];

const competitionStyles = [
  { title: 'For competitive learners', prompt: 'Can you beat the challenge?' },
  { title: 'For personal progression', prompt: 'Can you improve on your previous attempt?' },
  { title: 'For collaborative learners', prompt: 'Can we solve this together?' },
];

const growthStatements = [
  'Not getting something right immediately is not the same as failing to learn.',
  'A mistake can provide information.',
  'A loss can provide an opportunity to reflect.',
  'A failed attempt can reveal that an approach needs to change.',
];

const growthQuestions = ['What happened?', 'Why did it happen?', 'What could I try differently?', 'What have I learned from this attempt?'];

const progressEvidence = [
  'planning further ahead', 'pausing before acting', 'considering consequences',
  'making fewer impulsive decisions', 'explaining reasoning more clearly',
  'independently applying strategies', 'adapting strategies when circumstances change',
  'demonstrating planning across different games',
  'where appropriate, demonstrating broader planning behaviours beyond the immediate activity',
];

const evidenceChain = ['Learning Target', 'Activity', 'Teaching Approach', "Child's Response", 'Evidence', 'Adaptation', 'Next Step'];

const evidenceExample = [
  ['Target', 'Planning'],
  ['Activity', 'Chess'],
  ['Approach', 'Visual demonstration followed by questioning'],
  ['Response', 'Engaged well but initially acted impulsively'],
  ['Evidence', "Began considering opponent's response after prompting"],
  ['Adaptation', 'Allow greater independent thinking time before prompting'],
  ['Next step', 'Apply planning questions during another strategy game'],
];

const instructorCycle = ['Understanding', 'Selecting', 'Observing', 'Supporting', 'Questioning', 'Adapting', 'Reflecting'];

const instructorQuestions = [
  'What is this child working towards?',
  'How are they approaching the problem?',
  'Are they engaged?',
  'What is helping or preventing progress?',
  'What level of support is appropriate?',
  'What should we try next?',
];

const cycleStages = [
  { accent: '#2d8c62', title: 'Relationship', purpose: 'Understand the learner' },
  { accent: '#c9860f', title: 'Curiosity', purpose: 'Create a reason to engage' },
  { accent: '#4a7eb8', title: 'Challenge', purpose: 'Present an appropriate problem' },
  { accent: '#7a48c0', title: 'Thinking', purpose: 'Allow the child to reason' },
  { accent: '#c05050', title: 'Reflection', purpose: 'Understand what happened' },
  { accent: '#2a8c88', title: 'Transfer', purpose: 'Apply broader principles' },
];

function Section({ id, icon: Icon, title, children, first = false }) {
  return (
    <section id={id} className={`scroll-mt-28 py-10 ${first ? '' : 'border-t border-[#2D2520]/10'}`}>
      <h2 className="font-fredoka text-[#2D2520] text-2xl sm:text-3xl mb-5 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#E8A020]/10 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-[#E8A020]" />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 font-nunito text-[#2D2520]/75 text-base leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8A020] flex-shrink-0 mt-2.5" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function StepFlow({ steps }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <span className="font-nunito text-[#2D2520] text-sm font-700 bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-full px-4 py-2 whitespace-nowrap">
            {step}
          </span>
          {i < steps.length - 1 && <ChevronRight size={16} className="text-[#E8A020]/50 flex-shrink-0" aria-hidden="true" />}
        </div>
      ))}
    </div>
  );
}

function StageCard({ stage }) {
  const { Icon } = stage;
  return (
    <div className="bg-white border border-[#2D2520]/8 rounded-2xl p-6 sm:p-7 border-l-4" style={{ borderLeftColor: stage.accent }}>
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center font-fredoka text-white text-sm flex-shrink-0"
          style={{ backgroundColor: stage.accent }}
        >
          {stage.num}
        </span>
        <Icon size={20} style={{ color: stage.accent }} className="flex-shrink-0" />
        <h3 className="font-fredoka text-lg sm:text-xl" style={{ color: stage.accent }}>{stage.title}</h3>
      </div>
      <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">{stage.body}</p>
      {stage.subLabel && <p className="font-nunito text-[#2D2520] text-sm font-700 mb-2">{stage.subLabel}</p>}
      {stage.items && <BulletList items={stage.items} />}
      {stage.extra && <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-4">{stage.extra}</p>}
      <p className="font-nunito text-sm font-700 italic mt-5" style={{ color: stage.accent }}>Purpose: {stage.purpose}</p>
    </div>
  );
}

function ExampleCard({ title, rows }) {
  return (
    <div className="bg-white border border-[#2D2520]/10 rounded-2xl p-6">
      {title && <p className="font-fredoka text-[#2D2520] text-base mb-4">{title}</p>}
      <dl className="space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="font-nunito text-[#b8790a] text-xs font-800 uppercase tracking-wide sm:w-36 flex-shrink-0 pt-0.5">{label}</dt>
            <dd className="font-nunito text-[#2D2520]/80 text-sm leading-relaxed">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function LearningFramework() {
  usePageMeta(
    'Learning & Teaching Framework | Rook Foundations',
    "The preliminary framework behind how Rook Foundations teaches — the six-stage learning process, personalisation, responsive support and the thinking behind every session."
  );
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32 pb-24">
      {/* Header */}
      <section className="relative overflow-hidden py-16">
        <ChessBg variant="page" />

        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <Link
            to="/our-approach"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 font-nunito text-[#2D2520]/45 text-sm font-600 hover:text-[#E8A020] transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Our Learning Approach
          </Link>

          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            <BookOpen size={14} /> Learning &amp; teaching framework
          </span>

          <h1 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>
            The thinking behind every session
          </h1>

          <div className="inline-flex items-center gap-2 bg-amber-50 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-6">
            <Sparkles size={14} className="text-[#b8790a] flex-shrink-0" />
            <span className="font-nunito text-[#b8790a] text-xs font-800 uppercase tracking-wide">Version 1.0 · A developing framework</span>
          </div>

          <p className="font-nunito text-[#2D2520]/65 text-base sm:text-lg leading-relaxed max-w-2xl mb-4">
            This is Version 1.0 of the framework guiding how I teach at Rook Foundations. It's a living document — still developing, still being tested with real children in real sessions, and refined as I learn what genuinely helps.
          </p>
          <p className="font-nunito text-[#2D2520]/65 text-base sm:text-lg leading-relaxed max-w-2xl">
            I'm sharing it because I believe parents deserve real insight into the thinking behind what I do — not a finished manifesto, but an honest, evolving foundation.
          </p>
        </div>
      </section>

      {/* Jump to a section */}
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-8 border-t border-b border-[#2D2520]/10">
        <Reveal>
          <p className="font-nunito text-[#2D2520]/45 text-xs font-700 uppercase tracking-wide mb-4">Jump to a section</p>
          <div className="flex flex-wrap gap-2">
            {toc.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="font-nunito text-[#2D2520]/70 text-xs sm:text-sm font-600 bg-white border border-[#2D2520]/10 rounded-full px-3.5 py-2 hover:border-[#E8A020]/40 hover:text-[#E8A020] transition-colors"
              >
                {t.label}
              </a>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Document body */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12">

        <Section id="purpose" icon={Target} title="Our Purpose" first>
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">
              Rook Foundations uses chess, strategy games, puzzles and other structured activities as engaging environments in which children can learn how to approach, navigate and reflect upon problems.
            </p>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">
              My aim is not simply to teach children how to play a particular game. Games provide opportunities for children to practise broader skills and behaviours including:
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {purposeSkills.map((skill) => (
                <span key={skill} className="font-nunito text-[#2D2520]/75 text-sm bg-white border border-[#2D2520]/10 rounded-full px-3.5 py-1.5 capitalize">
                  {skill}
                </span>
              ))}
            </div>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              I believe that meaningful learning occurs when children are given opportunities to think, make decisions, experience outcomes, reflect on their approaches and try again.
            </p>
          </Reveal>
        </Section>

        <Section id="what-is-learning" icon={Lightbulb} title="What I Mean by Learning">
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">
              At Rook Foundations, learning is broader than acquiring information or completing an activity successfully.
            </p>
            <p className="font-nunito text-[#2D2520] text-base font-700 mb-3">A child may demonstrate learning when they:</p>
            <BulletList items={learningEvidence.map((s) => s.charAt(0).toUpperCase() + s.slice(1))} />
            <div className="bg-white border border-[#2D2520]/10 rounded-2xl p-6 my-6">
              <p className="font-nunito text-[#2D2520] text-base font-700 leading-relaxed mb-1.5">Winning is not, by itself, evidence of learning.</p>
              <p className="font-nunito text-[#2D2520] text-base font-700 leading-relaxed">Losing is not, by itself, evidence of failure.</p>
            </div>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">
              Both success and difficulty can provide valuable opportunities for reflection and growth.
            </p>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              I therefore focus not only on what happened, but on what the child did with the experience.
            </p>
          </Reveal>
        </Section>

        <Section id="six-stages" icon={RefreshCw} title="The Six-Stage Learning Process">
          <Reveal className="mb-6">
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              Every Rook Foundations learning experience is informed by six interconnected stages.
            </p>
          </Reveal>
          <div className="space-y-5">
            {stages.map((stage) => (
              <Reveal key={stage.num}>
                <StageCard stage={stage} />
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="personalised" icon={SlidersHorizontal} title="Personalised Learning">
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">
              Rook Foundations uses a responsive approach to personalisation. I do not assume that every child learns best through a single fixed "learning style".
            </p>
            <p className="font-nunito text-[#2D2520] text-base font-700 mb-3">Instead, I recognise that children may respond differently to:</p>
            <BulletList items={personalisationFactors.map((s) => s.charAt(0).toUpperCase() + s.slice(1))} />
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mt-5 mb-5">
              The instructor uses evidence from previous sessions and observations of the child to determine which approaches are most appropriate.
            </p>
            <div className="bg-amber-50 border border-[#E8A020]/20 rounded-2xl p-6 mb-5">
              <p className="font-nunito text-[#2D2520] text-base font-700 leading-relaxed mb-2">Personalisation therefore means:</p>
              <p className="font-nunito text-[#2D2520]/80 text-base leading-relaxed italic">
                Adapting the route towards a learning target without unnecessarily changing the learning target itself.
              </p>
            </div>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              For example, two children may both be working on planning, but one may develop this through chess while another works through a visual puzzle or cooperative strategy game.
            </p>
          </Reveal>
        </Section>

        <Section id="engaging" icon={MessageCircle} title="Multiple Ways of Engaging">
          <Reveal className="mb-6">
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              Rook Foundations provides children with opportunities to engage with concepts through multiple forms.
            </p>
          </Reveal>
          <Reveal className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {engagementModes.map(({ Icon, label, body }) => (
              <div key={label} className="bg-white border border-[#2D2520]/8 rounded-2xl p-5 flex items-start gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#E8A020]/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-[#E8A020]" />
                </span>
                <div>
                  <p className="font-fredoka text-[#2D2520] text-base mb-1">{label}</p>
                  <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              These are teaching approaches rather than fixed learning-style categories. The instructor selects and combines them according to the child, activity and learning target.
            </p>
          </Reveal>
        </Section>

        <Section id="scaffolding" icon={Users} title="Responsive Instruction and Scaffolding">
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-6">
              When a child encounters difficulty, the instructor seeks to support the child's thinking without unnecessarily taking the thinking away from them. Support may progress through a flexible sequence:
            </p>
            <div className="bg-white border border-[#2D2520]/10 rounded-2xl p-6 mb-6">
              <StepFlow steps={scaffoldingSteps} />
            </div>
            <p className="font-nunito text-[#2D2520] text-base font-700 mb-3">The appropriate level of support depends on:</p>
            <BulletList items={scaffoldingFactors.map((s) => s.charAt(0).toUpperCase() + s.slice(1))} />
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mt-5">
              Younger or less experienced children may require more direct support. Older or more experienced children may benefit from greater opportunity to struggle productively, reflect and discover solutions independently.
            </p>
          </Reveal>
        </Section>

        <Section id="choice" icon={Compass} title="Learner Agency and Choice">
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">
              Rook Foundations provides children with meaningful choices where appropriate. When developing a particular learning target, children may initially be offered a selection of activities that address the same underlying skill.
            </p>
            <ExampleCard
              title="Learning Target: Planning"
              rows={[['A child might choose between', 'Chess, a strategy board game, a planning puzzle, or a cooperative challenge.']]}
            />
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mt-5 mb-4">
              As the instructor develops a stronger understanding of the child's needs, preferences and progress, the range of choices may become more targeted.
            </p>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              However, choice does not override the learning objective. If a child does not engage with an activity, the instructor seeks to understand why and, where appropriate, provides an alternative route towards the same learning target.
            </p>
          </Reveal>
        </Section>

        <Section id="competition" icon={Trophy} title="Competition and Collaboration">
          <Reveal className="mb-5">
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              Competition can be motivating for some children and discouraging for others. Rook Foundations therefore adapts the learning environment according to the individual child.
            </p>
          </Reveal>
          <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {competitionStyles.map(({ title, prompt }) => (
              <div key={title} className="bg-white border border-[#2D2520]/8 rounded-2xl p-5">
                <p className="font-nunito text-[#2D2520]/45 text-xs font-700 uppercase tracking-wide mb-2">{title}</p>
                <p className="font-fredoka text-[#2D2520] text-base italic">&ldquo;{prompt}&rdquo;</p>
              </div>
            ))}
          </Reveal>
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              The objective is not to remove competition, but to ensure that the environment encourages engagement, reflection and growth.
            </p>
          </Reveal>
        </Section>

        <Section id="growth" icon={TrendingUp} title="Failure, Persistence and Growth">
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">
              Rook Foundations treats difficulty as an important component of learning. Children are encouraged to understand that:
            </p>
            <div className="bg-white border border-[#2D2520]/10 rounded-2xl p-6 mb-5">
              <ul className="space-y-2">
                {growthStatements.map((s) => (
                  <li key={s} className="font-nunito text-[#2D2520] text-base font-700 leading-relaxed">{s}</li>
                ))}
              </ul>
            </div>
            <p className="font-nunito text-[#2D2520] text-base font-700 mb-3">The instructor therefore encourages children to ask:</p>
            <BulletList items={growthQuestions} />
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mt-5">
              This shifts attention from comparison with others towards reflection and personal development.
            </p>
          </Reveal>
        </Section>

        <Section id="targets" icon={ClipboardCheck} title="Learning Targets and Progress">
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">
              Learning Targets identify the areas that a child is working towards developing. A target should not normally be considered complete because a child demonstrates a behaviour once. Instead, progress should be demonstrated consistently over time.
            </p>
            <p className="font-nunito text-[#2D2520] text-base font-700 mb-3">For example, evidence of improved planning may include:</p>
            <BulletList items={progressEvidence.map((s) => s.charAt(0).toUpperCase() + s.slice(1))} />
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mt-5">
              A target is therefore considered through patterns of evidence rather than isolated successes.
            </p>
          </Reveal>
        </Section>

        <Section id="evidence" icon={FileText} title="Evidence-Informed Adaptation">
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-6">
              Rook Foundations uses Learning Records to develop an increasingly detailed understanding of each child. Records should seek to capture:
            </p>
            <div className="bg-white border border-[#2D2520]/10 rounded-2xl p-6 mb-6">
              <StepFlow steps={evidenceChain} />
            </div>
            <ExampleCard title="Worked example" rows={evidenceExample} />
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mt-5">
              Over time, this creates an evolving picture of how the child responds to different approaches.
            </p>
          </Reveal>
        </Section>

        <Section id="profile" icon={UserCircle} title="The Developing Learner Profile">
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-2">
              The ultimate purpose of this evidence is not to label children.
            </p>
            <p className="font-nunito text-[#2D2520] text-base font-700 mb-5">
              It is to help instructors understand them.
            </p>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-2">A useful learner profile might eventually communicate:</p>
            <div className="border-l-4 border-amber-300 pl-6 py-1 mb-5">
              <p className="font-nunito text-[#2D2520]/80 text-base leading-relaxed italic">
                "Alex is working towards developing planning. Competitive activities motivate him, while excessive difficulty can lead to disengagement. He responds well to visual demonstrations and questioning. When presented with a new problem, allow him time to attempt it independently before providing a prompt."
              </p>
            </div>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-2">
              This information can then guide future sessions.
            </p>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              As the child develops, the profile should also develop.
            </p>
          </Reveal>
        </Section>

        <Section id="instructor" icon={GraduationCap} title="The Instructor's Role">
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-6">
              A Rook Foundations instructor is not simply a provider of games or information. The instructor is responsible for:
            </p>
            <div className="bg-white border border-[#2D2520]/10 rounded-2xl p-6 mb-6">
              <StepFlow steps={instructorCycle} />
            </div>
            <p className="font-nunito text-[#2D2520] text-base font-700 mb-3">The instructor continually considers:</p>
            <BulletList items={instructorQuestions} />
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mt-5">
              This creates a cycle of responsive teaching rather than a fixed lesson sequence.
            </p>
          </Reveal>
        </Section>

        <Section id="cycle" icon={RefreshCw} title="The Rook Foundations Learning Cycle">
          <Reveal>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-6">
              The entire framework can ultimately be represented as a cycle:
            </p>
            <div className="bg-white border border-[#2D2520]/10 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {cycleStages.map((s, i) => (
                  <div key={s.title} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center font-fredoka text-white text-xs flex-shrink-0" style={{ backgroundColor: s.accent }}>
                      {i + 1}
                    </span>
                    <p className="font-nunito text-sm">
                      <span className="font-700" style={{ color: s.accent }}>{s.title}</span>
                      <span className="text-[#2D2520]/50"> — {s.purpose}</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-[#2D2520]/8">
                <ArrowDown size={14} className="text-[#E8A020]/50 flex-shrink-0" aria-hidden="true" />
              </div>
              <div className="mt-2">
                <StepFlow steps={['Observe', 'Record', 'Adapt', 'Try again']} />
              </div>
            </div>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">
              This means the framework is cyclical rather than linear.
            </p>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              A child's learning does not end at Transfer. What is discovered through Reflection and Transfer feeds back into the next Relationship stage, where the instructor's understanding of the learner becomes more sophisticated.
            </p>
          </Reveal>
        </Section>

        <Section id="principle" icon={Quote} title="The Core Principle">
          <Reveal>
            <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed mb-4">
              If I had to reduce the entire framework to one statement, I would currently write:
            </p>
            <div className="bg-[#2D2520] rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(to right, transparent, rgba(232,160,32,0.5), transparent)' }}
                aria-hidden="true"
              />
              <Quote size={28} className="text-[#E8A020]/50 mb-4" />
              <p className="font-fredoka text-white text-lg sm:text-xl leading-relaxed">
                Rook Foundations uses strategy games as engaging environments in which children can practise thinking, problem-solving and reflection, while instructors adapt the activities, challenges and support to help each child develop greater independence and transferable skills.
              </p>
            </div>
          </Reveal>
        </Section>
      </div>

      {/* Footer note */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 mt-4">
        <div className="border-t border-[#2D2520]/10 pt-8">
          <p className="font-nunito text-[#2D2520]/40 text-xs leading-relaxed">
            This framework is prepared and maintained by Louis Jenkins, Founder of Rook Foundations, and continues to develop alongside the pilot sessions and workshops it describes.
          </p>
        </div>
      </div>

      {/* CTA */}
      <section className="mt-16 py-20 text-center bg-[#E8A020] relative overflow-hidden">
        <ChessBg variant="cta" color="#ffffff" />
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <MessageCircle size={36} className="text-white mx-auto mb-4" />
          <h2 className="font-fredoka text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
            Questions about this approach?
          </h2>
          <p className="font-nunito text-white/80 text-lg mb-8">
            I'm always happy to talk through the thinking behind Rook Foundations with parents.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 bg-white text-[#E8A020] font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all hover:shadow-xl hover:-translate-y-0.5">
            Get in touch <ArrowRight size={20} />
          </MotionLink>
        </div>
      </section>
    </div>
  );
}
