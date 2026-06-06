import { useEffect } from 'react';

export default function Booking() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8A020]/8 blob-shape pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#E8A020]/12 border border-[#E8A020]/25 rounded-full px-4 py-2 mb-5">
            <span className="text-sm">📅</span>
            <span className="font-nunito text-[#b8790a] text-sm font-700">Pick a time that suits you</span>
          </div>
          <h1 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Find a session that works for your family
          </h1>
          <p className="font-nunito text-[#2D2520]/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Browse available slots and book directly — sessions are confirmed instantly, synced to my calendar. No back-and-forth needed.
          </p>
        </div>
      </section>

      {/* Calendly Embed */}
      <section className="pb-24" style={{ backgroundColor: '#FAFAF7' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="bg-white border-2 border-[#E8A020]/15 rounded-3xl overflow-hidden shadow-sm">
            <div className="h-1 bg-gradient-to-r from-[#E8A020] via-[#F4C261] to-[#E8A020] rounded-t-3xl" />
            <iframe
              src="https://calendly.com/louis-jenkins-rookfoundations?embed_domain=rookfoundations.com&embed_type=Inline&hide_gdpr_banner=1&background_color=FFFFFF&text_color=2D2520&primary_color=E8A020"
              width="100%"
              height="1100"
              frameBorder="0"
              title="Book a Session — Rook Foundations"
              style={{ display: 'block', minWidth: '320px', backgroundColor: '#FFFFFF' }}
            />
          </div>
          <p className="font-nunito text-[#2D2520]/35 text-xs text-center mt-5 font-600">
            Scheduling powered by Calendly · Synced with Google Calendar
          </p>
        </div>
      </section>
    </div>
  );
}