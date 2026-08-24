import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserPlus, Check, X } from 'lucide-react';
import {
  useFriends,
  useFriendLinks,
  useSendFriendRequest,
  useRespondToFriendRequest,
  useChildProfile
} from '@/lib/playApi';
import { usePageMeta } from '@/hooks/use-page-meta';

function IncomingRequestRow({ link, onRespond, isResponding }) {
  const { data: requester } = useChildProfile(link.requesterChildId);
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-[#E8A020]/15 p-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ backgroundColor: requester?.avatarColor || '#E8A020' }}
      >
        {requester?.avatarEmoji || '🙂'}
      </div>
      <p className="flex-1 font-nunito font-700 text-sm text-[#2D2520]">
        {requester?.displayName || 'A friend'} wants to connect
      </p>
      <button
        disabled={isResponding}
        onClick={() => onRespond({ id: link.id, status: 'accepted' })}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#2d8c62]/10 text-[#2d8c62] hover:bg-[#2d8c62]/20 transition-colors"
      >
        <Check size={16} />
      </button>
      <button
        disabled={isResponding}
        onClick={() => onRespond({ id: link.id, status: 'declined' })}
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function PlayFriends() {
  usePageMeta('Rook Play | Friends', 'Manage friend connections.');
  const { childId } = useParams();
  const { data: friends, isLoading: friendsLoading } = useFriends(childId);
  const { data: allLinks } = useFriendLinks(childId);
  const sendRequest = useSendFriendRequest();
  const respond = useRespondToFriendRequest();
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');

  const incomingPending = (allLinks || []).filter((l) => l.status === 'pending' && l.targetChildId === childId);
  const outgoingPending = (allLinks || []).filter((l) => l.status === 'pending' && l.requesterChildId === childId);

  const handleSend = async (e) => {
    e.preventDefault();
    setFeedback('');
    try {
      await sendRequest.mutateAsync({ requesterChildId: childId, friendCode: code.trim().toUpperCase() });
      setCode('');
      setFeedback('Friend request sent!');
    } catch (err) {
      setFeedback(err.message || 'Could not send request.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-fredoka text-2xl sm:text-3xl font-600 text-[#2D2520] mb-6">Friends</h1>

      <form onSubmit={handleSend} className="bg-white rounded-2xl border border-[#E8A020]/15 p-5 mb-6">
        <label className="block font-nunito text-sm font-700 text-[#2D2520] mb-2">Add a friend by code</label>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. AB3XZ"
            maxLength={8}
            className="flex-1 rounded-xl border border-[#DDD8CC] px-3.5 py-2.5 font-nunito text-sm uppercase tracking-widest gold-focus focus:outline-none focus:border-[#E8A020]"
          />
          <button
            type="submit"
            disabled={!code || sendRequest.isPending}
            className="flex items-center gap-1.5 bg-[#E8A020] text-white font-fredoka font-600 text-sm px-4 py-2.5 rounded-xl hover:bg-[#d4940e] transition-all disabled:opacity-60"
          >
            <UserPlus size={16} /> Add
          </button>
        </div>
        {feedback && <p className="font-nunito text-xs text-[#2D2520]/60 mt-2">{feedback}</p>}
      </form>

      {incomingPending.length > 0 && (
        <div className="mb-6">
          <h2 className="font-nunito font-700 text-sm text-[#2D2520]/60 mb-2">Requests</h2>
          <div className="space-y-2">
            {incomingPending.map((link) => (
              <IncomingRequestRow key={link.id} link={link} onRespond={respond.mutate} isResponding={respond.isPending} />
            ))}
          </div>
        </div>
      )}

      <h2 className="font-nunito font-700 text-sm text-[#2D2520]/60 mb-2">Your friends</h2>
      {friendsLoading ? (
        <p className="font-nunito text-sm text-[#2D2520]/50">Loading…</p>
      ) : !friends || friends.length === 0 ? (
        <p className="font-nunito text-sm text-[#2D2520]/50">
          No friends yet. Ask a friend for their code, or share yours from Manage Profiles.
        </p>
      ) : (
        <div className="space-y-2">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center gap-3 bg-white rounded-2xl border border-[#E8A020]/15 p-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: friend.avatarColor || '#E8A020' }}
              >
                {friend.avatarEmoji || '🙂'}
              </div>
              <p className="font-nunito font-700 text-sm text-[#2D2520]">{friend.displayName}</p>
            </div>
          ))}
        </div>
      )}

      {outgoingPending.length > 0 && (
        <p className="font-nunito text-xs text-[#2D2520]/40 mt-4">
          {outgoingPending.length} friend request{outgoingPending.length > 1 ? 's' : ''} waiting to be accepted.
        </p>
      )}
    </div>
  );
}
