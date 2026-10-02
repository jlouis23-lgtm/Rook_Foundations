import { useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { evidenceKey, evidenceLabels } from '@/data/research';
import ReferenceList from './ReferenceList';

// The slide-over that opens when a research strand is chosen on the map.
// Built on Radix Dialog (already used across the site's UI components) so it
// gets a focus trap, Escape to close, scroll locking and screen-reader
// labelling for free. The map stays faintly visible behind it.
export default function ResearchPanel({ topic, topics, onClose, onSelect, onCloseFocus }) {
  // Keep the last topic around so the panel's content doesn't vanish while
  // it is sliding out.
  const lastTopic = useRef(topic);
  if (topic) lastTopic.current = topic;
  const shown = topic ?? lastTopic.current;
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [topic?.id]);

  if (!shown) return null;

  const index = topics.findIndex((t) => t.id === shown.id);
  const prev = topics[(index - 1 + topics.length) % topics.length];
  const next = topics[(index + 1) % topics.length];

  return (
    <Dialog.Root open={Boolean(topic)} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-[#2D2520]/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none" />
        <Dialog.Content
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            onCloseFocus?.(shown.id);
          }}
          className="fixed inset-y-0 right-0 z-[61] flex w-full flex-col bg-[#FAFAF7] shadow-2xl outline-none sm:max-w-xl lg:max-w-[40rem] duration-300 data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right motion-reduce:animate-none"
        >
          <div aria-hidden="true" className="h-1 flex-shrink-0" style={{ backgroundColor: shown.accent }} />

          <div className="flex h-16 flex-shrink-0 items-center border-b border-[#2D2520]/10 px-5 sm:px-8">
            <Dialog.Close className="-ml-3 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 font-nunito text-sm font-700 text-[#2D2520]/80 transition-colors hover:bg-[#2D2520]/[0.05] hover:text-[#2D2520] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D2520]">
              <ArrowLeft size={16} aria-hidden="true" />
              Back to the map
            </Dialog.Close>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-5 pb-14 sm:px-8">
            <Dialog.Title className="mt-8 font-fredoka text-[1.7rem] leading-tight text-[#2D2520] sm:text-[1.95rem]">
              {shown.title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 font-nunito text-[1rem] italic leading-snug text-[#2D2520]/75">
              {shown.preview}
            </Dialog.Description>

            {shown.story.map((block, i) => {
              const isCaveat = block.kind === 'caveat';
              return (
                <section
                  key={block.label}
                  className={`mt-9 ${isCaveat ? 'border-l-[3px] pl-5' : ''}`}
                  style={isCaveat ? { borderColor: shown.accent } : undefined}
                >
                  {isCaveat ? (
                    <h3 className="font-fredoka text-lg" style={{ color: shown.deep }}>{block.label}</h3>
                  ) : (
                    <h3 className="font-nunito text-[0.72rem] font-800 uppercase tracking-widest" style={{ color: shown.deep }}>
                      {block.label}
                    </h3>
                  )}
                  <div className="mt-2 space-y-4">
                    {block.body.map((paragraph, pi) => (
                      <p
                        key={pi}
                        className={
                          i === 0
                            ? 'font-fredoka text-[1.2rem] italic leading-snug text-[#2D2520]'
                            : 'font-nunito text-[1.02rem] leading-[1.75] text-[#2D2520]/85'
                        }
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}

            <section className="mt-14" aria-labelledby={`${shown.id}-studies`}>
              <h3 id={`${shown.id}-studies`} className="font-fredoka text-xl text-[#2D2520]">
                Explore the research
              </h3>
              <p className="mt-1 font-nunito text-[0.9rem] text-[#2D2520]/75">
                {shown.refs.length} studies and sources behind this strand.
              </p>

              <details className="mt-3">
                <summary className="w-fit cursor-pointer font-nunito text-[0.85rem] font-700 underline underline-offset-2" style={{ color: shown.deep }}>
                  How to read the labels
                </summary>
                <dl className="mt-3 space-y-2.5">
                  {evidenceKey.map((item) => (
                    <div key={item.level}>
                      <dt className="font-nunito text-[0.82rem] font-800 text-[#2D2520]">{evidenceLabels[item.level]}</dt>
                      <dd className="font-nunito text-[0.85rem] leading-snug text-[#2D2520]/75">{item.meaning}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 font-nunito text-[0.85rem] leading-snug text-[#2D2520]/75">
                  Describing a product as educational is not the same as showing that it is, so we separate the two.
                </p>
              </details>

              <div className="mt-5">
                <ReferenceList refs={shown.refs} deep={shown.deep} />
              </div>
            </section>

            <nav aria-label="Other research strands" className="mt-14 grid gap-3 border-t border-[#2D2520]/10 pt-6 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onSelect(prev.id)}
                className="min-h-14 rounded-xl px-4 py-3 text-left transition-colors hover:bg-[#2D2520]/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D2520]"
              >
                <span className="flex items-center gap-1.5 font-nunito text-[0.7rem] font-800 uppercase tracking-widest" style={{ color: prev.deep }}>
                  <ArrowLeft size={13} aria-hidden="true" /> Previous strand
                </span>
                <span className="mt-1 block font-fredoka text-[0.98rem] leading-snug text-[#2D2520]">{prev.title}</span>
              </button>
              <button
                type="button"
                onClick={() => onSelect(next.id)}
                className="min-h-14 rounded-xl px-4 py-3 text-left transition-colors hover:bg-[#2D2520]/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D2520] sm:text-right"
              >
                <span className="flex items-center gap-1.5 font-nunito text-[0.7rem] font-800 uppercase tracking-widest sm:justify-end" style={{ color: next.deep }}>
                  Next strand <ArrowRight size={13} aria-hidden="true" />
                </span>
                <span className="mt-1 block font-fredoka text-[0.98rem] leading-snug text-[#2D2520]">{next.title}</span>
              </button>
            </nav>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
