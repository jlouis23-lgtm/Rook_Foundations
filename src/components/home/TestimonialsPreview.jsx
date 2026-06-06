import { motion } from 'framer-motion';

const values = [
  {
    emoji: '♟',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: '#4a7eb8',
    heading: 'They Learn to Think',
    body: 'Every move on the chess board teaches children to slow down, consider their options, and act with intention — a skill that extends far beyond the game.',
  },
  {
    emoji: '🌱',
    bg: 'bg-green-50',
    border: 'border-green-200',
    accent: '#2d8c62',
    heading: 'Confidence Blooms Naturally',
    body: 'In a safe and encouraging space, children discover that making mistakes is part of learning — and that persistence pays off.',
  },
  {
    emoji: '🎯',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    accent: '#7a48c0',
    heading: 'Focus Grows with Every Game',
    body: 'Chess is one of the few activities that demands full attention from young minds. Children who practise regularly develop stronger focus and patience.',
  },
  {
    emoji: '🤝',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    accent: '#b8790a',
    heading: 'A Place They Feel Supported',
    body: 'Small groups, personalised attention, and a warm teaching style mean every child feels seen, heard, and valued from their very first session.',
  },
];

export default function TestimonialsPreview() {
  return (
    <section className="bg-[#FAFAF7] py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-100/30 blob-shape pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-52 h-52 bg-blue-100/25 blob-shape-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-4">
            <span className="text-sm">💛</span>
            <span className="font-nunito text-green-700 text-sm font-700">What families can look forward to</span>
          </div>
          <h2 className="font-fredoka text-[#2D2520] leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            More than chess lessons.
          </h2>
          <p className="font-nunito text-[#2D2520]/55 text-base max-w-xl mx-auto leading-relaxed">
            Parents tell us the biggest changes happen away from the chess board — in school, at home, and in how their child sees the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`play-card ${v.bg} border-2 ${v.border} rounded-3xl p-7 cursor-default`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${v.accent}18`, border: `2px solid ${v.accent}30` }}>
                  {v.emoji}
                </div>
                <div>
                  <h3 className="font-fredoka text-xl mb-2" style={{ color: v.accent }}>
                    {v.heading}
                  </h3>
                  <p className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed">{v.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}