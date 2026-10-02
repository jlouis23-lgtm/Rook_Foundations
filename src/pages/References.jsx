import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ChevronDown } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import ResearchMap from '@/components/research/ResearchMap';
import ResearchPanel from '@/components/research/ResearchPanel';
import ReferenceList from '@/components/research/ReferenceList';
import { topics, notFound } from '@/data/research';
import { usePageMeta } from '@/hooks/use-page-meta';

const EASE = [0.22, 1, 0.36, 1];

// Puts keyboard focus back on the strand that was open, once its panel has
// closed. Both the radial and the phone layout render a button per strand,
// so pick whichever one is actually visible.
function restoreFocus(id) {
  const trigger = [...document.querySelectorAll(`[data-topic-trigger="${id}"]`)].find((el) => el.offsetParent !== null);
  trigger?.focus();
}

export default function References() {
  usePageMeta(
    'The Research Behind Our Approach | Rook Foundations',
    'Explore the research behind the Rook Foundations approach, strand by strand: what each study found, who took part and where the evidence is limited.'
  );
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // A strand is "open" when the URL carries its id, e.g. /references#adults-guiding-play.
  // That makes every strand linkable, and lets the browser's Back button close it.
  const { pathname, hash, state } = useLocation();
  const navigate = useNavigate();
  const activeTopic = useMemo(() => topics.find((t) => `#${t.id}` === hash) ?? null, [hash]);

  const openTopic = (id) => navigate({ pathname, hash: `#${id}` }, { state: { fromMap: true } });
  const switchTopic = (id) => navigate({ pathname, hash: `#${id}` }, { replace: true, state });
  const closePanel = () => {
    if (state?.fromMap) navigate(-1);
    else navigate({ pathname, hash: '' }, { replace: true });
  };

  return (
    <div className="bg-[#FAFAF7] pt-32 pb-24">
      {/* Introduction */}
      <section className="relative overflow-hidden pb-4 pt-10">
        <ChessBg variant="references" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-12">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="group mb-10 inline-flex items-center gap-2 font-nunito text-sm font-600 text-[#2D2520]/70 transition-colors hover:text-[#8a5a06]"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>

          <div className="grid items-start gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-x-14 lg:gap-x-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="mb-5 inline-flex items-center gap-1.5 font-nunito text-sm font-800 uppercase tracking-widest text-amber-700">
                <BookOpen size={14} aria-hidden="true" /> Research and evidence
              </span>
              <h1 className="font-fredoka leading-[1.08] text-[#2D2520]" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
                The research behind our approach
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="md:pt-10"
            >
              <p className="font-fredoka text-xl text-[#2D2520]">Why games?</p>
              <p className="mt-2 font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
                We don’t use games simply because children enjoy them, although that helps. We choose them because a good game gives a child something real to think about: a decision to make, a pattern to notice, a plan that doesn’t quite work out, and another go.
              </p>
              <p className="mt-3 font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
                Often the most useful part comes afterwards, when we stop and talk about what happened and what we might try next time.
              </p>
              <p className="mt-3 font-nunito text-[1.05rem] leading-relaxed text-[#2D2520]/85">
                The research behind this is broad, and it doesn’t say that every game builds every skill. We’ve tried to be honest about that, including where the evidence is thin or mixed. Choose a strand below to see what we’ve read and what we make of it.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The research map */}
      <section aria-labelledby="map-heading" className="relative z-10 mx-auto mt-6 max-w-5xl px-6 lg:px-12 md:mt-2">
        <h2 id="map-heading" className="sr-only">Explore the research strands</h2>
        <ResearchMap topics={topics} activeId={activeTopic?.id ?? null} onSelect={openTopic} />
        <p className="mx-auto mt-8 max-w-xl text-center font-nunito text-[0.95rem] leading-relaxed text-[#2D2520]/75">
          Choose any strand; there is no right order. Every study is labelled by how closely it relates to the games we use, and you’ll find the key inside each strand.
        </p>
      </section>

      <ResearchPanel
        topic={activeTopic}
        topics={topics}
        onClose={closePanel}
        onSelect={switchTopic}
        onCloseFocus={restoreFocus}
      />

      {/* What we have not found */}
      <section className="relative z-10 mx-auto mt-24 max-w-5xl px-6 lg:px-12">
        <div className="grid gap-x-14 gap-y-6 border-t border-[#2D2520]/10 pt-12 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <h2 className="font-fredoka text-2xl text-[#2D2520]">What we have not found</h2>
            <p className="mt-3 font-nunito text-[0.95rem] leading-relaxed text-[#2D2520]/75">
              Being honest about the research also means saying where it runs out.
            </p>
          </div>
          <div className="space-y-4 border-l-[3px] border-[#E8A020]/60 pl-6">
            {notFound.map((item) => (
              <p key={item} className="font-nunito text-[1rem] leading-relaxed text-[#2D2520]/85">
                {item}
              </p>
            ))}
            <p className="pt-2 font-nunito text-[0.85rem] leading-relaxed text-[#2D2520]/70">
              Last reviewed October 2026. If you know of research we have missed, please tell us.
            </p>
          </div>
        </div>
      </section>

      {/* The same studies as a plain list, for anyone who prefers one */}
      <section aria-labelledby="list-heading" className="relative z-10 mx-auto mt-24 max-w-3xl px-6 lg:px-12">
        <h2 id="list-heading" className="font-fredoka text-2xl text-[#2D2520]">Prefer a list?</h2>
        <p className="mt-2 font-nunito text-[0.95rem] leading-relaxed text-[#2D2520]/75">
          Every study from every strand, in one place. Open a strand to see its studies.
        </p>
        <div className="mt-6 divide-y divide-[#2D2520]/10 border-y border-[#2D2520]/10">
          {topics.map((t) => (
            <details key={t.id} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D2520] [&::-webkit-details-marker]:hidden">
                <span className="font-fredoka text-[1.05rem] leading-snug text-[#2D2520]">{t.title}</span>
                <span className="flex flex-shrink-0 items-center gap-2 whitespace-nowrap font-nunito text-sm text-[#2D2520]/75">
                  {t.refs.length} studies
                  <ChevronDown size={16} aria-hidden="true" className="transition-transform group-open:rotate-180" />
                </span>
              </summary>
              <div className="pb-6 pt-1">
                <ReferenceList refs={t.refs} deep={t.deep} />
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="mx-auto mt-20 max-w-4xl px-6 text-center lg:px-12">
        <p className="mb-5 font-nunito text-sm font-600 text-[#2D2520]/70">
          Have a question about any of these sources, or want to learn more?
        </p>
        <Link
          to="/contact"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#E8A020] px-8 py-3.5 font-fredoka text-base font-600 text-white transition-all hover:-translate-y-0.5 hover:bg-[#d4940e] hover:shadow-lg hover:shadow-[#E8A020]/25"
        >
          Get in touch
        </Link>
      </section>
    </div>
  );
}
