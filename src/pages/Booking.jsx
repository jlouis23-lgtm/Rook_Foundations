import { useEffect } from 'react';

export default function Booking() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ backgroundColor: '#FAFAF7' }} className="pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20 border-b border-[#D4A843]/15">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Book a Session</span>
          <h1 className="font-oswald text-[#1C1C1E] uppercase mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            View Availability & Schedule a Lesson
          </h1>
          <p className="font-lato text-[#2D2B26]/65 text-lg max-w-2xl mx-auto leading-relaxed">
            Browse available lesson slots and book directly online. All sessions are confirmed instantly and synced with my calendar — no back-and-forth needed.
          </p>
        </div>
      </section>

      {/* Calendly Embed */}
      <section className="py-24" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="relative border border-[#D4A843]/20" style={{ backgroundColor: '#FAFAF7' }}>
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4A843]/60 to-transparent" />
            <iframe
              src="https://calendly.com/louis-jenkins-rookfoundations?embed_domain=rookfoundations.com&embed_type=Inline&hide_gdpr_banner=1&background_color=FAFAF7&text_color=1C1C1E&primary_color=D4A843"
              width="100%"
              height="1100"
              frameBorder="0"
              title="Book a Session — Rook Foundations"
              style={{ display: 'block', minWidth: '320px', backgroundColor: '#FAFAF7' }}
            />
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4A843]/60 to-transparent" />
          </div>
          <p className="font-lato text-[#2D2B26]/35 text-xs text-center mt-5 tracking-wide">
            Scheduling powered by Calendly · Synced with Google Calendar
          </p>
        </div>
      </section>
    </div>
  );
}