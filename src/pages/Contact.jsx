import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ parentName: '', email: '', phone: '', childName: '', childAge: '', phase: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0A0A0A' }} className="pt-32">
      <section className="relative overflow-hidden py-20 border-b border-[#D4A843]/15">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="gold-line mx-auto mb-5" />
          <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Contact</span>
          <h1 className="font-oswald text-white uppercase mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '0.02em' }}>
            Let's talk about your child.
          </h1>
          <p className="font-lato text-white/50 text-lg max-w-2xl mx-auto">
            Whether you have questions, want to book a session, or just want to chat — I'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Calendly Booking Section */}
      <section className="py-24 border-b border-[#D4A843]/10" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="gold-line mx-auto mb-5" />
            <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Book a Session</span>
            <h2 className="font-oswald text-white uppercase mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', letterSpacing: '0.02em' }}>
              View Availability & Schedule a Lesson
            </h2>
            <p className="font-lato text-white/50 text-base max-w-xl mx-auto leading-relaxed">
              Browse available lesson slots and book directly online. All sessions are confirmed instantly and synced with my calendar — no back-and-forth needed.
            </p>
          </div>

          {/* Calendly embed wrapper — parameters force transparent bg + hide branding */}
          <div
            className="relative border border-[#D4A843]/20 overflow-hidden"
            style={{ backgroundColor: '#0A0A0A' }}
          >
            {/* Top gold accent bar */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4A843]/60 to-transparent" />

            <iframe
              src="https://calendly.com/louis-jenkins-rookfoundations?embed_domain=rookfoundations.com&embed_type=Inline&hide_gdpr_banner=1&background_color=0A0A0A&text_color=F5F5F5&primary_color=D4A843"
              width="100%"
              height="720"
              frameBorder="0"
              scrolling="no"
              title="Book a Session — Rook Foundations"
              style={{
                display: 'block',
                minWidth: '320px',
                backgroundColor: '#0A0A0A',
              }}
            />

            {/* Bottom gold accent bar */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4A843]/60 to-transparent" />
          </div>

          <p className="font-lato text-white/20 text-xs text-center mt-5 tracking-wide">
            Scheduling powered by Calendly · Synced with Google Calendar
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Info */}
            <div className="space-y-8">
              <div>
                <div className="gold-line mb-5" />
                <span className="font-oswald text-[#D4A843] text-sm tracking-widest uppercase block mb-4">Get In Touch</span>
                <h2 className="font-oswald text-white text-2xl uppercase tracking-wide mb-4">
                  You'll hear back from me directly — usually within 24 hours.
                </h2>
                <p className="font-lato text-white/50 text-base">No automated replies, no long waits.</p>
              </div>

              <div className="space-y-5">
                {[
                  { icon: Mail, label: 'Email', value: 'louis.jenkins@rookfoundations.com', href: 'mailto:louis.jenkins@rookfoundations.com' },
                  { icon: Phone, label: 'Phone', value: '+44 7707 267 563', href: 'tel:+447707267563' },
                  { icon: MapPin, label: 'Location', value: 'Dunmow Library\n47 White Hart Way\nGreat Dunmow, CM6 1FS', href: null },
                  { icon: Clock, label: 'Hours', value: 'Mon–Fri: 8am – 6pm\nWeekends: By appointment', href: null },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-[#D4A843]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={16} className="text-[#D4A843]" />
                    </div>
                    <div>
                      <p className="font-oswald text-[#D4A843]/60 text-xs uppercase tracking-widest mb-1">{label}</p>
                      {href ? (
                        <a href={href} className="font-lato text-white/70 text-sm hover:text-[#D4A843] transition-colors whitespace-pre-line">{value}</a>
                      ) : (
                        <p className="font-lato text-white/70 text-sm whitespace-pre-line">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-[#D4A843]/25 p-6 bg-[#0D0D0D]">
                <span className="text-3xl text-[#D4A843] block mb-3">♜</span>
                <h3 className="font-oswald text-white text-xl uppercase tracking-wide mb-2">First Lesson — 50% Off</h3>
                <p className="font-lato text-white/50 text-sm leading-relaxed">
                  Your first assessment lesson is 50% off. We'll find the perfect starting point for your child and make sure they feel comfortable from the very first move.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20 bg-[#0D0D0D] border border-[#D4A843]/20"
                >
                  <div className="w-20 h-20 border-2 border-[#D4A843] flex items-center justify-center mb-6">
                    <Check size={36} className="text-[#D4A843]" />
                  </div>
                  <h2 className="font-oswald text-white text-3xl uppercase tracking-wide mb-4">Thank you!</h2>
                  <p className="font-lato text-white/50 text-lg leading-relaxed max-w-md">
                    I'll personally review your message and respond within 24 hours. Looking forward to welcoming your child to RookFoundations.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-[#D4A843] font-oswald text-sm tracking-widest uppercase">
                    <span>♜</span>
                    <span>Check your inbox for confirmation.</span>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-[#0D0D0D] border border-[#D4A843]/15 p-10 space-y-6">
                  <div>
                    <h3 className="font-oswald text-white text-2xl uppercase tracking-wide mb-1">Get In Touch</h3>
                    <div className="gold-line mt-3 mb-2" />
                    <p className="font-lato text-white/40 text-sm">We'll be in touch within 24 hours.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { name: 'parentName', label: "Your Name", type: 'text', placeholder: "Emma's Mum / Dad", required: true },
                      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', required: true },
                      { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Optional', required: false },
                      { name: 'childName', label: "Child's Name", type: 'text', placeholder: "Your child's name", required: true },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="font-oswald text-white/60 text-xs uppercase tracking-widest block mb-2">{f.label} {f.required && '*'}</label>
                        <input
                          type={f.type}
                          name={f.name}
                          value={form[f.name]}
                          onChange={handleChange}
                          required={f.required}
                          placeholder={f.placeholder}
                          className="w-full bg-[#0A0A0A] border border-[#D4A843]/20 px-4 py-3 font-lato text-white text-base placeholder:text-white/20 gold-focus transition-all outline-none"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="font-oswald text-white/60 text-xs uppercase tracking-widest block mb-2">Child's Age *</label>
                      <select name="childAge" value={form.childAge} onChange={handleChange} required
                        className="w-full bg-[#0A0A0A] border border-[#D4A843]/20 px-4 py-3 font-lato text-white text-base gold-focus transition-all outline-none">
                        <option value="">Select age</option>
                        {Array.from({ length: 11 }, (_, i) => i + 5).map((age) => (
                          <option key={age} value={age}>{age} years old</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-oswald text-white/60 text-xs uppercase tracking-widest block mb-2">Level of Interest</label>
                      <select name="phase" value={form.phase} onChange={handleChange}
                        className="w-full bg-[#0A0A0A] border border-[#D4A843]/20 px-4 py-3 font-lato text-white text-base gold-focus transition-all outline-none">
                        <option value="">Not sure (we'll advise)</option>
                        <option value="discovery">Discovery</option>
                        <option value="strategy">Strategy</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-oswald text-white/60 text-xs uppercase tracking-widest block mb-2">Any Questions or Context?</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                      placeholder="Tell us about your child — learning style, experience, any questions..."
                      className="w-full bg-[#0A0A0A] border border-[#D4A843]/20 px-4 py-3 font-lato text-white text-base placeholder:text-white/20 gold-focus transition-all outline-none resize-none" />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-[#D4A843] text-[#0A0A0A] font-oswald font-700 text-base tracking-wider py-4 hover:bg-[#e8c06a] transition-all hover:shadow-xl hover:shadow-[#D4A843]/20 flex items-center justify-center gap-3 disabled:opacity-70">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      <>SEND MESSAGE <Send size={16} /></>
                    )}
                  </button>
                  <p className="font-lato text-white/30 text-xs text-center">Your first assessment lesson is 50% off. No long-term commitment required.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}