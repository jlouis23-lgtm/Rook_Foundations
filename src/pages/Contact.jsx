import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({
    parentName: '',
    email: '',
    phone: '',
    childName: '',
    childAge: '',
    phase: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="bg-ivory pt-32">
      {/* Header */}
      <section className="bg-midnight relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(250,249,246,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(250,249,246,0.15) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">Contact</span>
          <h1 className="font-playfair text-ivory mb-6" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>
            Let's talk about your child.
          </h1>
          <p className="font-inter text-ivory/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you have questions about our classes, want to book a trial, or just want to chat about 
            whether chess is right for your child — I'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact info */}
            <div className="space-y-8">
              <div>
                <span className="font-inter text-coral text-xs tracking-widest uppercase font-500 block mb-4">Get In Touch</span>
                <h2 className="font-playfair text-midnight text-2xl font-600 mb-4">
                  We're a small, personal operation — which means you'll hear back from Alex directly.
                </h2>
                <p className="font-inter text-slate text-base leading-relaxed">
                  No automated replies, no long waits. Usually within 24 hours.
                </p>
              </div>

              <div className="space-y-5">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@rookfoundations.com', href: 'mailto:hello@rookfoundations.com' },
                  { icon: Phone, label: 'Phone', value: '+1 (234) 567-890', href: 'tel:+1234567890' },
                  { icon: MapPin, label: 'Location', value: 'Local Community Centre\nMain Street, Your City', href: null },
                  { icon: Clock, label: 'Office Hours', value: 'Mon–Fri: 8am – 6pm\nWeekends: By appointment', href: null },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={16} className="text-coral" />
                    </div>
                    <div>
                      <p className="font-inter text-slate text-xs uppercase tracking-wide mb-1">{label}</p>
                      {href ? (
                        <a href={href} className="font-inter text-midnight text-sm hover:text-coral transition-colors whitespace-pre-line">
                          {value}
                        </a>
                      ) : (
                        <p className="font-inter text-midnight text-sm whitespace-pre-line">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trial info card */}
              <div className="bg-slate rounded-2xl p-6 text-ivory">
                <span className="text-3xl block mb-3">♜</span>
                <h3 className="font-playfair text-xl font-600 mb-2">Free Trial Class</h3>
                <p className="font-inter text-ivory/60 text-sm leading-relaxed mb-0">
                  Your first class is completely free. No payment details needed. Just show up and see if your child loves it — we're confident they will.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-slate/10"
                >
                  <div className="w-20 h-20 bg-coral/10 rounded-full flex items-center justify-center mb-6">
                    <Check size={36} className="text-coral" />
                  </div>
                  <h2 className="font-playfair text-midnight text-3xl font-600 mb-4">
                    Thank you, we'll be in touch!
                  </h2>
                  <p className="font-inter text-slate text-lg leading-relaxed max-w-md">
                    Alex will personally review your message and respond within 24 hours. We look forward to welcoming your child to RookFoundations.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-coral font-inter text-sm">
                    <span>♜</span>
                    <span>Check your inbox for a confirmation email.</span>
                  </div>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-3xl border border-slate/10 p-10 shadow-sm space-y-6"
                >
                  <div>
                    <h3 className="font-playfair text-midnight text-2xl font-600 mb-2">Book a Free Trial</h3>
                    <p className="font-inter text-slate text-sm">Fill in the details below and we'll be in touch within 24 hours.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Parent name */}
                    <div>
                      <label className="font-inter text-midnight text-sm font-500 block mb-2">Your Name *</label>
                      <input
                        type="text"
                        name="parentName"
                        value={form.parentName}
                        onChange={handleChange}
                        required
                        placeholder="Emma's Mum / Dad"
                        className="w-full border-2 border-slate/15 rounded-xl px-4 py-3 font-inter text-midnight text-base placeholder:text-slate/40 coral-focus transition-all outline-none bg-ivory"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="font-inter text-midnight text-sm font-500 block mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full border-2 border-slate/15 rounded-xl px-4 py-3 font-inter text-midnight text-base placeholder:text-slate/40 coral-focus transition-all outline-none bg-ivory"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="font-inter text-midnight text-sm font-500 block mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="w-full border-2 border-slate/15 rounded-xl px-4 py-3 font-inter text-midnight text-base placeholder:text-slate/40 coral-focus transition-all outline-none bg-ivory"
                      />
                    </div>

                    {/* Child's name */}
                    <div>
                      <label className="font-inter text-midnight text-sm font-500 block mb-2">Child's Name *</label>
                      <input
                        type="text"
                        name="childName"
                        value={form.childName}
                        onChange={handleChange}
                        required
                        placeholder="Your child's name"
                        className="w-full border-2 border-slate/15 rounded-xl px-4 py-3 font-inter text-midnight text-base placeholder:text-slate/40 coral-focus transition-all outline-none bg-ivory"
                      />
                    </div>

                    {/* Child's age */}
                    <div>
                      <label className="font-inter text-midnight text-sm font-500 block mb-2">Child's Age *</label>
                      <select
                        name="childAge"
                        value={form.childAge}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-slate/15 rounded-xl px-4 py-3 font-inter text-midnight text-base coral-focus transition-all outline-none bg-ivory"
                      >
                        <option value="">Select age</option>
                        {Array.from({ length: 11 }, (_, i) => i + 5).map((age) => (
                          <option key={age} value={age}>{age} years old</option>
                        ))}
                      </select>
                    </div>

                    {/* Phase of interest */}
                    <div>
                      <label className="font-inter text-midnight text-sm font-500 block mb-2">Level of Interest</label>
                      <select
                        name="phase"
                        value={form.phase}
                        onChange={handleChange}
                        className="w-full border-2 border-slate/15 rounded-xl px-4 py-3 font-inter text-midnight text-base coral-focus transition-all outline-none bg-ivory"
                      >
                        <option value="">Not sure (we'll advise)</option>
                        <option value="discovery">Discovery – Beginner (Ages 5–7)</option>
                        <option value="strategy">Strategy – Intermediate (Ages 8–11)</option>
                        <option value="mastery">Mastery – Advanced (Ages 12–15)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="font-inter text-midnight text-sm font-500 block mb-2">Any Questions or Context?</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us anything about your child that might help — learning style, previous experience, any concerns..."
                      className="w-full border-2 border-slate/15 rounded-xl px-4 py-3 font-inter text-midnight text-base placeholder:text-slate/40 coral-focus transition-all outline-none bg-ivory resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-coral text-ivory font-inter font-600 text-base py-4 rounded-full hover:bg-coral-dark transition-all hover:shadow-xl hover:shadow-coral/20 flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Book My Free Trial Class
                        <Send size={16} />
                      </>
                    )}
                  </button>

                  <p className="font-inter text-slate/50 text-xs text-center">
                    No commitment required. Your first class is completely free.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}