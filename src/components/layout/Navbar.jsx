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
          ? 'bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E8A020]/20 shadow-sm shadow-[#E8A020]/8'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-[#E8A020] rounded-2xl flex items-center justify-center group-hover:bg-[#d4940e] transition-colors duration-300 shadow-md shadow-[#E8A020]/30">
              <span className="text-white text-2xl leading-none">♜</span>
            </div>
            <div>
              <span className="font-fredoka text-[#2D2520] text-xl font-600 leading-none block">Rook</span>
              <span className="font-fredoka text-[#E8A020] text-xl font-600 leading-none block">Foundations</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-nunito text-sm font-700 transition-colors duration-200 relative py-1 ${
                  location.pathname === link.path
                    ? 'text-[#E8A020]'
                    : 'text-[#2D2520]/65 hover:text-[#E8A020]'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#E8A020] rounded-full" />
                )}
              </Link>
            ))}
            <Link
              to="/contact"
              className="ml-2 bg-[#E8A020] text-white font-fredoka font-600 text-sm px-6 py-2.5 rounded-2xl hover:bg-[#d4940e] transition-all duration-300 hover:shadow-lg hover:shadow-[#E8A020]/30 hover:-translate-y-0.5"
            >
              50% Off First Lesson 🎉
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-[#2D2520] hover:text-[#E8A020] transition-colors"
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
            <div className="flex items-center justify-between px-6 h-20 border-b border-[#E8A020]/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8A020] rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">♜</span>
                </div>
                <div>
                  <span className="font-fredoka text-[#2D2520] text-xl block">Rook</span>
                  <span className="font-fredoka text-[#E8A020] text-xl block">Foundations</span>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-[#2D2520]/50 hover:text-[#2D2520]">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 gap-2">
              {navLinks.map((link, i) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-4 py-4 border-b border-[#2D2520]/6 group"
                >
                  <span className="font-nunito text-[#E8A020]/50 text-xs font-700">{String(i + 1).padStart(2, '0')}.</span>
                  <span className="font-fredoka text-[#2D2520] text-3xl group-hover:text-[#E8A020] transition-colors">
                    {link.label}
                  </span>
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-8 bg-[#E8A020] text-white font-fredoka font-600 text-lg px-8 py-4 text-center rounded-2xl hover:bg-[#d4940e] transition-all"
              >
                Claim 50% Off Your First Lesson 🎉
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}