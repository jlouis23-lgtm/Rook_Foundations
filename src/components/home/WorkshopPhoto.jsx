import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

// A collage of real Rook Foundations sessions, placed right after the hero
// so parents see real people and real sessions straight away. Each photo
// gets a different size and a slight angle: on desktop they are placed on a
// 12-column grid, on phones they flow into two columns in list order.
const COLLAGE = [
  {
    name: 'children-chess-photo',
    width: 900,
    height: 675,
    alt: 'Two children playing chess together at a Rook Foundations session, one moving a piece as the other looks on.',
    className: 'col-span-2 row-span-4 md:col-start-1 md:col-span-7 md:row-start-1 md:row-span-5',
    tilt: 'md:-rotate-1',
    sizes: '(max-width: 767px) 90vw, 560px'
  },
  {
    name: 'classroom-session',
    width: 665,
    height: 1182,
    alt: 'A Rook Foundations session in a primary classroom, with children at their tables listening to the session leader.',
    className: 'row-span-6 md:col-start-1 md:col-span-4 md:row-start-6 md:row-span-7',
    tilt: 'md:rotate-1',
    position: '50% 30%',
    sizes: '(max-width: 767px) 45vw, 320px'
  },
  {
    name: 'shape-puzzle',
    width: 790,
    height: 996,
    alt: 'A child fitting colourful shape pieces onto a puzzle board, matching a challenge card on the table.',
    className: 'row-span-3 md:col-start-5 md:col-span-4 md:row-start-6 md:row-span-5',
    tilt: 'md:-rotate-1',
    sizes: '(max-width: 767px) 45vw, 320px'
  },
  {
    name: 'rubiks-cube',
    width: 768,
    height: 1024,
    alt: "A child holding a Rubik's cube at a table during a Rook Foundations session.",
    className: 'row-span-3 md:col-start-9 md:col-span-4 md:row-start-5 md:row-span-5',
    tilt: 'md:rotate-[1.5deg]',
    sizes: '(max-width: 767px) 45vw, 320px'
  },
  {
    name: 'workshop-photo',
    width: 768,
    height: 740,
    alt: 'Louis Jenkins, founder of Rook Foundations, giving a thumbs up behind a table of strategy games and puzzles at his first in-person workshop.',
    className: 'col-span-2 row-span-4 md:col-start-8 md:col-span-5 md:row-start-1 md:row-span-4',
    tilt: 'md:rotate-[1.5deg]',
    sizes: '(max-width: 767px) 90vw, 400px'
  }
];

export default function WorkshopPhoto() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Collage of real sessions: five photos at different sizes and
            slight angles, laid on a fixed row grid so each keeps roughly its
            own shape. Below md the same photos sit in two columns. */}
        <div className="grid grid-cols-2 md:grid-cols-12 auto-rows-[4.5rem] md:auto-rows-[4.25rem] gap-3 sm:gap-4 md:gap-5">
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
