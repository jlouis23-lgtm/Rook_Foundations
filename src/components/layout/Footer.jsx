import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Classes', path: '/classes' },
  { label: 'Benefits', path: '/benefits' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Contact', path: '/contact' },
];

export default function Footer() {
  return (
    <footer className="bg-midnight text-ivory">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-coral rounded-xl flex items-center justify-center">
                <span className="text-ivory text-2xl font-bold font-playfair leading-none">♜</span>
              </div>
              <div>
                <span className="font-playfair text-ivory text-2xl leading-none block">RookFoundations</span>
                <span className="font-inter text-ivory/40 text-xs tracking-widest uppercase leading-none">Chess Academy</span>
              </div>
            </div>
            <p className="font-inter text-ivory/60 text-base leading-relaxed mb-8 max-w-xs">
              Where young minds develop the strategic thinking, patience, and confidence to master the board — and life.
            </p>
            <div className="flex items-center gap-2 text-ivory/40 text-sm font-inter">
              <span className="text-coral text-lg">♜</span>
              <span>In-person classes · Ages 5–15</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-inter text-ivory/40 text-xs tracking-widest uppercase mb-6">Navigation</h4>
            <div className="flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-3 font-inter text-ivory/70 hover:text-coral transition-colors group"
                >
                  <span className="font-mono text-coral/30 text-xs group-hover:text-coral/70 transition-colors">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-inter text-ivory/40 text-xs tracking-widest uppercase mb-6">Get In Touch</h4>
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-inter text-ivory/40 text-xs uppercase tracking-wide mb-1">Email</p>
                <a href="mailto:hello@rookfoundations.com" className="font-inter text-ivory/80 hover:text-coral transition-colors">
                  hello@rookfoundations.com
                </a>
              </div>
              <div>
                <p className="font-inter text-ivory/40 text-xs uppercase tracking-wide mb-1">Phone</p>
                <a href="tel:+1234567890" className="font-inter text-ivory/80 hover:text-coral transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              <div>
                <p className="font-inter text-ivory/40 text-xs uppercase tracking-wide mb-1">Location</p>
                <p className="font-inter text-ivory/80">Local Community Centre<br />Main Street, Your City</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-block mt-8 bg-coral text-ivory font-inter font-600 text-sm px-6 py-3 rounded-full hover:bg-coral-dark transition-all hover:shadow-lg hover:shadow-coral/20"
            >
              Book a Free Trial
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-inter text-ivory/30 text-sm">
            © 2026 RookFoundations. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-inter text-ivory/30 hover:text-ivory/60 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="font-inter text-ivory/30 hover:text-ivory/60 text-sm transition-colors">Terms</a>
            <span className="text-coral text-lg">♜</span>
          </div>
        </div>
      </div>
    </footer>
  );
}