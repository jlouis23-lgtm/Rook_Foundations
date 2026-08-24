import { useParams, useNavigate } from 'react-router-dom';
import { Swords, X } from 'lucide-react';
import { useChallenges, useChildProfile, useDeclineChallenge } from '@/lib/playApi';
import { getPlayGameById } from '@/data/playGames';
import { usePageMeta } from '@/hooks/use-page-meta';

function ChallengeRow({ challenge, childId, onPlay, onDecline }) {
  const isIncoming = challenge.toChildId === childId;
  const otherChildId = isIncoming ? challenge.fromChildId : challenge.toChildId;
  const { data: otherChild } = useChildProfile(otherChildId);
  const game = getPlayGameById(challenge.gameId);

  let statusLabel = 'Waiting for a reply';
  let statusColor = '#2D2520';
  if (challenge.status === 'completed') {
    if (challenge.winnerChildId === childId) {
      statusLabel = 'You won!';
      statusColor = '#2d8c62';
    } else if (challenge.winnerChildId) {
      statusLabel = 'You lost this one';
      statusColor = '#d1495b';
    } else {
      statusLabel = 'Tied game';
    }
  } else if (challenge.status === 'declined') {
    statusLabel = 'Declined';
    statusColor = '#2D2520';
  } else if (isIncoming) {
    statusLabel = `Beat a score of ${challenge.fromScore}`;
    statusColor = '#4a7eb8';
  }

  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-[#E8A020]/15 p-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ backgroundColor: otherChild?.avatarColor || '#E8A020' }}
      >
        {otherChild?.avatarEmoji || '🙂'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-nunito font-700 text-sm text-[#2D2520] truncate">
          {isIncoming ? `${otherChild?.displayName || 'A friend'} challenged you` : `You challenged ${otherChild?.displayName || 'a friend'}`}
        </p>
        <p className="font-nunito text-xs text-[#2D2520]/50">{game?.title}</p>
        <p className="font-nunito text-xs font-700 mt-0.5" style={{ color: statusColor }}>{statusLabel}</p>
      </div>
      {challenge.status === 'pending' && isIncoming && (
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onPlay(challenge)}
            className="flex items-center gap-1.5 bg-[#E8A020] text-white font-fredoka font-600 text-xs px-3.5 py-2 rounded-xl hover:bg-[#d4940e] transition-all"
          >
            <Swords size={13} /> Play
          </button>
          <button
            onClick={() => onDecline(challenge.id)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function PlayChallenges() {
  usePageMeta('Rook Play | Challenges', 'View and respond to friend challenges.');
  const { childId } = useParams();
  const navigate = useNavigate();
  const { data: challenges, isLoading } = useChallenges(childId);
  const declineChallenge = useDeclineChallenge();

  const handlePlay = (challenge) => {
    navigate(`/play/${childId}/games/${challenge.gameId}?challengeId=${challenge.id}`);
  };

  const sorted = [...(challenges || [])].sort((a, b) => (a.status === 'pending' ? -1 : 1) - (b.status === 'pending' ? -1 : 1));

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-fredoka text-2xl sm:text-3xl font-600 text-[#2D2520] mb-6">Challenges</h1>

      {isLoading ? (
        <p className="font-nunito text-sm text-[#2D2520]/50">Loading…</p>
      ) : !sorted || sorted.length === 0 ? (
        <p className="font-nunito text-sm text-[#2D2520]/50">
          No challenges yet. Finish a game and challenge a friend to beat your score!
        </p>
      ) : (
        <div className="space-y-2">
          {sorted.map((challenge) => (
            <ChallengeRow
              key={challenge.id}
              challenge={challenge}
              childId={childId}
              onPlay={handlePlay}
              onDecline={declineChallenge.mutate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
