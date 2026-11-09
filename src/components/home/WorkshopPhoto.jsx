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
// The session collage under the intro. Grid placement gives each photo a
// different size: on desktop a 12-column grid, on phones two columns.
const COLLAGE = [
  {
    name: 'children-chess-photo',
    width: 900,
    height: 675,
    alt: 'Two children playing chess together at a Rook Foundations session, one moving a piece as the other looks on.',
    className: 'col-span-2 row-span-4 md:col-span-7 md:row-span-5',
    tilt: 'md:-rotate-1',
    sizes: '(max-width: 767px) 90vw, 560px'
  },
  {
    name: 'classroom-session',
    width: 665,
    height: 1182,
    alt: 'A Rook Foundations session in a primary classroom, with children at their tables listening to the session leader.',
    className: 'row-span-6 md:col-span-5 md:row-span-8',
    tilt: 'md:rotate-[1.5deg]',
    position: '50% 30%',
    sizes: '(max-width: 767px) 45vw, 400px'
  },
  {
    name: 'shape-puzzle',
    width: 790,
    height: 996,
    alt: 'A child fitting colourful shape pieces onto a puzzle board, matching a challenge card on the table.',
    className: 'row-span-3 md:col-span-4 md:row-span-5',
    tilt: 'md:rotate-1',
    sizes: '(max-width: 767px) 45vw, 320px'
  },
  {
    name: 'rubiks-cube',
    width: 768,
    height: 1024,
    alt: "A child holding a Rubik's cube at a table during a Rook Foundations session.",
    className: 'row-span-3 md:col-span-3 md:row-span-4',
    tilt: 'md:-rotate-2',
    sizes: '(max-width: 767px) 45vw, 240px'
  }
];

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

        {/* Collage of real sessions: four photos at different sizes and
            slight angles, laid on a fixed row grid so each keeps roughly its
            own shape. Below md the same photos sit in two columns. */}
        <div className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-12 auto-rows-[4.5rem] md:auto-rows-[4.25rem] gap-3 sm:gap-4 md:gap-5">
          {COLLAGE.map((photo, index) => (
            <motion.div
              key={photo.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
              className={photo.className}
            >
              <picture>
                <source
                  type="image/webp"
                  srcSet={`/images/home/${photo.name}-480w.webp 480w, /images/home/${photo.name}.webp ${photo.width}w`}
                  sizes={photo.sizes}
                />
                <img
                  src={`/images/home/${photo.name}.jpg`}
                  srcSet={`/images/home/${photo.name}-480w.jpg 480w, /images/home/${photo.name}.jpg ${photo.width}w`}
                  sizes={photo.sizes}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  alt={photo.alt}
                  className={`w-full h-full object-cover rounded-3xl shadow-lg shadow-black/10 transition-transform duration-500 md:hover:rotate-0 md:hover:scale-[1.02] ${photo.tilt}`}
                  style={{ objectPosition: photo.position }}
                />
              </picture>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
