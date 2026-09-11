import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import PeopleIcon from '@/components/pricing/PeopleIcon';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';
import Reveal from '@/components/ui/Reveal';
import { usePageMeta } from '@/hooks/use-page-meta';

const EASE = [0.22, 1, 0.36, 1];

// The three areas making up the enrichment offer. Presented as three
// neutral, equal-weight cards (bg-white border, NOT the coloured play-card
// treatment used for the Schools page's three session-FORMAT cards) because
// these aren't alternatives a school picks between — they're three facets
// of one flexible offer, so equal/neutral styling avoids implying they're
// competing options. Each gets a small coloured heading rule rather than an
// icon, per the brief's steer away from decorative/generic SEND imagery.
const offerAreas = [
  {
    key: 'games-strategy',
    accent: '#2d8c62',
    title: 'Games & Strategy',
    body: "Games can provide opportunities to explore strategy, planning and decision-making, and to practise turn-taking, concentration and persistence along the way. They can also create natural opportunities for interacting with others and thinking through choices and their consequences. Chess is one example we sometimes use, but it's just one part of a wider range of strategy and other games — each selected because it suits the pupils taking part, not because a particular game is assumed to be inherently better suited to SEND.",
  },
  {
    key: 'puzzles-exploration',
    accent: '#4a7eb8',
    title: 'Puzzles & Exploration',
    body: "Not every pupil engages best through a competitive or turn-based game, so we also draw on puzzles and exploratory activities — from tactile problem-solving resources and Rubik's cubes to open-ended challenges pupils can experiment with, investigate and work through at their own pace. These aren't a fallback for pupils who find games difficult; they're a valuable way to participate in their own right, through exploration, observation and independent problem-solving.",
  },
  {
    key: 'flexible-enrichment',
    accent: '#7a48c0',
    title: 'Flexible Enrichment',
    body: "Activities can be adapted around the pupil or group in many ways — adjusting the complexity, pace, instructions, grouping, equipment or the amount of support offered, among others. Adaptation doesn't only mean making something simpler: where it's a better fit, an activity can just as easily be made more challenging, extended or developed further, based on a pupil's interests and abilities. Our practitioners use their professional judgement, session by session, to decide what's appropriate for the pupils in front of them.",
  },
];

// The seven ways participation can look, per the brief — deliberately
// rendered as a loose, equal-weight cluster of pills (no numbering, no
// checkmarks, no connecting arrows) rather than a checklist or a sequence:
// none of these is "better" than another, and a pupil isn't expected to
// move through them in any particular order.
const waysToParticipate = ['Play', 'Observe', 'Explore', 'Work independently', 'Take a smaller role', 'Try an alternative', 'Return later'];

// Examples only, per the brief — same loose pill-cluster treatment as
// waysToParticipate, deliberately not framed as a menu a school must pick
// from (the paragraph beneath makes that explicit).
const sessionProvideExamples = [
  'Enjoyable enrichment',
  'Trying strategy games',
  'Something new to experience',
  'Meaningful engagement',
  'Success and independence',
  'Puzzles and problem-solving',
  'Participating alongside others',
];

// When activity decisions actually happen — reuses the Schools page's
// DeliveryRow left-accent treatment (flat, no card background) since this
// is the same shape of content: a small set of related options, not
// products to compare.
const planningMoments = [
  {
    accent: '#c9860f',
    title: 'Before the session',
    body: "Using what you've told us about the pupils and our own knowledge of the activities available.",
  },
  {
    accent: '#2a8c88',
    title: 'At the start',
    body: 'By seeing how pupils respond to the introduction, the environment and the activity itself.',
  },
  {
    accent: '#c05050',
    title: 'During the session',
    body: 'By responding to engagement, interests, strengths or difficulties as they come up.',
  },
];

// Destination for the "Explore our approach to working with SEND pupils"
// link on the Schools page. "What We Offer" is Section 2 of the wider SEND
// project — the introductory hero is Section 1's own content, restated
// here. The remaining detailed material (group sizes, the SEND Group
// Information Form, school responsibilities, safeguarding boundaries, the
// Personalised Enrichment Review, FAQs, etc.) is still being developed and
// will be added to this page as further sections, so the closing notice
// stays honest about that rather than implying the page is finished.
export default function SendPupils() {
  usePageMeta(
    'Working with SEND Pupils | Rook Foundations',
    'Rook Foundations provides inclusive enrichment for pupils with SEND through games, puzzles and strategic activities, adapted around the individual pupil or group.'
  );
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32">

      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <ChessBg variant="schools" />
        <Reveal className="max-w-2xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            Inclusive enrichment
          </span>
          <h1 className="font-fredoka text-[#2D2520] leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}>
            Working with SEND Pupils
          </h1>
          <p className="font-nunito text-[#2D2520]/65 text-lg leading-relaxed max-w-xl mx-auto">
            Rook Foundations provides inclusive enrichment for pupils with SEND through games, puzzles and strategic activities. Sessions are shaped around meaningful participation, enjoyment and engagement, with activities adapted to suit the individual pupil or group.
          </p>
        </Reveal>
      </section>

      {/* What We Offer — Section 2. Matches "Our Sessions" on the Schools
          page (white, border-y, ChessBg "page") since this is likewise the
          first substantive content section on its page. Three neutral cards
          rather than the coloured play-card treatment: these three areas
          aren't alternatives to pick between, they're facets of one offer. */}
      <section className="py-20 bg-white border-y border-[#2D2520]/8 relative overflow-hidden">
        <ChessBg variant="page" />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              The enrichment offer
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              What We Offer
            </h2>
          </div>

          <Reveal className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed">
              Rook Foundations provides inclusive enrichment through a broad range of games, puzzles and activities — not a single fixed SEND programme. What we bring to a session is selected, adapted, combined or changed according to the pupils taking part, their interests and strengths, the purpose of the session, the environment, and how they respond once things get underway.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed mt-4">
              The school knows its pupils; Rook Foundations knows its activities. Bringing the two together, and deciding what's most appropriate, is something we take seriously as part of our professional practice.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offerAreas.map((area, i) => (
              <motion.div
                key={area.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white border border-[#2D2520]/10 rounded-3xl p-7 flex flex-col"
              >
                <div className="w-8 h-[3px] rounded-full mb-4" style={{ backgroundColor: area.accent }} aria-hidden="true" />
                <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 leading-snug">{area.title}</h3>
                <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">{area.body}</p>
              </motion.div>
            ))}
          </div>

          <Reveal className="max-w-2xl mx-auto text-center mt-12">
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed">
              Across all of this, our practitioners aren't working from a fixed list of prescribed SEND activities — they can select, adapt, combine or change what's happening in response to the session as it unfolds, always within our usual safeguarding, safety and professional boundaries. And just as the activities themselves can flex, so can the way a pupil takes part in them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* A Flexible Approach to Participation — Section 3. Cream/inherited
          background (no explicit bg-white here) since "What We Offer" above
          already carries its own border-y to provide the divider. The seven
          "ways of participating" are a pill cluster rather than seven small
          cards, deliberately, per the brief's steer against turning this
          into either a checklist or "a large collection of cards for the
          sake of visual variety" — only the Puzzle & Exploration Kit gets
          its own distinct (gold-tinted, not a new colour) callout, since the
          brief calls that out specifically as needing to read as a
          legitimate, integrated part of the offer rather than a footnote. */}
      <section className="py-20 relative overflow-hidden">
        <ChessBg variant="contact" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              How pupils take part
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              A Flexible Approach to Participation
            </h2>
          </div>

          <Reveal className="text-center">
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed">
              We don't expect every pupil to engage with an activity in exactly the same way. For one pupil, meaningful participation might mean actively playing a strategy game. For another, it might mean observing first, exploring the equipment, or working through a puzzle independently — and a pupil might move between several of these during the same session. All of these can represent genuine, meaningful engagement, depending on the pupil and the moment.
            </p>
          </Reveal>

          {/* Ways of participating */}
          <Reveal className="mt-10 text-center" delay={0.05}>
            <p className="font-nunito text-[#2D2520]/45 text-xs font-800 uppercase tracking-widest mb-4">
              This can look like
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {waysToParticipate.map((way) => (
                <span
                  key={way}
                  className="font-nunito text-[#2D2520] text-sm font-700 bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-full px-4 py-2 whitespace-nowrap"
                >
                  {way}
                </span>
              ))}
            </div>
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed max-w-xl mx-auto mt-6">
              Depending on how a pupil engages, this flexibility can create opportunities to explore things like independence, communication, concentration, problem-solving, decision-making and confidence — opportunities the activity may offer, not outcomes we guarantee.
            </p>
          </Reveal>

          {/* Puzzle & Exploration Kit */}
          <Reveal className="mt-12 bg-[#E8A020]/5 border border-[#E8A020]/15 rounded-3xl p-7 sm:p-8" delay={0.1}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 leading-snug">The Puzzle &amp; Exploration Kit</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              Alongside the main activity, sessions include a Puzzle &amp; Exploration Kit — puzzles, tactile resources and other suitable activities that give pupils an alternative way into the session. It isn't a consolation prize for pupils who don't take part in the main activity; it's a legitimate part of the enrichment offer in its own right, because different pupils genuinely find different things engaging. Not every pupil will need it, but it's there as a meaningful option whenever it's the right fit.
            </p>
          </Reveal>

          {/* Responsive participation */}
          <Reveal className="mt-12" delay={0.15}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 text-center leading-snug">Responsive participation</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              Participation isn't fixed once a session begins. A pupil might start by observing and join in later, move between a game and a puzzle, take a reduced role within a group, or step away and return when they're ready. Our practitioners use their professional judgement throughout — adjusting the pace, changing a pupil's role, introducing an alternative, or moving on from the original plan altogether — always in response to what actually supports meaningful participation in the moment.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-4">
              Adapting an activity doesn't automatically mean making it easier. Depending on the pupil, that might mean less complexity or more, a different pace, a different way of explaining things, or a change of role, equipment or grouping. We don't assume every pupil needs a simplified version of an activity — the right adaptation depends entirely on the individual in front of us.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-4">
              Where appropriate, pupils can have a genuine say in how they take part — continuing with an activity, trying something else, taking a short pause, or returning to it later. This isn't unlimited choice or optional structure; our practitioners remain responsible for managing each session appropriately and safely. And if a pupil becomes uncomfortable or disengaged, that's never treated as a failure — it's simply something to respond to, whether that means pausing, adjusting, offering an alternative, or involving school staff where needed.
            </p>
          </Reveal>

          <Reveal className="text-center mt-10" delay={0.2}>
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed max-w-xl mx-auto">
              That same flexibility extends to the structure of a session too — including the size of the group a pupil takes part in.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Small Groups & Individual Sessions — Section 4. White/border-y like
          "Our Sessions"/"What We Offer", restoring the alternating rhythm
          after the previous section's inherited-cream background. The "Up
          to 6 Pupils" stat reuses PeopleIcon + the exact icon-badge
          treatment already used for group size on the Schools page's
          session cards, rather than inventing a new visual device — the
          one deliberate bit of visual emphasis the brief specifically asks
          for, everything else here stays plain prose with no extra cards. */}
      <section className="py-20 bg-white border-y border-[#2D2520]/8 relative overflow-hidden">
        <ChessBg variant="page" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              How sessions are structured
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Small Groups &amp; Individual Sessions
            </h2>
          </div>

          <Reveal className="text-center">
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed">
              Rook Foundations normally delivers SEND enrichment in small groups, with a normal maximum of up to six pupils. This isn't a target group size — smaller groups, and individual sessions, may often be more appropriate depending on the pupils and circumstances. There's no fixed minimum group size.
            </p>
          </Reveal>

          {/* Up to 6 Pupils — the one deliberate visual moment in this
              section, per the brief's request for "a clear visual
              indication of the normal maximum group size". */}
          <Reveal className="flex flex-col items-center mt-10" delay={0.05}>
            <div className="w-16 h-16 rounded-2xl bg-[#E8A020]/10 flex items-center justify-center mb-4">
              <PeopleIcon count={6} size={34} style={{ color: '#E8A020' }} />
            </div>
            <p className="font-fredoka text-[#2D2520] text-2xl">Up to 6 pupils</p>
            <p className="font-nunito text-[#2D2520]/55 text-sm mt-1.5">Our normal maximum for SEND enrichment sessions</p>
          </Reveal>

          <Reveal className="mt-14" delay={0.1}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 leading-snug">Smaller groups</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              A smaller group can allow the practitioner to give more individual attention and respond more closely to how each pupil is participating. This can be particularly useful where pupils benefit from a quieter or more focused setting, need more personalised pacing, or have quite different interests or levels of independence from one another. Suitability always depends on the individual pupils, the activity and the circumstances — a smaller group isn't automatically the right fit for every pupil.
            </p>
          </Reveal>

          <Reveal className="mt-10" delay={0.15}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 leading-snug">1-to-1 sessions</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              Individual, 1-to-1 sessions are available where appropriate, giving the practitioner the opportunity to focus entirely on one pupil and respond closely to their interests, engagement and participation — with more flexibility in pace, activity choice, level of challenge, and the amount of repetition or explanation involved. This remains enrichment, not therapy or specialist teaching, and it isn't something every pupil needs or would necessarily benefit from; it's simply one of the arrangements available where it's the right fit.
            </p>
          </Reveal>

          <Reveal className="mt-10" delay={0.2}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 leading-snug">Finding the right format</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              The right group size is a practical decision, not something determined by a pupil's diagnosis, age or SEND category alone. Two pupils with similar needs may respond very differently to the same group, and a pupil who needs significant support in one setting may participate quite independently in another. We consider things like the nature of the activity, how pupils are likely to interact and participate together, and what's likely to work well — from an individual pupil, to a very small group, up to our normal maximum of six.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-4">
              School staff remain responsible for pupils' wider support; our practitioners lead the content and delivery of the enrichment session itself, and we'll discuss any additional support needs with the school as part of planning.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-4">
              Pricing reflects the booked group size and session length, with smaller groups and 1-to-1 sessions carrying a higher cost per pupil, since they involve more capacity and personalisation on our part — the arrangement is based on the confirmed booked group, rather than simply who attends on the day. Exact pricing is something we're happy to talk through as part of an enquiry.
            </p>
          </Reveal>

          <Reveal className="text-center mt-10" delay={0.25}>
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed max-w-xl mx-auto">
              Once the right group or individual arrangement has been found, the next question is what happens within it — and that's something we consider just as carefully, based on the pupils and circumstances.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How Activities Are Chosen — Section 5. Cream/inherited background,
          continuing the alternating rhythm after Small Groups' white/
          border-y. Reuses two already-established patterns rather than
          inventing new ones: the pill cluster from "ways of participating"
          (Section 3) for the school's illustrative examples, and the
          left-accent-row list from Flexible Delivery (Schools page) for the
          before/at-the-start/during timing breakdown — deliberately NOT a
          numbered "workflow" diagram, per the brief's caution against
          making this look like a rigid automated process. */}
      <section className="py-20 relative overflow-hidden">
        <ChessBg variant="testimonials" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              Planning the session
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              How Activities Are Chosen
            </h2>
          </div>

          <Reveal className="text-center">
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed">
              You don't need to choose the game. Tell us what you'd like the session to provide and give us the relevant information about the pupils taking part, and we'll use our knowledge of the activities, resources and professional judgement to work out what's likely to be most appropriate.
            </p>
          </Reveal>

          {/* Tell us what you'd like the session to provide */}
          <Reveal className="mt-14" delay={0.05}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 text-center leading-snug">Tell us what you'd like the session to provide</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed text-center max-w-xl mx-auto mb-6">
              During an initial conversation, we'll usually ask what you'd like the session to provide for your pupils — things like:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {sessionProvideExamples.map((example) => (
                <span
                  key={example}
                  className="font-nunito text-[#2D2520] text-sm font-700 bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-full px-4 py-2 whitespace-nowrap"
                >
                  {example}
                </span>
              ))}
            </div>
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed text-center max-w-xl mx-auto mt-6">
              These are examples only — you don't need to specify a particular game or activity; that's something we'll work out together. We'll also ask for relevant information about the pupils themselves — the kind that helps us understand how they're likely to participate and what might support their engagement, rather than a detailed personal history.
            </p>
          </Reveal>

          {/* We select the activities */}
          <Reveal className="mt-14" delay={0.1}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 leading-snug">We select the activities</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              Once we understand what you're looking for, deciding which activity or combination of activities is likely to work well is something we take responsibility for. That decision draws on pupils' interests, strengths and likely independence, group dynamics, anticipated support needs, complexity, pace, accessibility and the environment, alongside anything relevant you've told us. It's professional planning, not a formal assessment — we're not diagnosing or evaluating a pupil, simply using the information available to plan a session that's likely to work well.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-4">
              There's no single activity that suits every pupil with a particular need or profile, so we don't work from a fixed formula matching a diagnosis to an activity. The same game might be a great fit for one pupil and the wrong choice for another — and the right choice for the same pupil can change from one session to the next.
            </p>
          </Reveal>

          {/* Plan, adapt and respond */}
          <Reveal className="mt-14" delay={0.15}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-4 leading-snug">Plan, adapt and respond</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mb-6">
              Planning happens throughout, not just once, before a session begins:
            </p>
            <div className="space-y-1">
              {planningMoments.map((moment) => (
                <div
                  key={moment.title}
                  className="pl-4 pr-2 py-3 border-l-[3px] rounded-r-lg"
                  style={{ borderColor: moment.accent }}
                >
                  <p className="font-fredoka text-[#2D2520] text-base leading-tight">{moment.title}</p>
                  <p className="font-nunito text-[#2D2520]/55 text-sm leading-snug mt-1.5">{moment.body}</p>
                </div>
              ))}
            </div>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-6">
              A planned activity is a starting point, not a fixed commitment. If it isn't working the way we hoped, we can adapt it, change how it's presented, introduce something else, or move to a different activity altogether — the same flexibility described in how pupils can take part. The activity is there to provide the enrichment; it's never the point in itself, so if a different approach would give a pupil a more meaningful experience, that's what we'll do.
            </p>
          </Reveal>

          <Reveal className="text-center mt-12" delay={0.2}>
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed max-w-xl mx-auto">
              Once we understand the pupils, the circumstances and what you're hoping the session will provide, the next step is working with you to plan it — from that first conversation through to delivery.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Honest work-in-progress notice — matches PreLaunchNotice's dark
          band treatment used elsewhere on the site for the same purpose.
          Scaled back now that real content exists above it: this simply
          flags that further sections are still being added, rather than
          framing the whole page as unfinished. */}
      <section className="relative overflow-hidden bg-[#2D2520] py-20">
        <ChessBg variant="faq" />
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(232,160,32,0.5), transparent)' }}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 max-w-xl mx-auto px-6 lg:px-12 text-center"
        >
          <span className="block font-nunito text-[#E8A020] text-xs font-800 uppercase tracking-[0.2em] mb-5">
            More sections coming soon
          </span>
          <h2 className="font-fredoka text-white leading-tight mb-5" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>
            We're continuing to build this page
          </h2>
          <p className="font-nunito text-white/65 text-base leading-relaxed mb-8">
            This is the first part of a fuller look at how Rook Foundations works with SEND pupils — more will be added here as it's ready. If you'd like to talk through SEND provision for your school now, I'd be very happy to hear from you.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            className="group inline-flex items-center gap-2 bg-[#E8A020] text-white font-fredoka font-600 text-sm px-6 py-3.5 rounded-2xl hover:bg-[#d4940e] transition-all hover:shadow-lg hover:shadow-[#E8A020]/20"
          >
            Get in Touch
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </MotionLink>
        </motion.div>
      </section>
    </div>
  );
}
