import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ShieldCheck, Building2, ClipboardList, Users,
  CalendarClock, HeartHandshake, Stethoscope,
} from 'lucide-react';
import ChessBg from '@/components/ui/ChessBg';
import Reveal from '@/components/ui/Reveal';
import { MotionLink, ctaTap } from '@/components/ui/MotionLink';

const meta = [
  { Icon: Building2, label: 'Provider', value: 'Rook Foundations' },
  { Icon: ClipboardList, label: 'Assessment applies to', value: 'Educational workshops delivered in primary schools using strategy games such as chess and similar tabletop learning activities.' },
  { Icon: Users, label: 'Persons at risk', value: 'Pupils, staff' },
  { Icon: ShieldCheck, label: 'Risk Level', value: 'Low' },
  { Icon: CalendarClock, label: 'Review date', value: 'Annually, or sooner if activities, venues or guidance change.' },
];

const hazards = [
  { hazard: 'Trips, slips and falls', who: 'Pupils, staff', control: 'Activities take place in classrooms or other suitable school spaces. Walkways remain clear. Bags and equipment are stored safely. Children are reminded not to run.' },
  { hazard: 'Movement of furniture', who: 'Pupils, staff', control: 'Existing classroom layout is used where possible. Furniture is only moved with permission and care. Heavy items are not lifted by pupils.' },
  { hazard: 'Chess pieces and small game components', who: 'Younger pupils', control: 'Resources are age-appropriate and supervised. Equipment is counted before and after sessions. Children are reminded not play appropriately with the pieces. Damaged equipment is removed immediately.' },
  { hazard: 'Damaged or defective equipment', who: 'Everyone', control: 'Equipment is checked before every session. Broken, sharp or damaged items are removed from use immediately.' },
  { hazard: 'Allergies or hygiene concerns', who: 'Pupils', control: 'Equipment is cleaned regularly. Schools are informed of any materials used. No food is provided unless agreed with the school.' },
  { hazard: 'Behaviour during games', who: 'Pupils', control: 'Clear expectations are explained at the beginning of each session. Respect, fairness and inclusion are promoted throughout. Behaviour concerns are referred to the class teacher.' },
  { hazard: 'Emotional wellbeing', who: 'Pupils', control: 'Activities are adapted to suit individual ability. Winning and losing are discussed positively. Effort, learning and teamwork are valued above competition. Children may pause or withdraw if needed.' },
  { hazard: 'SEND or additional needs', who: 'Individual pupils', control: 'Activities are adapted where appropriate in consultation with school staff. Additional support is welcomed where required.' },
  { hazard: 'Medical emergencies', who: 'Pupils', control: 'The school retains responsibility for pupil medical information and medication. The facilitator follows school procedures and immediately alerts school staff to any concerns.' },
  { hazard: 'Fire or emergency evacuation', who: 'Everyone', control: "The facilitator follows the school's evacuation procedures and instructions from school staff. Registers remain the responsibility of the school." },
  { hazard: 'Safeguarding concerns', who: 'Pupils', control: "The facilitator follows statutory safeguarding guidance and the school's safeguarding procedures. Any concerns are reported immediately to the Designated Safeguarding Lead (DSL)." },
  { hazard: 'Lone working', who: 'Staff', control: 'Sessions are delivered within the school environment and visitor procedures are followed' },
  { hazard: 'Unauthorised collection of children', who: 'Pupils', control: 'Responsibility for pupil supervision and collection remains with the school unless otherwise agreed in writing.' },
  { hazard: 'Photography or recording', who: 'Pupils', control: "Photographs are only taken with the school's permission and in accordance with school consent procedures. Personal devices are not used unless specifically authorised." },
  { hazard: 'Data protection', who: 'Families', control: 'Personal information is collected only where necessary and handled in accordance with UK GDPR and applicable data protection legislation.' },
  { hazard: 'Infection control', who: 'Everyone', control: 'Good hand hygiene is encouraged. Equipment is cleaned regularly. Sessions may be postponed if there is a significant infectious disease risk.' },
  { hazard: 'Weather (where outdoor activities are included)', who: 'Everyone', control: 'Outdoor sessions only proceed where conditions are safe. The school has the final decision regarding outdoor activities.' },
];

function Section({ id, title, children, first = false }) {
  return (
    <section id={id} className={`scroll-mt-28 py-10 ${first ? '' : 'border-t border-[#2D2520]/10'}`}>
      <h2 className="font-fredoka text-[#2D2520] text-2xl sm:text-3xl mb-5">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 font-nunito text-[#2D2520]/75 text-base leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8A020] flex-shrink-0 mt-2.5" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function RiskAssessment() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#FAFAF7] pt-32 pb-24">
      {/* Header */}
      <section className="relative overflow-hidden py-16">
        <ChessBg variant="risk" />

        <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">
          <Link
            to="/about"
            onClick={() => window.scrollTo(0, 0)}
            className="print:hidden inline-flex items-center gap-2 font-nunito text-[#2D2520]/45 text-sm font-600 hover:text-[#E8A020] transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to about
          </Link>

          <span className="inline-flex items-center gap-1.5 font-nunito text-[#b8790a] text-sm font-800 uppercase tracking-widest mb-5">
            <ShieldCheck size={14} /> Safety documentation
          </span>

          <h1 className="font-fredoka text-[#2D2520] mb-3" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)' }}>
            General Risk Assessment
          </h1>
          <p className="font-nunito text-[#2D2520]/60 text-lg leading-relaxed max-w-2xl mb-4">
            Educational Workshops and Games-Based Learning
          </p>
          <p className="font-nunito text-[#2D2520]/40 text-sm">
            Prepared by Louis Jenkins · Co-Founder, Rook Foundations
          </p>
        </div>
      </section>

      {/* At a glance */}
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-10 border-t border-b border-[#2D2520]/10">
        <Reveal className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
          {meta.map(({ Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={18} className="text-[#E8A020] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-nunito text-[#2D2520]/45 text-xs font-700 uppercase tracking-wide mb-1">{label}</p>
                <p className="font-nunito text-[#2D2520] text-sm leading-relaxed">{value}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Document body */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <Section id="commitment" title="Our Commitment" first>
          <div className="space-y-4">
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              The safety and wellbeing of every child is our highest priority. All workshops are designed to provide a safe, enjoyable and inclusive learning environment where children can develop confidence, critical thinking, communication and problem-solving skills.
            </p>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              We work in partnership with each school and follow the school's safeguarding, health and safety, emergency and behaviour management procedures.
            </p>
          </div>
        </Section>

        <Section id="risk-table" title="Risk Assessment">
          <Reveal className="overflow-x-auto print:overflow-visible -mx-6 px-6 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[640px] print:min-w-0 border-collapse text-left">
              <caption className="sr-only">
                Risk assessment table listing each hazard, who may be affected, the control measures in place, and the resulting risk level.
              </caption>
              <thead>
                <tr className="bg-[#E8A020]/10">
                  <th scope="col" className="font-fredoka text-[#2D2520] text-sm font-600 px-4 py-3 border border-[#2D2520]/10">Hazard</th>
                  <th scope="col" className="font-fredoka text-[#2D2520] text-sm font-600 px-4 py-3 border border-[#2D2520]/10">Who may be affected</th>
                  <th scope="col" className="font-fredoka text-[#2D2520] text-sm font-600 px-4 py-3 border border-[#2D2520]/10">Control Measures</th>
                  <th scope="col" className="font-fredoka text-[#2D2520] text-sm font-600 px-4 py-3 border border-[#2D2520]/10">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {hazards.map((row, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-[#F5F3EE]/60' : ''}>
                    <td className="font-nunito text-[#2D2520] text-sm font-700 align-top px-4 py-3 border border-[#2D2520]/10">{row.hazard}</td>
                    <td className="font-nunito text-[#2D2520]/70 text-sm align-top px-4 py-3 border border-[#2D2520]/10">{row.who}</td>
                    <td className="font-nunito text-[#2D2520]/70 text-sm leading-relaxed align-top px-4 py-3 border border-[#2D2520]/10">{row.control}</td>
                    <td className="align-top px-4 py-3 border border-[#2D2520]/10">
                      <span className="inline-flex items-center font-nunito text-xs font-700 uppercase tracking-wide text-green-700 bg-green-100 rounded-full px-3 py-1">Low</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </Section>

        <Section id="safeguarding" title="Safeguarding">
          <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-2">Safeguarding is central to every workshop.</p>
          <p className="font-nunito text-[#2D2520] text-base font-700 mb-4">The facilitator will:</p>
          <BulletList items={[
            'Hold an appropriate DBS check where required.',
            'Follow current safeguarding guidance.',
            "Always follow the school's safeguarding policy.",
            "Immediately report any safeguarding concern to the school's Designated Safeguarding Lead.",
            'Always maintain appropriate professional boundaries.',
            'Never arrange private contact with pupils outside authorised educational settings.',
          ]} />
        </Section>

        <Section id="health-safety" title="Health and Safety">
          <p className="font-nunito text-[#2D2520] text-base font-700 mb-4">Before every workshop, I will do the following:</p>
          <BulletList items={[
            'Inspect all teaching resources.',
            'Ensure the learning area is suitable.',
            'Remove damaged equipment from use.',
            'Discuss expectations with pupils.',
            'Adapt activities for the age and needs of the group.',
          ]} />
          <p className="font-nunito text-[#2D2520] text-base font-700 mt-7 mb-4">During activities, I will always:</p>
          <BulletList items={[
            'Maintain appropriate supervision.',
            'Promote respectful behaviour.',
            'Encourage inclusion and participation.',
            'Stop any activity that becomes unsafe.',
          ]} />
        </Section>

        <Section id="inclusion" title="Inclusion">
          <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-2">Our sessions are designed to be inclusive.</p>
          <p className="font-nunito text-[#2D2520] text-base font-700 mb-4">Where appropriate, I will also do the following:</p>
          <BulletList items={[
            'Adapt instructions.',
            'Modify activities.',
            'Allow additional thinking time.',
            'Reduce unnecessary competition.',
            'Encourage cooperative learning.',
            'Work alongside school staff to support individual pupils.',
          ]} />
        </Section>

        <Section id="first-aid" title="First Aid">
          <div className="space-y-4">
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              The school remains responsible for providing first aid to pupils while on the school premisis.
            </p>
            <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed">
              In the event of an accident or illness, the facilitator will immediately notify school staff and follow the school's established procedures.
            </p>
          </div>
        </Section>

        <Section id="responsibilities" title="Responsibilities">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-fredoka text-[#2D2520] text-lg mb-1 flex items-center gap-2">
                <HeartHandshake size={18} className="text-[#E8A020]" /> The Workshop Provider
              </h3>
              <p className="font-nunito text-[#2D2520] text-sm font-700 mb-3">Will:</p>
              <BulletList items={[
                'Deliver activities safely.',
                'Follow school policies.',
                'Maintain suitable insurance.',
                'Keep equipment in safe condition.',
                'Respect confidentiality.',
                'Promote safeguarding and inclusion.',
              ]} />
            </div>
            <div className="sm:border-l sm:border-[#2D2520]/10 sm:pl-8">
              <h3 className="font-fredoka text-[#2D2520] text-lg mb-1 flex items-center gap-2">
                <Building2 size={18} className="text-[#E8A020]" /> The School
              </h3>
              <p className="font-nunito text-[#2D2520] text-sm font-700 mb-3">Will:</p>
              <BulletList items={[
                'Provide suitable teaching space.',
                'Share any relevant health, behavioural or accessibility information where appropriate.',
                'Inform me of the necessary emergency procedures.',
              ]} />
            </div>
          </div>
        </Section>

        <Section id="review" title="Review">
          <p className="font-nunito text-[#2D2520]/75 text-base leading-relaxed mb-4">This risk assessment is reviewed annually and whenever:</p>
          <BulletList items={[
            'activities change,',
            'new equipment is introduced,',
            'legislation or guidance changes,',
            'an incident or near miss occurs,',
            'a school identifies additional site-specific risks.',
          ]} />
        </Section>
      </div>

      {/* Footer note */}
      <div className="max-w-3xl mx-auto px-6 lg:px-12 mt-4">
        <div className="border-t border-[#2D2520]/10 pt-8">
          <p className="font-nunito text-[#2D2520]/40 text-xs leading-relaxed">
            This document is prepared and maintained by Louis Jenkins, Co-Founder of Rook Foundations. Schools and parents are welcome to request an up-to-date copy at any time.
          </p>
        </div>
      </div>

      {/* CTA */}
      <section className="print:hidden mt-16 py-20 text-center bg-[#E8A020] relative overflow-hidden">
        <ChessBg variant="cta" color="#ffffff" />
        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <Stethoscope size={36} className="text-white mx-auto mb-4" />
          <h2 className="font-fredoka text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
            Questions about safety or supervision?
          </h2>
          <p className="font-nunito text-white/80 text-lg mb-8">
            We're always happy to talk through anything in this document with parents or schools.
          </p>
          <MotionLink
            whileTap={ctaTap}
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#E8A020] font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:bg-[#fdf6e8] transition-all hover:shadow-xl hover:-translate-y-0.5">
            Get in touch <ArrowRight size={20} />
          </MotionLink>
        </div>
      </section>
    </div>
  );
}
