import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Classes', path: '/classes' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Book a Session', path: '/booking' },
  { label: 'Contact', path: '/contact' },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#F0EDE5' }} className="border-t border-[#D4A843]/25">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 border-2 border-[#D4A843] rounded-full flex items-center justify-center bg-[#D4A843]/10">
                <span className="text-[#D4A843] text-3xl leading-none">♜</span>
              </div>
              <div>
                <span className="font-oswald text-[#1C1C1E] text-2xl tracking-wider leading-none block">ROOK</span>
                <span className="font-oswald text-[#D4A843] text-xl tracking-wider leading-none block">FOUNDATIONS.</span>
              </div>
            </div>
            <p className="font-lato text-[#2D2B26]/55 text-sm leading-relaxed mb-6 max-w-xs italic">
              "More than a game. Skills for life."
            </p>
            <div className="gold-line mb-6" />
            <p className="font-lato text-[#2D2B26]/45 text-sm">
              In-person chess classes · Ages 5–15
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase mb-6">Navigate</h4>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) =>
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-lato text-[#2D2B26]/60 hover:text-[#D4A843] transition-colors text-sm tracking-wide">
                  {link.label}
                </Link>
              )}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase mb-6">Get In Touch</h4>
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-lato text-[#D4A843]/70 text-xs uppercase tracking-wide mb-1">Email</p>
                <a href="mailto:louis.jenkins@rookfoundations.com" className="font-lato text-[#2D2B26]/70 hover:text-[#D4A843] transition-colors text-sm">
                  louis.jenkins@rookfoundations.com
                </a>
              </div>
              <div>
                <p className="font-lato text-[#D4A843]/70 text-xs uppercase tracking-wide mb-1">Phone</p>
                <a href="tel:+447707267563" className="font-lato text-[#2D2B26]/70 hover:text-[#D4A843] transition-colors text-sm">
                  +44 7707 267563
                </a>
              </div>
              <div>
                <p className="font-lato text-[#D4A843]/70 text-xs uppercase tracking-wide mb-1">Location</p>
                <p className="font-lato text-[#2D2B26]/70 text-sm">Great Dunmow, Essex</p>
              </div>
            </div>
            <Link to="/contact" className="inline-block mt-8 bg-[#D4A843] text-white font-oswald font-600 text-sm tracking-wider px-6 py-3 hover:bg-[#b8902e] transition-all">
              50% OFF FIRST LESSON
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[#D4A843]/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-lato text-[#2D2B26]/30 text-sm">
            © 2026 RookFoundations. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[#D4A843] text-lg">♜</span>
            <span className="font-oswald text-[#D4A843]/50 text-xs tracking-widest uppercase">More than a game. Skills for life.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}