import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Check, MessageCircle, Gift } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import Reveal from '@/components/ui/Reveal';

export default function Contact() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
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
    <div className="bg-[#FAFAF7] pt-32">
      {/* Header */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="contact" />
        <Reveal className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            <MessageCircle size={14} /> We'd love to hear from you
          </span>
          <h1 className="font-fredoka text-[#2D2520] mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Let's talk about your child
          </h1>
          <p className="font-nunito text-[#2D2520]/60 text-lg max-w-2xl mx-auto leading-relaxed">
            No pressure, no commitment. Just a warm conversation about what's right for your child.
          </p>
        </Reveal>
      </section>

      {/* Info + Form */}
      <section className="py-8 pb-24 relative overflow-hidden">
        <ChessBg variant="page" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Info */}
            <div className="space-y-6">
              <Reveal direction="left">
                <h2 className="font-fredoka text-[#2D2520] text-2xl mb-2">You'll hear back from me directly</h2>
                <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed mb-6">No automated replies, no long waits — usually within 24 hours.</p>
                <div className="space-y-5">
                  {[
                    { icon: Mail, label: 'Email', value: 'louis.jenkins@rookfoundations.com', href: 'mailto:louis.jenkins@rookfoundations.com' },
                    { icon: Phone, label: 'Phone', value: '+44 7707 267 563', href: 'tel:+447707267563' },
                    { icon: MapPin, label: 'Location', value: 'Dunmow Library\n47 White Hart Way\nGreat Dunmow, CM6 1FS', href: null },
                    { icon: Clock, label: 'Hours', value: 'Mon–Fri: 8am – 6pm\nWeekends: By appointment', href: null },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="group flex items-start gap-4">
                      <div className="mt-0.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                        <Icon size={20} className="text-[#E8A020]" />
                      </div>
                      <div>
                        <p className="font-nunito text-[#E8A020]/80 text-xs font-700 uppercase tracking-wide mb-1">{label}</p>
                        {href ? (
                          <a href={href} className="font-nunito text-[#2D2520]/70 text-sm hover:text-[#E8A020] transition-colors whitespace-pre-line break-all">{value}</a>
                        ) : (
                          <p className="font-nunito text-[#2D2520]/70 text-sm whitespace-pre-line">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal direction="left" delay={0.1} className="bg-amber-50 rounded-3xl p-7">
                <Gift size={30} className="text-[#E8A020] mb-3" />
                <h3 className="font-fredoka text-[#2D2520] text-xl mb-2">First Lesson — 50% Off</h3>
                <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed">
                  Your first assessment lesson is half price. We'll find the perfect starting point for your child and make sure they feel comfortable from the very first move.
                </p>
              </Reveal>
            </div>

            {/* Form */}
            <Reveal direction="right" delay={0.1} className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20 bg-green-50 rounded-3xl"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Check size={36} className="text-green-600" />
                  </div>
                  <h2 className="font-fredoka text-[#2D2520] text-3xl mb-4">Message sent!</h2>
                  <p className="font-nunito text-[#2D2520]/60 text-lg leading-relaxed max-w-md">
                    I'll personally review your message and respond within 24 hours. Looking forward to welcoming your child to Rook Foundations.
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-[#E8A020] font-nunito text-sm font-700">
                    <span>♜</span>
                    <span>Check your inbox for confirmation.</span>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-[#E8A020]/15 rounded-3xl p-8 lg:p-10 space-y-5 shadow-sm">
                  <div>
                    <h3 className="font-fredoka text-[#2D2520] text-2xl mb-1 flex items-center gap-2">
                      <Send size={20} className="text-[#E8A020]" /> Get in touch
                    </h3>
                    <p className="font-nunito text-[#2D2520]/45 text-sm">We'll be in touch within 24 hours.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'parentName', label: "Your Name", type: 'text', placeholder: "Emma's Mum / Dad", required: true },
                      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', required: true },
                      { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Optional', required: false },
                      { name: 'childName', label: "Child's Name", type: 'text', placeholder: "Your child's first name", required: true },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="font-nunito text-[#2D2520]/60 text-xs font-700 uppercase tracking-wide block mb-2">{f.label} {f.required && '*'}</label>
                        <input
                          type={f.type}
                          name={f.name}
                          value={form[f.name]}
                          onChange={handleChange}
                          required={f.required}
                          placeholder={f.placeholder}
                          className="w-full bg-[#FAFAF7] border-2 border-[#E8A020]/20 rounded-2xl px-4 py-3 font-nunito text-[#2D2520] text-sm placeholder:text-[#2D2520]/30 gold-focus transition-all outline-none"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="font-nunito text-[#2D2520]/60 text-xs font-700 uppercase tracking-wide block mb-2">Child's Age *</label>
                      <select name="childAge" value={form.childAge} onChange={handleChange} required
                        className="w-full bg-[#FAFAF7] border-2 border-[#E8A020]/20 rounded-2xl px-4 py-3 font-nunito text-[#2D2520] text-sm gold-focus transition-all outline-none">
                        <option value="">Select age</option>
                        {Array.from({ length: 11 }, (_, i) => i + 5).map((age) => (
                          <option key={age} value={age}>{age} years old</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-nunito text-[#2D2520]/60 text-xs font-700 uppercase tracking-wide block mb-2">Level of Interest</label>
                      <select name="phase" value={form.phase} onChange={handleChange}
                        className="w-full bg-[#FAFAF7] border-2 border-[#E8A020]/20 rounded-2xl px-4 py-3 font-nunito text-[#2D2520] text-sm gold-focus transition-all outline-none">
                        <option value="">Not sure — we'll advise!</option>
                        <option value="discovery">Discovery (Beginners)</option>
                        <option value="strategy">Strategy (Intermediate)</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-nunito text-[#2D2520]/60 text-xs font-700 uppercase tracking-wide block mb-2">Any Questions or Context?</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                      placeholder="Tell us about your child — learning style, any questions, or anything that would help us prepare..."
                      className="w-full bg-[#FAFAF7] border-2 border-[#E8A020]/20 rounded-2xl px-4 py-3 font-nunito text-[#2D2520] text-sm placeholder:text-[#2D2520]/30 gold-focus transition-all outline-none resize-none" />
                  </div>

                  <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
                    className="w-full bg-[#E8A020] text-white font-fredoka font-600 text-lg py-4 rounded-2xl hover:bg-[#d4940e] transition-all hover:shadow-xl hover:shadow-[#E8A020]/20 hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-70">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>Send My Message <Send size={18} /></>
                    )}
                  </motion.button>
                  <p className="font-nunito text-[#2D2520]/35 text-xs text-center">Your first assessment lesson is 50% off. No long-term commitment required.</p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}