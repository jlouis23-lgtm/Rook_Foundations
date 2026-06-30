import { motion } from 'framer-motion';
import { BrainCircuit, Shuffle, UserCheck } from 'lucide-react';

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
];

export default function GamesGallery() {
  return (
    <section className="py-20 bg-[#FAFAF7]">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">

        {/* Subtle intro tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 rounded-full px-4 py-2 mb-3">
            <Shuffle size={14} className="text-amber-700" />
            <span className="font-nunito text-amber-700 text-sm font-700">Beyond chess</span>
          </div>
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

        {/* Supporting cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { Icon: BrainCircuit, label: 'Developing Thinking Skills',      color: 'bg-blue-50 border-blue-200',   accent: '#4a7eb8', body: 'We use a wide range of games to help children strengthen problem-solving, strategic thinking, and confidence when approaching new challenges. Each game provides opportunities to practise planning, reasoning, and decision-making in an engaging way.' },
            { Icon: Shuffle,      label: 'Learning Through Different Games', color: 'bg-amber-50 border-amber-200', accent: '#b8790a', body: 'Every game encourages a different way of thinking. By exploring multiple games, children learn to adapt their strategies, consider new perspectives, and develop greater flexibility in their thinking. This variety helps to keep learning both challenging and enjoyable.' },
            { Icon: UserCheck,    label: 'Tailored to Every Child',          color: 'bg-green-50 border-green-200', accent: '#2d8c62', body: 'Different games require different levels of concentration and complexity. We carefully select activities that match each child\'s age, ability, and stage of development. Our lessons aim to build confidence as well as progress.' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`play-card ${card.color} border-2 rounded-3xl p-7`}
            >
              <div className="mb-4"><card.Icon size={28} style={{ color: card.accent }} /></div>
              <h3 className="font-fredoka text-lg mb-3" style={{ color: card.accent }}>{card.label}</h3>
              <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{card.body}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}