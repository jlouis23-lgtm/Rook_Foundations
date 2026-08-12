import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

// Five stages telling the story of how Louis's own background led to Rook
// Foundations — deliberately not a qualifications grid (title + icon + desc
// repeated four times reads as a CV). A single connecting line runs behind
// the numbers so each stage visually leads into the next, culminating in
// "Rook Foundations" itself, which is the only heading picked out in gold.
const stages = [
  {
    num: '01',
    title: 'Supporting Children',
    body: 'Working across childcare, residential support and youth settings, supporting children with different needs, personalities and ways of communicating.',
  },
  {
    num: '02',
    title: 'Mentoring & Learning',
    body: "Alongside my work with children, I've provided one-to-one academic support in science, English and maths, while gaining experience in mentoring and wellbeing-focused roles. These experiences taught me the importance of patience, trust and adapting support to the individual child.",
  },
  {
    num: '03',
    title: 'Psychology & Development',
    body: "I studied Psychology at The University of Manchester before completing an MSc centered around trauma and resilience at King's College London. Here, I developed a deeper understanding of development, behaviour and how experiences can shape learning.",
  },
  {
    num: '04',
    title: 'Learning Through Games',
    body: "Four years of dedicated chess study and competitive play have given me a genuine understanding of the learning journey from beginner upwards. I've also explored a wider range of strategy games and how they can create opportunities to practise thinking, planning, communication and reflection.",
  },
  {
    num: '05',
    title: 'Rook Foundations',
    body: "I'm bringing these experiences together to develop a learning approach that uses games to understand each child, identify their strengths and create personalised opportunities for development.",
    final: true,
  },
];

export default function ExperienceJourney() {
  return (
    <section className="py-20 bg-[#F5F3EE]">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-12"
        >
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            The Experience Behind Rook Foundations
          </h2>
          <p className="font-nunito text-[#2D2520]/60 text-base sm:text-lg leading-relaxed mt-5 max-w-2xl mx-auto">
            Rook Foundations has grown from my experience working with children, studying psychology and exploring how different approaches can support learning. Along the way, I've worked in childcare, residential support and mentoring, while developing my own understanding of games, learning and child development.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          className="relative"
        >
          {/* Connecting line — sits behind the numbers, running from the first stage to the last */}
          <div
            className="absolute left-6 sm:left-7 top-2 bottom-2 w-px bg-gradient-to-b from-[#E8A020]/40 via-[#E8A020]/25 to-[#E8A020]/40"
            aria-hidden="true"
          />

          <div className="space-y-10 sm:space-y-12">
            {stages.map((stage) => (
              <motion.div
                key={stage.num}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
                className="relative flex gap-5 sm:gap-7"
              >
                <div className="relative z-10 flex-shrink-0 w-12 sm:w-14 text-center">
                  <span
                    className="font-fredoka text-[#E8A020]"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', opacity: stage.final ? 1 : 0.85 }}
                  >
                    {stage.num}
                  </span>
                </div>
                <div className="pt-1 sm:pt-2">
                  <h3
                    className="font-fredoka text-lg sm:text-xl mb-1.5"
                    style={{ color: stage.final ? '#E8A020' : '#2D2520' }}
                  >
                    {stage.title}
                  </h3>
                  <p className="font-nunito text-[#2D2520]/60 text-sm sm:text-base leading-relaxed max-w-lg">
                    {stage.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
