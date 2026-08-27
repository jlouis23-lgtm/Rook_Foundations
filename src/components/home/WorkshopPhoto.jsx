import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];
const SIZES = '(max-width: 767px) 88vw, (max-width: 1023px) 55vw, 500px';

// A real, unfiltered photo from Louis's first in-person workshop — placed
// right after the hero so parents see proof of a real person and real
// sessions before they even reach PreLaunchNotice's "I am running pilot
// sessions..." copy immediately below. Deliberately its own short, photo-led
// section rather than folded into PreLaunchNotice: that section already has
// its own tuned stagger animation and full narrative, and doesn't need a
// second wall of text competing with the image.
export default function WorkshopPhoto() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <picture>
              <source
                type="image/webp"
                srcSet="/images/home/workshop-photo-480w.webp 480w, /images/home/workshop-photo.webp 768w"
                sizes={SIZES}
              />
              <img
                src="/images/home/workshop-photo.jpg"
                srcSet="/images/home/workshop-photo-480w.jpg 480w, /images/home/workshop-photo.jpg 768w"
                sizes={SIZES}
                width={768}
                height={740}
                loading="eager"
                alt="Louis Jenkins, founder of Rook Foundations, giving a thumbs up behind a table of strategy games and puzzles at his first in-person workshop."
                className="w-full h-auto rounded-3xl shadow-lg shadow-black/10"
              />
            </picture>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            <span className="block font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              From the first workshop
            </span>
            <h2 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.3rem)' }}>
              Where Rook Foundations began
            </h2>
            <p className="font-nunito text-[#2D2520]/65 text-base sm:text-lg leading-relaxed">
              This is from my very first Rook Foundations workshop. Every game and activity on the table was chosen and brought along by me personally. Rook Foundations isn't just an idea on a website; it's already running, hands-on, with real children.
            </p>
          </motion.div>
        </div>

        {/* Second, smaller photo — children actually playing, deliberately
            secondary to the founder photo above (smaller max-width, wider
            4:3 crop vs. the founder photo's near-square crop) so it reads
            as supporting evidence for "hands-on, with real children" rather
            than a second equally-weighted hero image. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-md sm:max-w-lg mx-auto mt-14 sm:mt-16"
        >
          <picture>
            <source
              type="image/webp"
              srcSet="/images/home/children-chess-photo-480w.webp 480w, /images/home/children-chess-photo.webp 900w"
              sizes="(max-width: 640px) 88vw, 512px"
            />
            <img
              src="/images/home/children-chess-photo.jpg"
              srcSet="/images/home/children-chess-photo-480w.jpg 480w, /images/home/children-chess-photo.jpg 900w"
              sizes="(max-width: 640px) 88vw, 512px"
              width={900}
              height={675}
              loading="lazy"
              alt="Two children playing chess together at a Rook Foundations session, one moving a piece as the other looks on."
              className="w-full h-auto rounded-3xl shadow-lg shadow-black/10"
            />
          </picture>
          <p className="font-nunito text-[#2D2520]/45 text-sm text-center italic mt-4">
            Two children enjoying a real Rook Foundations session together.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
