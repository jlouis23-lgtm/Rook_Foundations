import { Fragment, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
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

// The six-stage school journey. Same six-colour rotation already used for a
// six-item sequence elsewhere on the site (SessionIncludesGrid), reused here
// rather than introducing a new palette. Rendered as a single vertical
// numbered list at every breakpoint — no horizontal/desktop variant, no
// connecting arrows or staircase — deliberately simpler than
// WhatHappensNextSection's treatment on the Booking page, per this brief's
// specific steer against "excessive icons or decorative elements" and
// against making the process look automated.
const schoolJourney = [
  {
    accent: '#2d8c62',
    title: 'Start a conversation',
    body: "Get in touch to talk through your pupils, what you'd like the session to provide, and whether the provision looks like a good fit — an open conversation, including over WhatsApp where that's easier for you.",
  },
  {
    accent: '#4a7eb8',
    title: 'Share relevant information',
    body: "Where it's useful, we'll ask for relevant information about the proposed group or pupils — the kind that helps with planning, accessibility and safe participation, sometimes using a short SEND Group Information Form. This isn't a formal assessment; we only ask for what's reasonably relevant to planning the session.",
  },
  {
    accent: '#7a48c0',
    title: 'Plan the provision',
    body: "We consider what you've told us alongside the group size, purpose and environment to work out an appropriate approach, drawing on our knowledge of the activities available. You don't need to prescribe the activity — we may share our intended plan in advance, but it stays provisional.",
  },
  {
    accent: '#c05050',
    title: 'Confirm the booking',
    body: 'A session becomes a formal booking once we issue a booking confirmation and you accept it, summarising the date, time, duration, group size, fee and other agreed arrangements — including that the intended activity remains adaptable.',
  },
  {
    accent: '#2a8c88',
    title: 'Deliver the session',
    body: 'Our practitioner leads the session, adapting pace, complexity, instructions or activity choice as needed to support meaningful participation, without needing to check in with the school every time a reasonable adjustment is made.',
  },
  {
    accent: '#c9860f',
    title: 'Review and continue',
    body: "Afterwards, we're happy to hear how it went and talk through whether further sessions would be useful — where appropriate, this can include commissioning a Personalised Enrichment Review.",
  },
];

// What schools provide, in five areas. Left-accent-row treatment again
// (third reuse on this page, after planningMoments and — in spirit —
// schoolJourney) rather than five cards, so this reads as a related set of
// practical points rather than a compliance checklist.
const schoolProvides = [
  {
    accent: '#4a7eb8',
    title: 'Relevant pupil information',
    body: "Things like the number of pupils, the general nature of their needs where relevant, how they're likely to participate, relevant strengths or interests, and any known triggers or safety considerations — enough for us to plan appropriately, not a full personal history. Where several pupils are attending together, we're often able to work from group-level information rather than a detailed profile for every pupil.",
  },
  {
    accent: '#2d8c62',
    title: 'Suitable space',
    body: "A space appropriate to the activity, with suitable seating and surfaces, enough room, and access to the agreed room at the agreed time. We can adjust layout, positioning and equipment to suit what's available, and we'll discuss anything unusual with you beforehand.",
  },
  {
    accent: '#7a48c0',
    title: 'Appropriate school support',
    body: "We lead the content and delivery of the session, but school staff remain responsible for support that sits outside our role — things like personal care, medical needs, emergency situations or behaviour support beyond what we're able to provide. This isn't about staff needing to intervene constantly; it's about the right support being available if it's needed.",
  },
  {
    accent: '#2a8c88',
    title: 'A named contact',
    body: "A named member of school staff who can be reached if something comes up during the session. A suitable substitute can act as the contact where needed — they don't need to stand beside the practitioner throughout unless the circumstances call for it.",
  },
  {
    accent: '#c9860f',
    title: 'Keeping us informed',
    body: "If something changes materially before a session — who's attending, support arrangements, relevant health or safety circumstances, or information you'd previously given us — letting us know allows us to check the arrangement is still right. This isn't about flagging every small change, just anything that could genuinely affect the session.",
  },
];

// What a Personalised Enrichment Review provides — same loose pill-cluster
// treatment used for waysToParticipate and sessionProvideExamples.
const reviewProvides = [
  'Engagement and participation',
  'Observed strengths',
  'Relevant activities',
  'Useful adaptations',
  'Patterns across sessions',
  'Future enrichment considerations',
];

// The ten-area skills framework, names only — the brief explicitly permits
// skipping the full descriptions where that would make the page "unnecessarily
// dense", and with ten items here that applies. A plain numbered reference
// list rather than a card grid or pill cluster: this is closer to an index
// than a set of interchangeable options, so light numbering (01–10) suits it
// better than either of those other two already-used patterns.
const skillsFramework = [
  'Strategic Thinking',
  'Problem-Solving',
  'Planning',
  'Decision-Making',
  'Attention & Concentration',
  'Memory & Recall',
  'Creativity & Imagination',
  'Communication & Social Interaction',
  'Emotional Regulation & Resilience',
  'Independence',
];

// How a review comes together — short labels connected by chevrons, reusing
// the exact outcome-chain pattern already established (PersonalisedApproach's
// Engagement → Thinking → Reflection → Development), since this is the same
// shape of content: a short, genuinely sequential chain, not a multi-sentence
// journey like the schoolJourney list above.
const reviewSteps = ['Commission', '4+ sessions', 'Observations gathered', 'Review prepared', 'Sent to your school'];

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

      {/* Working With Your School — Section 6. White/border-y, restoring the
          alternating rhythm after "How Activities Are Chosen"'s inherited
          cream. The six-stage journey is a single vertical numbered list at
          every width (no desktop horizontal row, no arrows/staircase) —
          deliberately plainer than WhatHappensNextSection on the Booking
          page, matching this brief's specific caution against decorative
          elements and against the process reading as automated. */}
      <section className="py-20 bg-white border-y border-[#2D2520]/8 relative overflow-hidden">
        <ChessBg variant="booking" />
        <div className="max-w-2xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              Getting started
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Working With Your School
            </h2>
          </div>

          <Reveal className="text-center mb-14">
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed">
              Starting SEND enrichment with Rook Foundations is a straightforward collaboration. You bring your knowledge of the pupils, the school environment and what you'd like the experience to provide; we bring our knowledge of the games, puzzles and activities available, and how to plan and adapt them appropriately. Here's how that comes together:
            </p>
          </Reveal>

          <div className="space-y-8">
            {schoolJourney.map((stage, i) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                className="flex items-start gap-4"
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center font-fredoka text-white text-sm flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: stage.accent }}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-fredoka text-[#2D2520] text-lg leading-snug">{stage.title}</p>
                  <p className="font-nunito text-[#2D2520]/60 text-sm leading-relaxed mt-1">{stage.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Reveal className="mt-14" delay={0.1}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-4 leading-snug">A few practical points</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              If something changes significantly before the session — such as the group's size, composition or support needs — we may need to check the arrangement is still suitable, and agree any change in price, before proceeding. The detailed rules around this sit in our pricing and booking terms.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-4">
              The booking confirmation is also where a school confirms it has the authority to share the relevant pupil information with us, and — where a Personalised Enrichment Review is commissioned — the authority to commission that, along with who should receive it. This is about making sure information and commissioning arrangements are handled properly, not a lengthy privacy process.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-4">
              Where possible, we'd recommend getting in touch at least a week ahead of when you'd like a session to take place, though we can sometimes accommodate shorter notice. Successful delivery depends on the school providing relevant information, a suitable space and any agreed support arrangements; we take responsibility for planning and delivering the enrichment content itself.
            </p>
          </Reveal>

          <Reveal className="text-center mt-10" delay={0.15}>
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed max-w-xl mx-auto">
              That's the collaboration in outline — what we need from your school to make it work well is covered next.
            </p>
          </Reveal>
        </div>
      </section>

      {/* What We Need From Schools — Section 7. Cream/inherited background,
          continuing the alternating rhythm after "Working With Your
          School"'s white/border-y. Five areas as left-accent rows (third
          reuse of that pattern on this page) rather than five cards, plus
          one distinct gold-tinted callout for the boundaries — reusing the
          exact device from the Puzzle & Exploration Kit callout in Section
          3 — so the whole section stays well short of reading like a
          compliance checklist or legal agreement, per the brief's specific
          caution against that. */}
      <section className="py-20 relative overflow-hidden">
        <ChessBg variant="whychess" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              Supporting a great session
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              What We Need From Schools
            </h2>
          </div>

          <Reveal className="text-center mb-12">
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed">
              We know our activities; you know your pupils and your school. For us to plan and deliver an appropriate session, we need relevant, current information from you — enough to plan and deliver safely, not a comprehensive medical or educational history. Here's what that looks like in practice.
            </p>
          </Reveal>

          <div className="space-y-1">
            {schoolProvides.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.06, ease: EASE }}
                className="pl-4 pr-2 py-4 border-l-[3px] rounded-r-lg transition-colors duration-200 hover:bg-[#2D2520]/[0.025]"
                style={{ borderColor: item.accent }}
              >
                <p className="font-fredoka text-[#2D2520] text-base leading-tight">{item.title}</p>
                <p className="font-nunito text-[#2D2520]/55 text-sm leading-snug mt-1.5">{item.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Our boundaries */}
          <Reveal className="mt-10 bg-[#E8A020]/5 border border-[#E8A020]/15 rounded-3xl p-7 sm:p-8" delay={0.1}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 leading-snug">Our boundaries</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              Rook Foundations doesn't provide personal care, toileting or feeding assistance, medication administration, or physical restraint — these remain the responsibility of the school. Where an activity calls for reasonable, low-risk physical assistance directly related to it, a practitioner may provide that within their competence; anything beyond this stays with the school, and if an activity would need support we can't safely provide, we'll adapt it, replace it, or take a different approach instead.
            </p>
          </Reveal>

          <Reveal className="mt-12" delay={0.15}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-4 leading-snug">A few more things worth knowing</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              We work within our own safeguarding responsibilities, and your school's safeguarding and emergency procedures remain important throughout delivery — if an immediate concern arises, the usual school procedure should be followed.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-4">
              If things on the day differ materially from what was agreed — particularly where agreed support isn't available — we may need to adapt the activity, adjust the group, or in some cases decide the session can't safely go ahead as planned. We'll always use our professional judgement to find a safe, appropriate way forward wherever we can.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-4">
              As part of the booking confirmation, you'll also confirm you have the authority to share this information with us. Where a Personalised Enrichment Review has been commissioned, relevant information and observations may inform that review too.
            </p>
          </Reveal>

          <Reveal className="text-center mt-10" delay={0.2}>
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed max-w-xl mx-auto">
              That review — what it involves and how it's used — is something we'll cover next.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Personalised Enrichment Review — Section 8. White/border-y like
          Sections 2/4/6. This is the densest brief so far, so several
          established devices are reused deliberately rather than inventing
          new ones for each piece: the "Up to 6 pupils" stat-badge treatment
          from Section 4 (swapped to a plain numeral) for "Minimum 4
          sessions", the pill cluster from Sections 3/5 for what the review
          provides, the outcome-chain pill+chevron pattern for the short
          "how it works" sequence, and a small muted note (not the gold-
          tinted "legitimate offer" callout used elsewhere) for the
          boundary disclaimer — per the brief's explicit instruction that
          this should be understated and not the section's dominant
          feature. The ten-item skills framework is names only, no
          descriptions, per the brief's own permission to avoid density. */}
      <section className="py-20 bg-white border-y border-[#2D2520]/8 relative overflow-hidden">
        <ChessBg variant="training" />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-4">
              An optional add-on
            </span>
            <h2 className="font-fredoka text-[#2D2520]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Personalised Enrichment Review
            </h2>
          </div>

          <Reveal className="text-center">
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed">
              A Personalised Enrichment Review summarises what we've observed through a pupil's Rook Foundations enrichment sessions — a personalised overview of their engagement, participation and observed strengths, including the activities and skills that stood out most during the review period.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed mt-4">
              Activities throughout are selected with the individual pupil and group in mind, focused on creating enjoyable, accessible and engaging opportunities to participate, explore and build on a range of skills through games and activities. The review reflects that same approach — it's an observation-based enrichment summary, not a formal assessment.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-base leading-relaxed mt-4">
              It's an optional add-on, not something every pupil automatically receives. It can be commissioned when you first arrange a block of sessions, or partway through one, and we'll always agree this with you explicitly beforehand.
            </p>
          </Reveal>

          {/* Minimum 4 sessions */}
          <Reveal className="flex flex-col items-center mt-10" delay={0.05}>
            <div className="w-16 h-16 rounded-2xl bg-[#E8A020]/10 flex items-center justify-center mb-4">
              <span className="font-fredoka text-[#E8A020] text-2xl">4</span>
            </div>
            <p className="font-fredoka text-[#2D2520] text-2xl">Minimum 4 sessions</p>
            <p className="font-nunito text-[#2D2520]/55 text-sm mt-1.5 max-w-sm text-center leading-relaxed">
              Enough opportunity to observe a pupil across more than a single encounter — not a guarantee that a particular conclusion will follow.
            </p>
          </Reveal>

          {/* What it provides */}
          <Reveal className="mt-14 text-center" delay={0.1}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-6 leading-snug">What it provides</h3>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {reviewProvides.map((item) => (
                <span
                  key={item}
                  className="font-nunito text-[#2D2520] text-sm font-700 bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-full px-4 py-2 whitespace-nowrap"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>

          {/* Skills framework */}
          <Reveal className="mt-14" delay={0.15}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 text-center leading-snug">A broad skills framework</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed text-center max-w-xl mx-auto">
              To help organise what we observe, we use a broad skills framework — descriptive areas we look at, not a formal assessment framework:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-lg mx-auto mt-6">
              {skillsFramework.map((skill, i) => (
                <div key={skill} className="flex items-baseline gap-3">
                  <span className="font-nunito text-[#E8A020]/60 text-xs font-800 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-fredoka text-[#2D2520] text-base leading-snug">{skill}</span>
                </div>
              ))}
            </div>
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed text-center max-w-xl mx-auto mt-6">
              These help structure our observations — they're descriptive, not scored, graded or diagnostic. For each relevant activity, the review can describe the kind of skill or engagement it offered an opportunity for, alongside what we actually observed during it — connecting what we did with what we saw, rather than assuming any activity automatically produces a particular skill.
            </p>
          </Reveal>

          {/* What's in the final review */}
          <Reveal className="mt-12" delay={0.2}>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              Where commissioned, the finished review typically covers why it was commissioned, the approach and period involved, the activities and skills that were relevant, what we observed about engagement and participation, strengths, any adaptations that supported participation, and any meaningful patterns or changes across the sessions — closing with a concise overall summary and some practical considerations for future Rook Foundations enrichment.
            </p>
          </Reveal>

          {/* How the review is written */}
          <Reveal className="mt-10" delay={0.25}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-3 leading-snug">How the review is written</h3>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
              The review is based primarily on what we directly observe through our own sessions, alongside our practitioner's records. Relevant information the school has already shared with us may inform the context where it's genuinely relevant, but we don't reinterpret or expand on it — the review stays a factual, evidence-based Rook Foundations observational document, without scores, grades or diagnostic categories.
            </p>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-4">
              It's genuinely personalised to the pupil rather than a generic description of the activities on offer, written in plain, accessible language suitable for sharing with parents and carers through your school's usual process, and sent to the authorised recipient(s) agreed when the review is commissioned.
            </p>
          </Reveal>

          {/* How it works */}
          <Reveal className="mt-14 text-center" delay={0.3}>
            <h3 className="font-fredoka text-[#2D2520] text-xl mb-6 leading-snug">How it works</h3>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
              {reviewSteps.map((step, i) => (
                <Fragment key={step}>
                  <span className="font-nunito text-[#2D2520] text-sm font-700 bg-[#E8A020]/10 border border-[#E8A020]/20 rounded-full px-4 py-2 whitespace-nowrap">
                    {step}
                  </span>
                  {i < reviewSteps.length - 1 && <ChevronRight size={16} className="text-[#E8A020]/50 flex-shrink-0" aria-hidden="true" />}
                </Fragment>
              ))}
            </div>
            <p className="font-nunito text-[#2D2520]/55 text-sm leading-relaxed max-w-xl mx-auto mt-6">
              We aim to have the finished review with you within 10 working days of the final observation, letting you know if more time is ever needed.
            </p>
          </Reveal>

          {/* Important distinction — small and understated by design, not
              the section's dominant feature. */}
          <div className="max-w-md mx-auto mt-10 pt-6 border-t border-[#2D2520]/8 text-center">
            <p className="font-nunito text-[#2D2520]/50 text-xs leading-relaxed italic">
              An enrichment-based observational review — not a diagnostic, therapeutic or formal educational assessment.
            </p>
          </div>

          <Reveal className="text-center mt-8" delay={0.1}>
            <MotionLink
              whileTap={ctaTap}
              to="/contact"
              onClick={() => window.scrollTo(0, 0)}
              className="group inline-flex items-center gap-1.5 font-nunito text-[#E8A020] text-sm font-700 hover:text-[#b8790a] transition-colors"
            >
              Ask about a Personalised Enrichment Review
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </MotionLink>
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
