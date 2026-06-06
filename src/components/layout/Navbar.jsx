import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Classes', path: '/classes' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Book a Session', path: '/booking' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#D4A843]/25 shadow-sm shadow-[#D4A843]/8'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border-2 border-[#D4A843] rounded-full flex items-center justify-center group-hover:bg-[#D4A843]/15 transition-colors duration-300">
              <span className="text-[#D4A843] text-xl leading-none">♜</span>
            </div>
            <div>
              <span className="font-oswald text-[#1C1C1E] text-xl font-700 tracking-wider leading-none block">ROOK</span>
              <span className="font-lato text-[#D4A843] text-xs tracking-widest uppercase leading-none">FOUNDATIONS</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-lato text-sm font-700 tracking-widest uppercase transition-colors duration-200 relative ${
                  location.pathname === link.path ? 'text-[#D4A843]' : 'text-[#1C1C1E]/60 hover:text-[#D4A843]'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#D4A843]" />
                )}
              </Link>
            ))}
            <Link
              to="/contact"
              className="ml-4 bg-[#D4A843] text-white font-oswald font-600 text-sm tracking-wider px-6 py-2.5 hover:bg-[#b8902e] transition-all duration-300 hover:shadow-lg hover:shadow-[#D4A843]/25"
            >
              50% OFF FIRST LESSON
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-[#1C1C1E] hover:text-[#D4A843] transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 bg-[#FAFAF7] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-[#D4A843]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-[#D4A843] rounded-full flex items-center justify-center">
                  <span className="text-[#D4A843] text-xl">♜</span>
                </div>
                <div>
                  <span className="font-oswald text-[#1C1C1E] text-xl tracking-wider block">ROOK</span>
                  <span className="font-lato text-[#D4A843] text-xs tracking-widest uppercase">FOUNDATIONS</span>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-[#1C1C1E]/50 hover:text-[#1C1C1E]">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 gap-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-4 py-5 border-b border-[#1C1C1E]/8 group"
                >
                  <span className="font-lato text-[#D4A843]/60 text-xs">{String(i + 1).padStart(2, '0')}.</span>
                  <span className="font-oswald text-[#1C1C1E] text-3xl tracking-wider group-hover:text-[#D4A843] transition-colors">
                    {link.label.toUpperCase()}
                  </span>
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-8 bg-[#D4A843] text-white font-oswald font-600 text-base tracking-wider px-8 py-4 text-center hover:bg-[#b8902e] transition-all"
              >
                BOOK A FREE TRIAL
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}