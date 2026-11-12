import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, delay, ease: EASE }
});

// Why Rook Foundations exists, placed straight after the hero: the hero says
// what we do, this says why it matters now. A quiet, text-led section with
// no call to action, so it reads as a statement rather than a pitch; the
// photo collage that follows then shows the idea in practice.
export default function MissionStatement() {
  return (
    <section className="bg-[#F5F0E4] py-20 sm:py-24" aria-labelledby="mission-heading">
      <div className="max-w-2xl mx-auto px-6 lg:px-0">
        <motion.div {...reveal()} className="w-12 h-[3px] bg-[#E8A020] rounded-full mb-6" aria-hidden="true" />
        <motion.h2
          {...reveal(0.05)}
          id="mission-heading"
          className="font-fredoka text-[#2D2520] leading-[1.05] mb-7"
          style={{ fontSize: 'clamp(2.3rem, 5.5vw, 3.6rem)' }}
        >
          Childhood is changing.
        </motion.h2>

        <motion.div {...reveal(0.1)} className="space-y-5 font-nunito text-[#2D2520]/75 text-lg leading-relaxed">
          <p>
            As screens and social media increasingly compete for children’s attention, opportunities for meaningful
            play, face-to-face interaction and independent thinking can become harder to find. Yet these experiences
            are fundamental to developing confidence, friendships, emotional resilience, creativity and the ability
            to think for oneself.
          </p>
          <p>
            At Rook Foundations, we want to help restore that balance. Through chess, strategy games and playful
            challenges, we create engaging opportunities for children to think, experiment, collaborate, overcome
            difficulties and learn through experience.
          </p>
        </motion.div>

        <motion.p
          {...reveal(0.15)}
          className="mt-9 border-l-[3px] border-[#E8A020] pl-5 font-fredoka italic text-[#8a5a06] leading-snug"
          style={{ fontSize: 'clamp(1.3rem, 2.6vw, 1.65rem)' }}
        >
          Our aim is simple: to make thinking enjoyable and give children more opportunities to develop the skills
          that will serve them in the real world.
        </motion.p>
      </div>
    </section>
  );
}
