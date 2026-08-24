import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function PlaySignInPrompt() {
  const { sendMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('sending');
    setError('');
    try {
      await sendMagicLink(email.trim());
      setStatus('sent');
    } catch (err) {
      setError(err.message || 'Something went wrong, please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center bg-white rounded-3xl border border-[#E8A020]/15 shadow-sm p-8">
        <div className="w-14 h-14 mx-auto bg-[#E8A020] rounded-2xl flex items-center justify-center shadow-md shadow-[#E8A020]/30 mb-5">
          <span className="text-white text-2xl leading-none">♜</span>
        </div>
        <h1 className="font-fredoka text-[#2D2520] text-2xl font-600 mb-2">Sign in to play</h1>

        {status === 'sent' ? (
          <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed">
            We've sent a sign-in link to <span className="font-700">{email}</span>. Open it on this device to
            continue.
          </p>
        ) : (
          <>
            <p className="font-nunito text-[#2D2520]/65 text-sm leading-relaxed mb-6">
              Rook Play is where your children practise chess and strategy games, track their progress and
              challenge their friends. Enter your email and we'll send you a sign-in link — no password needed.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#DDD8CC] px-3.5 py-2.5 font-nunito text-sm text-center gold-focus focus:outline-none focus:border-[#E8A020]"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-[#E8A020] text-white font-fredoka font-600 text-sm px-6 py-3 rounded-2xl hover:bg-[#d4940e] transition-all duration-300 hover:shadow-lg hover:shadow-[#E8A020]/30 disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending…' : 'Send sign-in link'}
              </button>
              {error && <p className="font-nunito text-xs text-red-600">{error}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
