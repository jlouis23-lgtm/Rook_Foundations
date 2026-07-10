import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Cookie, Mail, Phone, Globe, User2, MessageCircle,
} from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import Reveal from '@/components/ui/Reveal';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import { cookiesMeta, cookiesSections } from '@/data/cookiesPolicy';

function Spans({ spans }) {
  return spans.map((s, i) =>
    s.bold ? (
      <strong key={i} className="font-700 text-[#2D2520]">{s.text}</strong>
    ) : (
      <span key={i}>{s.text}</span>
    )
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2.5 mb-4">
      {items.map((spans, i) => (
        <li key={i} className="flex items-start gap-3 font-nunito text-[#2D2520]/75 text-base leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8A020] flex-shrink-0 mt-2.5" />
          <span><Spans spans={spans} /></span>
        </li>
      ))}
    </ul>
  );
}

function CpBlock({ block }) {
  if (block.kind === 'para') {
    return (
      <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4 last:mb-0">
        <Spans spans={block.spans} />
      </p>
    );
  }
  if (block.kind === 'subheading') {
    return (
      <h3 className="font-fredoka text-[#2D2520] text-lg sm:text-xl mt-8 mb-3">
        {block.title}
      </h3>
    );
  }
  if (block.kind === 'list') {
    return <BulletList items={block.items} />;
  }
  return null;
}

const contactRows = [
  { Icon: User2, label: 'Operated by', value: 'Louis Emile Jenkins', badge: 'Founder' },
  { Icon: Mail, label: 'Email', value: 'louis.jenkins@rookfoundations.com', href: 'mailto:louis.jenkins@rookfoundations.com' },
  { Icon: Phone, label: 'Telephone', value: '07707 267563', href: 'tel:+447707267563' },
  { Icon: Globe, label: 'Website', value: 'www.rookfoundations.co.uk', href: 'https://www.rookfoundations.co.uk' },
];

function ContactSection({ section, isFirst }) {
  const intro = section.blocks.find((b) => b.kind === 'para');
  return (
    <section id={`section-${section.num}`} className={`scroll-mt-28 py-10 ${isFirst ? '' : 'border-t border-[#2D2520]/10'}`}>
      <h2 className="font-fredoka text-[#2D2520] text-2xl sm:text-3xl mb-5">
        <span className="text-[#E8A020]">{section.num}.</span> {section.title}
      </h2>
      {intro && (
        <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-6">
          <Spans spans={intro.spans} />
        </p>
      )}
      <div className="bg-[#F5F3EE]/60 rounded-2xl p-6 sm:p-8">
        <p className="font-fredoka text-[#2D2520] text-lg mb-5">Rook Foundations</p>
        <dl className="space-y-4">
          {contactRows.map(({ Icon, label, value, href, badge }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={18} className="text-[#E8A020] flex-shrink-0 mt-0.5" />
              <div>
                <dt className="font-nunito text-[#2D2520]/45 text-xs font-700 uppercase tracking-wide mb-0.5">{label}</dt>
                <dd className="font-nunito text-[#2D2520] text-sm leading-relaxed">
                  {href ? (
                    <a href={href} className="hover:text-[#E8A020] transition-colors underline decoration-[#2D2520]/20 hover:decoration-[#E8A020] underline-offset-2">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                  {badge && (
                    <span className="ml-2 inline-flex items-center font-nunito text-[10px] font-700 uppercase tracking-wide text-[#b8790a] bg-[#E8A020]/12 rounded-full px-2 py-0.5 align-middle">
                      {badge}
                    </span>
                  )}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function CookiesPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32 pb-24">
      {/* Header */}
      <section className="relative overflow-hidden py-16">
        <ChessBg variant="legal" />

        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="print:hidden inline-flex items-center gap-2 font-nunito text-[#2D2520]/45 text-sm font-600 hover:text-[#E8A020] transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            <Cookie size={14} /> Legal
          </span>

          <h1 className="font-fredoka text-[#2D2520] mb-3" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>
            Cookie Policy
          </h1>
          <p className="font-nunito text-[#2D2520]/60 text-lg leading-relaxed max-w-2xl mb-4">
            How Rook Foundations uses cookies on our website
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-nunito text-[#2D2520]/40 text-sm">
            <span>{cookiesMeta.version}</span>
            <span aria-hidden="true">·</span>
            <span>{cookiesMeta.lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Contents */}
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-8 border-t border-b border-[#2D2520]/10 print:hidden">
        <Reveal>
          <p className="font-nunito text-[#2D2520]/45 text-xs font-700 uppercase tracking-widest mb-4">Contents</p>
          <nav aria-label="Table of contents">
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 list-none">
              {cookiesSections.map((s) => (
                <li key={s.num}>
                  <a
                    href={`#section-${s.num}`}
                    className="flex items-baseline gap-2 font-nunito text-sm text-[#2D2520]/65 hover:text-[#E8A020] transition-colors py-1"
                  >
                    <span className="text-[#E8A020]/70 font-700 text-xs w-5 flex-shrink-0">{s.num}.</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Reveal>
      </section>

      {/* Document body */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        {cookiesSections.map((s, i) =>
          s.num === '10' ? (
            <ContactSection key={s.num} section={s} isFirst={i === 0} />
          ) : (
            <section
              key={s.num}
              id={`section-${s.num}`}
              className={`scroll-mt-28 py-10 ${i === 0 ? '' : 'border-t border-[#2D2520]/10'}`}
            >
              <h2 className="font-fredoka text-[#2D2520] text-2xl sm:text-3xl mb-5">
                <span className="text-[#E8A020]">{s.num}.</span> {s.title}
              </h2>
              {s.blocks.map((b, bi) => (
                <CpBlock key={bi} block={b} />
              ))}
            </section>
          )
        )}
      </div>

      {/* CTA */}
      <section className="print:hidden mt-16 py-20 text-center bg-[#E8A020] relative overflow-hidden">
        <ChessBg variant="cta" color="#ffffff" />
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <MessageCircle size={36} className="text-white mx-auto mb-4" />
          <h2 className="font-fredoka text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
            Questions about cookies?
          </h2>
          <p className="font-nunito text-white/80 text-lg mb-8">
            We're always happy to talk through anything in this policy with parents or schools.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-2 bg-white text-[#E8A020] font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Get in touch <ArrowRight size={20} />
          </MotionLink>
        </div>
      </section>
    </div>
  );
}
