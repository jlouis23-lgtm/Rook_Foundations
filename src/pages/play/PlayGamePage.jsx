import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getPlayGameById } from '@/data/playGames';
import { useRecordGameResult, useCompleteChallenge, useChallenge } from '@/lib/playApi';
import { usePageMeta } from '@/hooks/use-page-meta';
import MemoryMatch from '@/components/play/games/MemoryMatch';
import ChessTactics from '@/components/play/games/ChessTactics';
import Mastermind from '@/components/play/games/Mastermind';
import ChallengeFriendDialog from '@/components/play/ChallengeFriendDialog';

const GAME_COMPONENTS = { MemoryMatch, ChessTactics, Mastermind };

export default function PlayGamePage() {
  const { childId, gameId } = useParams();
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const navigate = useNavigate();
  const game = getPlayGameById(gameId);
  const GameComponent = game ? GAME_COMPONENTS[game.componentKey] : null;
  const recordResult = useRecordGameResult();
  const completeChallenge = useCompleteChallenge();
  const { data: incomingChallenge } = useChallenge(challengeId);
  const [result, setResult] = useState(null);
  const [challengeOutcome, setChallengeOutcome] = useState(null);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  usePageMeta(game ? `Rook Play | ${game.title}` : 'Rook Play');

  if (!game || !GameComponent) {
    return (
      <div className="text-center py-24">
        <p className="font-nunito text-[#2D2520]/60 mb-4">We couldn't find that game.</p>
        <button onClick={() => navigate(`/play/${childId}`)} className="font-nunito font-700 text-[#E8A020]">
          Back to games
        </button>
      </div>
    );
  }

  const handleComplete = ({ score, stars }) => {
    setResult({ score, stars });
    recordResult.mutate({ childProfileId: childId, gameId: game.id, score, stars });

    if (challengeId && incomingChallenge) {
      const winnerChildId =
        score > incomingChallenge.fromScore ? childId : incomingChallenge.fromScore > score ? incomingChallenge.fromChildId : null;
      completeChallenge.mutate({ id: challengeId, toScore: score, winnerChildId });
      setChallengeOutcome(winnerChildId === childId ? 'won' : winnerChildId ? 'lost' : 'tied');
    }

    if (stars >= 2) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#E8A020', '#2d8c62', '#4a7eb8'] });
    }
  };

  const playAgain = () => {
    setResult(null);
    setChallengeOutcome(null);
    setPlayKey((k) => k + 1);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(`/play/${childId}`)}
        className="inline-flex items-center gap-1.5 font-nunito text-sm font-700 text-[#2D2520]/60 hover:text-[#E8A020] mb-6"
      >
        <ArrowLeft size={16} /> Back to games
      </button>

      {challengeId && incomingChallenge && !result && (
        <div className="bg-[#4a7eb8]/10 border border-[#4a7eb8]/25 rounded-2xl px-4 py-3 mb-5 font-nunito text-sm text-[#2D2520]">
          You've been challenged! Beat a score of <span className="font-800">{incomingChallenge.fromScore}</span> to win.
        </div>
      )}

      <h1 className="font-fredoka text-2xl font-600 text-[#2D2520] mb-1">{game.title}</h1>
      <p className="font-nunito text-sm text-[#2D2520]/60 mb-6">{game.description}</p>

      {!result ? (
        <GameComponent key={playKey} onComplete={handleComplete} />
      ) : (
        <div className="bg-white rounded-3xl border border-[#E8A020]/15 p-8 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3].map((n) => (
              <Star key={n} size={32} className={n <= result.stars ? 'fill-[#E8A020] text-[#E8A020]' : 'text-[#DDD8CC]'} />
            ))}
          </div>
          <p className="font-fredoka text-xl font-600 text-[#2D2520] mb-1">Score: {result.score}</p>

          {challengeOutcome && (
            <p className="font-nunito text-sm font-700 mb-2" style={{ color: challengeOutcome === 'won' ? '#2d8c62' : challengeOutcome === 'lost' ? '#d1495b' : '#2D2520' }}>
              {challengeOutcome === 'won' && 'You won the challenge! 🎉'}
              {challengeOutcome === 'lost' && 'So close! Your friend won this time.'}
              {challengeOutcome === 'tied' && "It's a tie!"}
            </p>
          )}

          <p className="font-nunito text-sm text-[#2D2520]/60 mb-6">Great work! Keep practising to earn more stars.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={playAgain}
              className="bg-[#E8A020] text-white font-fredoka font-600 text-sm px-6 py-2.5 rounded-2xl hover:bg-[#d4940e] transition-all"
            >
              Play again
            </button>
            {!challengeId && (
              <button
                onClick={() => setChallengeOpen(true)}
                className="bg-white border border-[#E8A020] text-[#E8A020] font-fredoka font-600 text-sm px-6 py-2.5 rounded-2xl hover:bg-[#E8A020]/10 transition-all"
              >
                Challenge a friend
              </button>
            )}
          </div>
        </div>
      )}

      <ChallengeFriendDialog
        open={challengeOpen}
        onOpenChange={setChallengeOpen}
        childId={childId}
        gameId={game.id}
        score={result?.score}
      />
    </div>
  );
}
