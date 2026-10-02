import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lock, XCircle } from 'lucide-react';
import { DURATIONS, TRAVEL_ZONES, formatPrice, privateFormatFor, zoneById } from '@/data/pricing';
import {
  CHILD_AGES,
  MAX_CLUB_CHILDREN,
  MAX_PUPILS,
  MAX_SESSIONS,
  BOOKABLE_SERVICES,
  calculateBooking,
  usesTravelZone,
  validateBooking,
} from '@/lib/booking';

const CHECKOUT_ENDPOINT = '/.netlify/functions/create-checkout';

// Errors on these fields mean the price can't be worked out yet.
const PRICE_FIELDS = ['service', 'duration', 'sessions', 'childrenCount', 'pupils', 'zone', 'location'];

const initialForm = {
  service: '',
  duration: 60,
  sessions: 1,
  childrenCount: 1,
  children: [{ firstName: '', age: '' }],
  pupils: 6,
  location: '',
  zone: '',
  address: '',
  schoolName: '',
  schoolAddress: '',
  role: '',
  poNumber: '',
  startDate: '',
  preferredTimes: '',
  emergencyName: '',
  emergencyPhone: '',
  additionalNeeds: '',
  notes: '',
  payer: { name: '', email: '', phone: '' },
  agree: { arranged: false, terms: false, cancellation: false, earlyStart: false, adultPresent: false, staffSupport: false, perSessions: false },
};

const inputClass =
  'w-full rounded-xl border border-[#DDD8CC] bg-white px-3.5 py-2.5 font-nunito text-sm text-[#2D2520] focus:outline-none focus:border-[#E8A020] focus:ring-2 focus:ring-[#E8A020]/20';

function Field({ label, hint, error, children, htmlFor }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block font-nunito text-sm font-700 text-[#2D2520] mb-1.5">
        {label}
      </label>
      {children}
      {hint && !error && <p className="font-nunito text-xs text-[#2D2520]/50 mt-1.5 leading-snug">{hint}</p>}
      {error && <p className="font-nunito text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}

function Fieldset({ title, children }) {
  return (
    <fieldset className="border-t border-[#2D2520]/10 pt-7 mt-7 first:border-t-0 first:pt-0 first:mt-0">
      <legend className="font-fredoka text-[#2D2520] text-xl mb-5">{title}</legend>
      <div className="space-y-5">{children}</div>
    </fieldset>
  );
}

function Choice({ name, value, checked, onChange, disabled, title, hint }) {
  return (
    <label
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition-colors ${
        disabled
          ? 'opacity-45 cursor-not-allowed border-[#DDD8CC]'
          : checked
            ? 'border-[#E8A020] bg-[#E8A020]/[0.07] cursor-pointer'
            : 'border-[#DDD8CC] hover:border-[#E8A020]/60 cursor-pointer'
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} className="mt-1 accent-[#E8A020]" />
      <span>
        <span className="block font-nunito text-sm font-700 text-[#2D2520]">{title}</span>
        {hint && <span className="block font-nunito text-xs text-[#2D2520]/55 mt-0.5 leading-snug">{hint}</span>}
      </span>
    </label>
  );
}

function Agreement({ checked, onChange, error, children }) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="mt-1 w-4 h-4 accent-[#E8A020] flex-shrink-0" />
        <span className="font-nunito text-sm text-[#2D2520]/75 leading-relaxed">{children}</span>
      </label>
      {error && <p className="font-nunito text-xs text-red-600 mt-1 ml-7">{error}</p>}
    </div>
  );
}

function StatusBanner({ status }) {
  if (status === 'success') {
    return (
      <div className="flex items-start gap-3 bg-[#2d8c62]/10 border border-[#2d8c62]/25 rounded-2xl p-5 mb-8">
        <CheckCircle2 className="text-[#2d8c62] flex-shrink-0 mt-0.5" size={22} />
        <div>
          <p className="font-fredoka text-[#2D2520] text-lg">Thank you — your payment was successful</p>
          <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-1">
            You’ll receive a receipt by email from Stripe. I’ll check your booking against the sessions we agreed and be in touch if anything needs adjusting.
          </p>
        </div>
      </div>
    );
  }
  if (status === 'cancelled') {
    return (
      <div className="flex items-start gap-3 bg-[#2D2520]/[0.04] border border-[#2D2520]/10 rounded-2xl p-5 mb-8">
        <XCircle className="text-[#2D2520]/50 flex-shrink-0 mt-0.5" size={22} />
        <div>
          <p className="font-fredoka text-[#2D2520] text-lg">Payment cancelled</p>
          <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mt-1">
            No payment has been taken. You can check your answers below and try again whenever you’re ready.
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export default function BookingForm({ status }) {
  const [form, setForm] = useState(initialForm);
  const [showErrors, setShowErrors] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const service = form.service;
  const isFamily = service === 'private' || service === 'club';
  const isSchool = service === 'send' || service === 'per';
  const hasDuration = service && service !== 'per';
  const zone = zoneById(form.zone);
  const showZone = service && usesTravelZone(form);

  const errors = useMemo(() => ({ ...validateBooking(form), ...serverErrors }), [form, serverErrors]);
  const err = (key) => (showErrors ? errors[key] : undefined);

  const priceable = service && !PRICE_FIELDS.some((key) => validateBooking(form)[key]);
  const quote = priceable ? calculateBooking(form) : null;

  const set = (patch) => {
    setServerErrors({});
    setSubmitError('');
    setForm((f) => ({ ...f, ...patch }));
  };
  const setPayer = (patch) => set({ payer: { ...form.payer, ...patch } });
  const setAgree = (key) => (e) => set({ agree: { ...form.agree, [key]: e.target.checked } });

  const setChildrenCount = (value) => {
    const count = parseInt(value, 10);
    const children = Array.from({ length: count }, (_, i) => form.children[i] || { firstName: '', age: '' });
    set({ childrenCount: count, children });
  };
  const setChild = (index, patch) => {
    const children = form.children.map((c, i) => (i === index ? { ...c, ...patch } : c));
    set({ children });
  };

  const chooseService = (id) => {
    const maxChildren = id === 'club' ? MAX_CLUB_CHILDREN : 12;
    const count = Math.min(form.childrenCount, maxChildren);
    set({
      service: id,
      childrenCount: count,
      children: form.children.slice(0, count),
      sessions: Math.min(form.sessions, MAX_SESSIONS[id] || 1),
      pupils: Math.min(form.pupils, MAX_PUPILS[id] || form.pupils),
    });
  };

  const chooseZone = (id) => {
    const next = zoneById(id);
    set({ zone: id, duration: next?.sixtyOnly ? 60 : form.duration });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors(true);
    if (Object.keys(validateBooking(form)).length > 0) {
      setSubmitError('Please check the highlighted answers above.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(CHECKOUT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (data.fields) setServerErrors(data.fields);
      setSubmitError(data.error || 'Online payment isn’t available right now. Please get in touch to book.');
    } catch {
      setSubmitError('We couldn’t reach the payment service. Please check your connection and try again.');
    }
    setSubmitting(false);
  };

  const today = new Date().toISOString().slice(0, 10);
  const privateFormat = service === 'private' ? privateFormatFor(form.childrenCount) : null;

  return (
    <div>
      <StatusBanner status={status} />

      <form onSubmit={handleSubmit} noValidate className="bg-white border border-[#2D2520]/10 rounded-3xl shadow-sm p-6 sm:p-8">
        {/* 1. What */}
        <Fieldset title="1. What would you like to book?">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BOOKABLE_SERVICES.map((s) => (
              <Choice
                key={s.id}
                name="service"
                value={s.id}
                checked={service === s.id}
                onChange={() => chooseService(s.id)}
                title={s.label}
                hint={s.hint}
              />
            ))}
          </div>
          {err('service') && <p className="font-nunito text-xs text-red-600">{err('service')}</p>}
        </Fieldset>

        {service && (
          <>
            {/* 2. Session details */}
            <Fieldset title="2. Session details">
              {service === 'private' && (
                <Field
                  label="How many children are you booking for?"
                  htmlFor="childrenCount"
                  hint={privateFormat ? `${privateFormat.label} session — children booked together share the session.` : undefined}
                  error={err('childrenCount')}
                >
                  <select id="childrenCount" className={inputClass} value={form.childrenCount} onChange={(e) => setChildrenCount(e.target.value)}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </Field>
              )}

              {service === 'club' && (
                <>
                  <Field label="Your child’s school" htmlFor="schoolName" error={err('schoolName')}>
                    <input id="schoolName" className={inputClass} value={form.schoolName} onChange={(e) => set({ schoolName: e.target.value })} />
                  </Field>
                  <Field label="How many children are you booking a place for?" htmlFor="childrenCount" hint="For example, siblings at the same school." error={err('childrenCount')}>
                    <select id="childrenCount" className={inputClass} value={form.childrenCount} onChange={(e) => setChildrenCount(e.target.value)}>
                      {Array.from({ length: MAX_CLUB_CHILDREN }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </Field>
                </>
              )}

              {isSchool && (
                <>
                  <Field label="School name" htmlFor="schoolName" error={err('schoolName')}>
                    <input id="schoolName" className={inputClass} value={form.schoolName} onChange={(e) => set({ schoolName: e.target.value })} />
                  </Field>
                  {service === 'send' && (
                    <Field label="School address, including postcode" htmlFor="schoolAddress" error={err('schoolAddress')}>
                      <textarea id="schoolAddress" rows={2} className={inputClass} value={form.schoolAddress} onChange={(e) => set({ schoolAddress: e.target.value })} />
                    </Field>
                  )}
                  <Field
                    label={service === 'per' ? 'How many pupils need a review?' : 'How many pupils will attend?'}
                    htmlFor="pupils"
                    hint={service === 'send' ? 'Sessions are a fixed price for up to 6 pupils — smaller groups pay the same.' : `${formatPrice(12500)} per pupil.`}
                    error={err('pupils')}
                  >
                    <select id="pupils" className={inputClass} value={form.pupils} onChange={(e) => set({ pupils: parseInt(e.target.value, 10) })}>
                      {Array.from({ length: MAX_PUPILS[service] }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </Field>
                </>
              )}

              {service === 'private' && (
                <Field label="Where will sessions take place?" error={err('location')}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Choice name="location" value="rf-venue" checked={form.location === 'rf-venue'} onChange={() => set({ location: 'rf-venue', zone: '' })} title="At a venue we arrange" hint="No travel fee." />
                    <Choice name="location" value="your-venue" checked={form.location === 'your-venue'} onChange={() => set({ location: 'your-venue' })} title="At my home or a venue I arrange" hint="A travel fee may apply." />
                  </div>
                </Field>
              )}

              {service === 'private' && form.location === 'your-venue' && (
                <Field label="Session address, including postcode" htmlFor="address" error={err('address')}>
                  <textarea id="address" rows={2} className={inputClass} value={form.address} onChange={(e) => set({ address: e.target.value })} />
                </Field>
              )}

              {showZone && (
                <Field
                  label={service === 'club' ? 'How far is the school from Great Dunmow?' : 'How far is the session from Great Dunmow?'}
                  htmlFor="zone"
                  hint="Measured by road from Great Dunmow town centre. We’ll confirm the zone when we contact you."
                  error={err('zone')}
                >
                  <select id="zone" className={inputClass} value={form.zone} onChange={(e) => chooseZone(e.target.value)}>
                    <option value="">Choose a travel zone…</option>
                    {TRAVEL_ZONES.map((z) => {
                      const cost = service === 'club'
                        ? z.clubUplift ? `+${formatPrice(z.clubUplift)} per child` : 'standard price'
                        : z.fee ? `+${formatPrice(z.fee)} per visit` : 'no travel fee';
                      return (
                        <option key={z.id} value={z.id}>
                          {z.label} · {z.distance} ({cost}) — e.g. {z.towns}
                        </option>
                      );
                    })}
                  </select>
                </Field>
              )}

              {hasDuration && (
                <Field label="Session length" error={err('duration')} hint={zone?.sixtyOnly ? `${zone.label} sessions are 60 minutes only.` : undefined}>
                  <div className="grid grid-cols-2 gap-3">
                    {DURATIONS.map((d) => (
                      <Choice
                        key={d}
                        name="duration"
                        value={d}
                        checked={form.duration === d}
                        onChange={() => set({ duration: d })}
                        disabled={d === 30 && zone?.sixtyOnly}
                        title={`${d} minutes`}
                        hint={service === 'club' ? (d === 30 ? 'Lunchtime club' : 'After-school club') : undefined}
                      />
                    ))}
                  </div>
                </Field>
              )}

              {hasDuration && (
                <Field
                  label={service === 'club' ? 'How many club sessions are you paying for?' : 'How many sessions would you like to book?'}
                  htmlFor="sessions"
                  hint={service === 'club' ? 'Usually the number of weeks in the term.' : 'Sessions are usually weekly.'}
                  error={err('sessions')}
                >
                  <select id="sessions" className={inputClass} value={form.sessions} onChange={(e) => set({ sessions: parseInt(e.target.value, 10) })}>
                    {Array.from({ length: MAX_SESSIONS[service] }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </Field>
              )}

              {hasDuration && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Agreed start date" htmlFor="startDate" hint="The date of the first session we agreed." error={err('startDate')}>
                    <input id="startDate" type="date" min={today} className={inputClass} value={form.startDate} onChange={(e) => set({ startDate: e.target.value })} />
                  </Field>
                  <Field label="Agreed days and times" htmlFor="preferredTimes" hint="For example, Tuesdays at 4pm." error={err('preferredTimes')}>
                    <input id="preferredTimes" className={inputClass} value={form.preferredTimes} onChange={(e) => set({ preferredTimes: e.target.value })} />
                  </Field>
                </div>
              )}
            </Fieldset>

            {/* 3. Children */}
            {isFamily && (
              <Fieldset title={form.childrenCount > 1 ? '3. About the children' : '3. About your child'}>
                {form.children.map((child, i) => (
                  <div key={i} className="grid grid-cols-[1fr_7rem] gap-3">
                    <Field label={form.childrenCount > 1 ? `Child ${i + 1}: first name` : 'First name'} htmlFor={`child${i}Name`} error={err(`child${i}Name`)}>
                      <input id={`child${i}Name`} className={inputClass} value={child.firstName} onChange={(e) => setChild(i, { firstName: e.target.value })} />
                    </Field>
                    <Field label="Age" htmlFor={`child${i}Age`} error={err(`child${i}Age`)}>
                      <select id={`child${i}Age`} className={inputClass} value={child.age} onChange={(e) => setChild(i, { age: e.target.value })}>
                        <option value="">–</option>
                        {CHILD_AGES.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                ))}
                <p className="font-nunito text-[#2D2520]/55 text-xs leading-relaxed">
                  Sessions are for children aged 5–12. For a child outside this age range, please{' '}
                  <Link to="/contact" className="text-[#E8A020] underline underline-offset-2">get in touch</Link> before booking.
                </p>

                <Field label="Does any child have additional needs we should know about?" error={err('additionalNeeds')} hint="Please don’t include details here — if you answer yes, I’ll contact you to talk it through privately.">
                  <div className="grid grid-cols-2 gap-3">
                    <Choice name="additionalNeeds" value="yes" checked={form.additionalNeeds === 'yes'} onChange={() => set({ additionalNeeds: 'yes' })} title="Yes" />
                    <Choice name="additionalNeeds" value="no" checked={form.additionalNeeds === 'no'} onChange={() => set({ additionalNeeds: 'no' })} title="No" />
                  </div>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Emergency contact name" htmlFor="emergencyName" error={err('emergencyName')}>
                    <input id="emergencyName" className={inputClass} value={form.emergencyName} onChange={(e) => set({ emergencyName: e.target.value })} />
                  </Field>
                  <Field label="Emergency contact phone" htmlFor="emergencyPhone" error={err('emergencyPhone')}>
                    <input id="emergencyPhone" type="tel" className={inputClass} value={form.emergencyPhone} onChange={(e) => set({ emergencyPhone: e.target.value })} />
                  </Field>
                </div>
              </Fieldset>
            )}

            {/* 3/4. Contact details */}
            <Fieldset title={isFamily ? '4. Your details' : '3. Your details'}>
              <Field label="Full name" htmlFor="payerName" error={err('payerName')}>
                <input id="payerName" autoComplete="name" className={inputClass} value={form.payer.name} onChange={(e) => setPayer({ name: e.target.value })} />
              </Field>
              {isSchool && (
                <Field label="Your role at the school" htmlFor="role" hint="For example, SENCo or Headteacher." error={err('role')}>
                  <input id="role" className={inputClass} value={form.role} onChange={(e) => set({ role: e.target.value })} />
                </Field>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Email" htmlFor="payerEmail" hint="Your receipt will be sent here." error={err('payerEmail')}>
                  <input id="payerEmail" type="email" autoComplete="email" className={inputClass} value={form.payer.email} onChange={(e) => setPayer({ email: e.target.value })} />
                </Field>
                <Field label="Phone" htmlFor="payerPhone" error={err('payerPhone')}>
                  <input id="payerPhone" type="tel" autoComplete="tel" className={inputClass} value={form.payer.phone} onChange={(e) => setPayer({ phone: e.target.value })} />
                </Field>
              </div>
              {isSchool && (
                <Field label="Purchase order number" htmlFor="poNumber" hint="Optional.">
                  <input id="poNumber" className={inputClass} value={form.poNumber} onChange={(e) => set({ poNumber: e.target.value })} />
                </Field>
              )}
              <Field label="Anything else we should know?" htmlFor="notes" hint="Optional. Please don’t include medical or SEND details here." error={err('notes')}>
                <textarea id="notes" rows={3} maxLength={450} className={inputClass} value={form.notes} onChange={(e) => set({ notes: e.target.value })} />
              </Field>
            </Fieldset>

            {/* Agreements */}
            <Fieldset title={isFamily ? '5. Confirm and pay' : '4. Confirm and pay'}>
              <div className="space-y-4">
                <Agreement checked={form.agree.arranged} onChange={setAgree('arranged')} error={err('arranged')}>
                  I have already been in touch with Rook Foundations and agreed these sessions, including the dates and times, before booking.{' '}
                  <Link to="/contact" target="_blank" className="text-[#E8A020] underline underline-offset-2">Not yet? Get in touch first.</Link>
                </Agreement>
                <Agreement checked={form.agree.terms} onChange={setAgree('terms')} error={err('terms')}>
                  I have read and accept the{' '}
                  <Link to="/terms-and-conditions" target="_blank" className="text-[#E8A020] underline underline-offset-2">Terms &amp; Conditions</Link>.
                </Agreement>
                <Agreement checked={form.agree.cancellation} onChange={setAgree('cancellation')} error={err('cancellation')}>
                  I understand the cancellation policy: sessions cancelled with at least 3 full days’ notice are not charged; later cancellations may be charged.
                </Agreement>
                {isFamily && (
                  <Agreement checked={form.agree.earlyStart} onChange={setAgree('earlyStart')} error={err('earlyStart')}>
                    If sessions start within 14 days of booking, I ask for them to start in that time, and I understand that if I cancel within the 14 days I’ll pay for any sessions already delivered.
                  </Agreement>
                )}
                {service === 'private' && form.location === 'your-venue' && (
                  <Agreement checked={form.agree.adultPresent} onChange={setAgree('adultPresent')} error={err('adultPresent')}>
                    A parent, guardian or another responsible adult (18+) will stay at the property for the whole session.
                  </Agreement>
                )}
                {service === 'send' && (
                  <Agreement checked={form.agree.staffSupport} onChange={setAgree('staffSupport')} error={err('staffSupport')}>
                    School staff will remain available for support outside Rook Foundations’ role, including personal care, medication and emergencies.
                  </Agreement>
                )}
                {service === 'per' && (
                  <Agreement checked={form.agree.perSessions} onChange={setAgree('perSessions')} error={err('perSessions')}>
                    Each pupil being reviewed has attended, or will have attended, at least 4 Rook Foundations sessions.
                  </Agreement>
                )}
              </div>

              {/* Summary */}
              <div className="bg-[#FAFAF7] border border-[#2D2520]/10 rounded-2xl p-5 mt-2">
                <p className="font-fredoka text-[#2D2520] text-lg mb-3">Summary</p>
                {quote ? (
                  <>
                    <ul className="space-y-2">
                      {quote.items.map((item) => (
                        <li key={item.name} className="flex justify-between gap-4 font-nunito text-sm text-[#2D2520]/75">
                          <span>
                            {item.name}
                            <span className="block text-xs text-[#2D2520]/50">
                              {item.description}
                              {item.quantity > 1 ? ` · × ${item.quantity}` : ''}
                            </span>
                          </span>
                          <span className="font-700 text-[#2D2520] whitespace-nowrap">{formatPrice(item.unitAmount * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between border-t border-[#2D2520]/10 mt-3 pt-3 font-fredoka text-[#2D2520] text-xl">
                      <span>Total</span>
                      <span className="text-[#E8A020]">{formatPrice(quote.total)}</span>
                    </div>
                  </>
                ) : (
                  <p className="font-nunito text-sm text-[#2D2520]/55">Complete the session details above to see your total.</p>
                )}
              </div>

              {submitError && <p className="font-nunito text-sm text-red-600" role="alert">{submitError}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E8A020] text-white font-fredoka font-600 text-lg px-8 py-4 rounded-2xl hover:bg-[#d4940e] transition-all hover:shadow-lg hover:shadow-[#E8A020]/30 disabled:opacity-60"
              >
                {submitting ? 'Taking you to payment…' : (
                  <>
                    Continue to secure payment <ArrowRight size={18} />
                  </>
                )}
              </button>
              <p className="flex items-center justify-center gap-1.5 font-nunito text-xs text-[#2D2520]/50">
                <Lock size={12} /> Payments are processed securely by Stripe. We never see your card details.
              </p>
            </Fieldset>
          </>
        )}
      </form>
    </div>
  );
}
