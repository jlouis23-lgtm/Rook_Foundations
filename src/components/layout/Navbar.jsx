import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Classes', path: '/classes' },
  { label: 'Benefits', path: '/benefits' },
  { label: 'Testimonials', path: '/testimonials' },
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

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-ivory/95 backdrop-blur-md shadow-sm border-b border-slate/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-slate rounded-lg flex items-center justify-center group-hover:bg-coral transition-colors duration-300">
              <span className="text-ivory text-xl font-bold font-playfair leading-none">♜</span>
            </div>
            <div>
              <span className="font-playfair font-700 text-midnight text-lg leading-none block">Rook</span>
              <span className="font-inter text-slate text-xs tracking-widest uppercase leading-none">Foundations</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-inter text-sm font-500 tracking-wide transition-colors duration-200 relative group ${
                  location.pathname === link.path ? 'text-coral' : 'text-slate hover:text-coral'
                }`}
              >
                <span className="text-coral/40 text-xs mr-1 font-mono">{String(i + 1).padStart(2, '0')}.</span>
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-coral" />
                )}
              </Link>
            ))}
            <Link
              to="/contact"
              className="ml-4 bg-coral text-ivory font-inter font-600 text-sm px-6 py-2.5 rounded-full hover:bg-coral-dark transition-all duration-300 hover:shadow-lg hover:shadow-coral/20"
            >
              Book Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-slate hover:text-coral transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 bg-midnight flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-coral rounded-lg flex items-center justify-center">
                  <span className="text-ivory text-xl font-bold font-playfair leading-none">♜</span>
                </div>
                <div>
                  <span className="font-playfair text-ivory text-lg leading-none block">Rook</span>
                  <span className="font-inter text-ivory/50 text-xs tracking-widest uppercase leading-none">Foundations</span>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="text-ivory/60 hover:text-ivory transition-colors">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 gap-2">
              {navLinks.map((link, i) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-4 py-4 border-b border-white/5 group"
                >
                  <span className="font-mono text-coral/50 text-sm">{String(i + 1).padStart(2, '0')}.</span>
                  <span className="font-playfair text-ivory text-2xl group-hover:text-coral transition-colors">
                    {link.label}
                  </span>
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-8 bg-coral text-ivory font-inter font-600 text-base px-8 py-4 rounded-full text-center hover:bg-coral-dark transition-all"
              >
                Book a Free Trial
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}