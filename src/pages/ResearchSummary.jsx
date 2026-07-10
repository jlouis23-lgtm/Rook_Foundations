import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, FlaskConical, GraduationCap, HeartHandshake, Shield } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import Reveal from '@/components/ui/Reveal';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

const sections = [
  {
    id: 'academic',
    Icon: GraduationCap,
    accent: '#4a7eb8',
    label: 'Academic Performance',
    intro: "UK studies alone have limited evidence of chess and other strategy games providing measurable boosts in mental performance. Although the case can be made that stronger effects have been found in countries like Spain and Japan, the same effect might not be as evident in UK children.",
    findings: [
      {
        gameTag: 'Chess',
        locTag: 'England',
        age: 'Ages 9 to 10',
        body: "The largest study of its kind in the UK followed over 4,000 Year 5 children across 100 schools. Half the children had a year of chess lessons, half didn't. When researchers compared test results in maths, reading and science a year later, there was no measurable difference between the two groups. It's an important, honest finding: chess did not show up as an exam booster in this trial.",
        source: 'Jerrim et al., Education Endowment Foundation (2016)',
        url: 'https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/chess-in-primary-schools',
      },
      {
        gameTag: 'Chess',
        locTag: 'Scotland',
        age: 'Around ages 8 to 9',
        body: "An earlier Scottish study followed a year long after school chess club for third grade pupils. The children who played chess scored notably higher on a standard cognitive ability test than children who didn't, although their reading scores were about the same either way. It suggests chess may sharpen certain kinds of thinking even where it doesn't move the needle on reading.",
        source: 'Forrest, Davidson, Shucksmith & Glendinning, University of Aberdeen (2005)',
        url: 'https://www.gov.scot/Resource/Doc/930/0009711.pdf',
      },
      {
        gameTag: 'Tower of Hanoi',
        locTag: 'England',
        age: 'Ages 7 to 15, mostly 7 to 12',
        body: "Researchers at the University of Oxford gave 238 children a classic planning puzzle called the Tower of Hanoi. Performance varied hugely between children of the same age, and scores didn't line up neatly with verbal intelligence. The researchers' own conclusion is a useful caution for parents too: don't judge a child's thinking ability from a single puzzle or game.",
        source: 'Bishop, Aamodt-Leeper, Creswell, McGurk & Skuse, University of Oxford (2001)',
        url: 'https://www.cambridge.org/core/journals/journal-of-child-psychology-and-psychiatry-and-allied-disciplines/article/abs/individual-differences-in-cognitive-planning-on-the-tower-of-hanoi-task-neuropsychological-maturity-or-measurement-error/F54ECC24F3DA295A394253FB1CB3FDB5',
      },
    ],
  },
  {
    id: 'emotional',
    Icon: HeartHandshake,
    accent: '#b8790a',
    label: 'Emotional Regulation',
    intro: 'Here the picture becomes more encouraging, especially around behaviour, focus and confidence, even within the very same studies that found no exam boost.',
    findings: [
      {
        gameTag: 'Chess',
        locTag: 'Scotland',
        age: 'Around ages 8 to 9',
        body: 'The same Aberdeen study that measured chess and reading also tracked behaviour using a recognised assessment tool. Here, the chess group showed a clear improvement compared with children who hadn\'t played, and the effect was actually bigger than anything the study found for reading. For these children, chess seemed to support how they behaved and related to others more than it changed their reading scores.',
        source: 'Forrest, Davidson, Shucksmith & Glendinning, University of Aberdeen (2005)',
        url: 'https://www.gov.scot/Resource/Doc/930/0009711.pdf',
      },
      {
        gameTag: 'Chess',
        locTag: 'England',
        age: 'Ages 9 to 10',
        body: "In the large national chess trial, teachers and pupils were also asked how the lessons felt, separately from the test scores. Many reported that children seemed more focused and better behaved during chess lessons, even though this didn't translate into higher exam marks. It's a useful reminder that what a teacher notices in the classroom and what a test measures aren't always the same thing, and both matter.",
        source: 'Jerrim et al., Education Endowment Foundation (2016)',
        url: 'https://files.eric.ed.gov/fulltext/ED581100.pdf',
      },
      {
        gameTag: 'Chess',
        locTag: 'UK wide, charity programme',
        age: null,
        body: "Chess in Schools and Communities, a UK charity that runs chess programmes in state schools including areas of high deprivation, reports that chess supports behaviour, concentration and self esteem, particularly for children with special educational needs. This comes from the charity's own programme reporting rather than an independent controlled study, so it's best read as real world experience rather than scientific proof, but it lines up with what the research above suggests.",
        source: 'Chess in Schools and Communities',
        url: 'https://www.chessinschools.co.uk/special-educational-needs',
      },
    ],
  },
  {
    id: 'trauma',
    Icon: Shield,
    accent: '#7a48c0',
    label: 'Trauma-Informed Applications',
    intro: "This is the area where UK research is thinnest, and we'd rather tell you that plainly than stretch unrelated studies to fit. We haven't found a UK study that directly tests chess or a similar strategy game as a treatment for trauma in children aged 5 to 12. Here is the closest genuine UK evidence, clearly labelled for what it actually is.",
    findings: [
      {
        gameTag: 'Talk and play based therapy, not a strategy game',
        locTag: 'England, NHS',
        age: 'Ages 3 to 8',
        body: "A UK study tested a specific talking and play based therapy for young children who had experienced a single traumatic event, delivered through NHS services. It isn't chess or a board game, but it's the most directly relevant UK trauma treatment research we could find for this age group, and it shows that structured, play based approaches already have a place in NHS trauma care for young children.",
        source: 'UK NHS based randomised trial protocol',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4417274/',
      },
      {
        gameTag: 'Practice guidance, not a study',
        locTag: 'Scotland',
        age: null,
        body: "Play Scotland, an organisation representing the play sector in Scotland, has published guidance for practitioners on why child led play, games included, belongs in trauma informed practice. Their reasoning is simple: play offers fun, safety, connection and a sense of control, exactly the things trauma can take away. This is professional guidance rather than a research study, but it reflects genuine expertise in the field.",
        source: 'Play Scotland',
        url: 'https://www.playscotland.org/why-play-belongs-in-trauma-informed-practice/',
      },
      {
        gameTag: 'Real world programme, not a trial',
        locTag: 'UK wide',
        age: null,
        body: "Chess in Schools and Communities also runs chess sessions in hospital schools, pupil referral units and with refugee children, settings where many young people have experienced trauma. The charity hasn't published controlled data isolating trauma specific outcomes from this work, so we can't draw a firm conclusion from it, but it shows chess is already being used thoughtfully in exactly these settings.",
        source: 'Chess in Schools and Communities',
        url: 'https://www.chessinschools.co.uk/what-we-do-schools',
      },
    ],
  },
];

function EvidenceCard({ accent, finding }) {
  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: `${accent}0d` }}>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className="font-nunito text-xs font-700 uppercase tracking-wide px-3 py-1 rounded-full"
          style={{ backgroundColor: `${accent}1c`, color: accent }}
        >
          {finding.gameTag}
        </span>
        {finding.locTag && (
          <span className="font-nunito text-xs font-700" style={{ color: `${accent}99` }}>{finding.locTag}</span>
        )}
      </div>
      <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">{finding.body}</p>
      <p className="font-nunito text-[#2D2520]/45 text-xs leading-relaxed">
        {finding.age && <><span className="font-700" style={{ color: accent }}>{finding.age}</span> · </>}
        {finding.source}
        {finding.url && (
          <>
            {' '}·{' '}
            <a href={finding.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline" style={{ color: accent }}>
              Read the source
            </a>
          </>
        )}
      </p>
    </div>
  );
}

export default function ResearchSummary() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32 pb-24">
      {/* Header */}
      <section className="relative overflow-hidden py-16">
        <ChessBg variant="research" />

        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <Link
            to="/about"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 font-nunito text-[#2D2520]/45 text-sm font-600 hover:text-[#E8A020] transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to about
          </Link>

          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            <FlaskConical size={14} /> UK research summary
          </span>

          <h1 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>
            What UK research says about strategy games
          </h1>

          <p className="font-nunito text-[#2D2520]/60 text-lg leading-relaxed max-w-2xl mb-4">
            A plain English look at British studies on children aged 5 to 12, covering academic performance, emotional regulation and trauma informed practice. We've kept the evidence accurate and the language simple, so you can make up your own mind.
          </p>

          <p className="font-nunito text-[#2D2520]/40 text-sm">
            Compiled by Louis Jenkins · Co-Founder, Rook Foundations
          </p>

          <div className="mt-8 border-l-4 border-green-300 pl-5 max-w-2xl">
            <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">
              <span className="font-700 text-[#2D2520]">Where this comes from:</span> every study on this page was carried out in the UK, in schools or universities in England or Scotland. Where a study includes children slightly outside our usual 5 to 12 age range, we've said so, so you can judge how relevant it is to your own child.
            </p>
          </div>
        </div>
      </section>

      {/* Quick nav */}
      <section className="max-w-3xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row gap-3 mb-16">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex-1 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border border-[#2D2520]/10 bg-white hover:border-[#E8A020]/40 hover:shadow-sm transition-all font-nunito text-sm font-700"
              style={{ color: s.accent }}
            >
              <s.Icon size={16} />
              {s.label}
            </a>
          ))}
        </div>
      </section>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 space-y-20">
        {sections.map((section, si) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <Reveal>
              <div className="flex items-center gap-3 mb-4">
                <section.Icon size={24} style={{ color: section.accent, flexShrink: 0 }} />
                <h2 className="font-fredoka text-2xl sm:text-3xl" style={{ color: section.accent }}>{section.label}</h2>
              </div>
              <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed mb-8 max-w-xl">
                {section.intro}
              </p>

              <div className="space-y-5">
                {section.findings.map((finding, fi) => (
                  <motion.div
                    key={fi}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: fi * 0.08, duration: 0.5 }}
                  >
                    <EvidenceCard accent={section.accent} finding={finding} />
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      {/* Footer note */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 mt-20">
        <div className="border-t border-[#2D2520]/10 pt-8">
          <p className="font-nunito text-[#2D2520]/40 text-xs leading-relaxed">
            This page summarises and simplifies findings from the studies linked above rather than reproducing their original text. Follow the links if you would like to check the detail for yourself. Narrowing to UK only evidence means some sections, especially trauma informed practice, reflect a genuinely thin research base rather than a complete picture of what strategy games can do for children more broadly.
          </p>
        </div>
      </div>

      {/* CTA */}
      <section className="mt-20 py-20 text-center bg-[#E8A020] relative overflow-hidden">
        <ChessBg variant="cta" color="#ffffff" />
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <div className="text-4xl mb-4">♜</div>
          <h2 className="font-fredoka text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
            Want to talk about your child?
          </h2>
          <p className="font-nunito text-white/80 text-lg mb-8">
            No pressure, no jargon. Just a warm conversation about whether Rook Foundations is the right fit.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#E8A020] font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all hover:shadow-xl hover:-translate-y-0.5">
            Get in touch <ArrowRight size={20} />
          </MotionLink>
          <div className="mt-6">
            <Link to="/references" onClick={() => window.scrollTo(0, 0)} className="font-nunito text-white/70 text-sm font-600 hover:text-white transition-colors underline underline-offset-4">
              Looking for our wider research library instead?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
