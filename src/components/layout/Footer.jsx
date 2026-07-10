import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Chess', path: '/classes' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Book a Session', path: '/booking' },
  { label: 'Contact', path: '/contact' },
];

// Add future legal pages here (Privacy Policy, Cookie Policy, Safeguarding Policy, etc.)
// — the row below wraps automatically and needs no layout changes.
const legalLinks = [
  { label: 'Privacy Policy', path: '/privacy-policy' },
  { label: 'Terms & Conditions', path: '/terms-and-conditions' },
  { label: 'Cookie Policy', path: '/cookies-policy' },
];

export default function Footer() {
  return (
    <footer className="bg-[#2D2520] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#E8A020]/6 blob-shape pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#E8A020]/4 blob-shape-2 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-[#E8A020] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E8A020]/20">
                <span className="text-white text-2xl leading-none">♜</span>
              </div>
              <div>
                <span className="font-fredoka text-white text-xl leading-none block">Rook</span>
                <span className="font-fredoka text-[#E8A020] text-xl leading-none block">Foundations</span>
              </div>
            </div>
            <p className="font-nunito text-white/45 text-sm leading-relaxed mb-5 max-w-xs italic">
              "More than a game. Skills for life."
            </p>
            <div className="w-10 h-1 bg-[#E8A020] rounded-full mb-5" />
            <p className="font-nunito text-white/35 text-sm">In-person chess · Ages 5–15</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-fredoka text-[#E8A020] text-lg mb-5">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-nunito text-white/55 hover:text-[#E8A020] transition-colors text-sm font-600">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-fredoka text-[#E8A020] text-lg mb-5">Get In Touch</h4>
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-nunito text-white/35 text-xs uppercase tracking-wide mb-1 font-700">Email</p>
                <a href="mailto:louis.jenkins@rookfoundations.com" className="font-nunito text-white/65 hover:text-[#E8A020] transition-colors text-sm">
                  louis.jenkins@rookfoundations.com
                </a>
              </div>
              <div>
                <p className="font-nunito text-white/35 text-xs uppercase tracking-wide mb-1 font-700">Phone</p>
                <a href="tel:+447707267563" className="font-nunito text-white/65 hover:text-[#E8A020] transition-colors text-sm">
                  +44 7707 267563
                </a>
              </div>
              <div>
                <p className="font-nunito text-white/35 text-xs uppercase tracking-wide mb-1 font-700">Location</p>
                <p className="font-nunito text-white/65 text-sm">Great Dunmow, Essex</p>
              </div>
            </div>
            <MotionLink whileTap={ctaTap} to="/contact"
              className="inline-flex items-center gap-1.5 mt-7 bg-[#E8A020] text-white font-fredoka font-600 text-sm px-6 py-3 rounded-2xl hover:bg-[#d4940e] transition-all hover:shadow-lg hover:shadow-[#E8A020]/25">
              <Sparkles size={14} />
              Claim 50% Off First Lesson
            </MotionLink>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-nunito text-white/25 text-sm">
            © 2026 RookFoundations. All rights reserved.
          </p>

          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            {legalLinks.map((link, i) => (
              <span key={link.path} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/15" aria-hidden="true">·</span>}
                <Link
                  to={link.path}
                  onClick={() => window.scrollTo(0, 0)}
                  className="font-nunito text-white/35 hover:text-[#E8A020] transition-colors text-xs font-600"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="text-[#E8A020] text-lg">♜</span>
            <span className="font-nunito text-white/30 text-xs">More than a game. Skills for life.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}