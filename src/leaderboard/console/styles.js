// Shared class strings for the practitioner console. The console keeps the
// neutral Rook Foundations look for every game; game themes apply to the
// child-facing display.

export const ink = 'text-[#2D2520]';
export const muted = 'text-[#2D2520]/60';
export const rule = 'border-[#2D2520]/15';

const base =
  'inline-flex items-center justify-center gap-2 font-nunito font-700 rounded-md transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 ' +
  'disabled:opacity-40 disabled:pointer-events-none';

export const btnPrimary = `${base} h-11 px-5 bg-[#2D2520] text-[#FAFAF7] hover:bg-[#2D2520]/85`;
export const btnQuiet = `${base} h-11 px-4 border border-[#2D2520]/25 text-[#2D2520] hover:bg-[#2D2520]/5`;
export const btnText = `${base} h-9 px-2 text-sm text-[#2D2520]/70 underline underline-offset-4 hover:text-[#2D2520]`;
export const btnDanger = `${base} h-11 px-4 border border-[#B3261E]/40 text-[#B3261E] hover:bg-[#B3261E]/5`;

export const field =
  'h-11 w-full rounded-md border border-[#2D2520]/25 bg-white px-3 font-nunito text-base text-[#2D2520] ' +
  'placeholder:text-[#2D2520]/40 focus:outline-none focus:ring-2 focus:ring-[#E8A020]';

export const eyebrow = 'font-nunito text-xs font-700 uppercase tracking-[0.14em] text-[#2D2520]/55';
