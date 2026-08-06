import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, ChevronDown } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

const infoCards = [
  { label: 'Developing Thinking Skills', accent: '#4a7eb8', body: 'We use a wide range of games to help children strengthen problem-solving, strategic thinking, and confidence when approaching new challenges. Each game provides opportunities to practise planning, reasoning, and decision-making in an engaging way.' },
  { label: 'Learning Through Different Games', accent: '#b8790a', body: 'Every game encourages a different way of thinking. By exploring multiple games, children learn to adapt their strategies, consider new perspectives, and develop greater flexibility in their thinking. This variety helps to keep learning both challenging and enjoyable.' },
  { label: 'Tailored to Every Child', accent: '#2d8c62', body: 'Different games require different levels of concentration and complexity. We carefully select activities that match each child\'s age, ability, and stage of development. Our lessons aim to build confidence as well as progress.' },
];

const games = [
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/330e1e1cd_generated_image.png', alt: 'Memory Match Chess' },
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/5aacc1317_generated_image.png', alt: 'Marble Solitaire' },
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/5e0fa2385_generated_image.png', alt: 'Reversi / Othello' },
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/d6a33d02b_generated_image.png', alt: 'Xiangqi' },
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/6fbe34dbd_generated_image.png', alt: 'Tower of Hanoi' },
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/9b010099d_generated_image.png', alt: 'Number Track Game' },
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/de204f9a1_generated_image.png', alt: 'Abstract Strategy Game' },
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/4506222b8_generated_image.png', alt: 'Go' },
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/87a1c4978_generated_image.png', alt: 'Quoridor' },
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/b561fd629_generated_image.png', alt: 'Yamma' },
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/da5ffd037_generated_image.png', alt: 'Janggi' },
  { src: 'https://media.base44.com/images/public/6a23e24248d670657218b06c/d883f0092_generated_image.png', alt: 'Mastermind' },
  { src: '/images/games/quarto.png', alt: 'Quarto' },
  { src: '/images/games/qawale.png', alt: 'Qawale' },
  { src: '/images/games/pylos.png', alt: 'Pylos' },
  { src: '/images/games/seanorth.png', alt: 'SeaNorth' },
];

export default function GamesGallery() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleCard = (i) => {
    setOpenIndex((cur) => (cur === i ? null : i));
  };

  return (
    <section id="games" className="pt-20 pb-8 sm:pb-10 bg-[#FAFAF7] scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Subtle intro tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-1.5 font-nunito text-amber-700 text-sm font-800 uppercase tracking-widest mb-3">
            <Shuffle size={14} /> Beyond chess
          </span>
          <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            A wider world of thinking games
          </h2>
        </motion.div>

        {/* Games grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 mb-12">
          {games.map((game, i) => (
            <motion.div
              key={game.alt}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group bg-white border-2 border-[#E8A020]/12 rounded-2xl overflow-hidden hover:border-[#E8A020]/30 hover:shadow-lg hover:shadow-[#E8A020]/08 transition-all duration-300"
            >
              <div className="aspect-square p-4 sm:p-5 flex items-center justify-center">
                <img
                  src={game.src}
                  alt={game.alt}
                  className="max-w-full max-h-full w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Supporting content — click a card to reveal its detail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 items-start">
          {infoCards.map((card, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <button
                  type="button"
                  onClick={() => toggleCard(i)}
                  aria-expanded={isOpen}
                  className="group w-full text-left bg-white border-2 rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAFAF7]"
                  style={{
                    borderColor: isOpen ? card.accent : `${card.accent}20`,
                    boxShadow: isOpen ? `0 8px 20px ${card.accent}18` : undefined,
                    '--tw-ring-color': card.accent,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-fredoka text-base sm:text-lg leading-snug" style={{ color: card.accent }}>{card.label}</h3>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown size={16} style={{ color: card.accent }} />
                    </motion.span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed pt-2.5">{card.body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}