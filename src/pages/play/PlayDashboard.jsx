import { useParams, useNavigate } from 'react-router-dom';
import { Star, Users2, Swords } from 'lucide-react';
import { PLAY_GAMES } from '@/data/playGames';
import { useChildProfile, useGameProgress, useFriendLinks, useChallenges } from '@/lib/playApi';
import { usePageMeta } from '@/hooks/use-page-meta';

export default function PlayDashboard() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { data: child } = useChildProfile(childId);
  const { data: progress } = useGameProgress(childId);
  const { data: friendLinks } = useFriendLinks(childId);
  const { data: challenges } = useChallenges(childId);

  usePageMeta(
    child ? `Rook Play | ${child.displayName}'s games` : 'Rook Play',
    'Play educational strategy games, track progress and challenge friends.'
  );

  const progressByGame = Object.fromEntries((progress || []).map((p) => [p.gameId, p]));
  const pendingFriendRequests = (friendLinks || []).filter((f) => f.status === 'pending' && f.targetChildId === childId).length;
  const pendingChallenges = (challenges || []).filter((c) => c.status === 'pending' && c.toChildId === childId).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-fredoka text-2xl sm:text-3xl font-600 text-[#2D2520]">
            {child ? `Hi ${child.displayName}!` : 'Loading…'}
          </h1>
          <p className="font-nunito text-[#2D2520]/60 text-sm">Pick a game to start playing.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/play/${childId}/friends`)}
            className="relative flex items-center gap-2 bg-white border border-[#E8A020]/20 rounded-2xl px-4 py-2.5 font-nunito text-sm font-700 text-[#2D2520] hover:border-[#E8A020] transition-colors"
          >
            <Users2 size={16} /> Friends
            {pendingFriendRequests > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#d1495b] text-white text-[10px] font-800 rounded-full flex items-center justify-center">
                {pendingFriendRequests}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate(`/play/${childId}/challenges`)}
            className="relative flex items-center gap-2 bg-white border border-[#E8A020]/20 rounded-2xl px-4 py-2.5 font-nunito text-sm font-700 text-[#2D2520] hover:border-[#E8A020] transition-colors"
          >
            <Swords size={16} /> Challenges
            {pendingChallenges > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#d1495b] text-white text-[10px] font-800 rounded-full flex items-center justify-center">
                {pendingChallenges}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PLAY_GAMES.map((game) => {
          const gameProgress = progressByGame[game.id];
          return (
            <button
              key={game.id}
              onClick={() => navigate(`/play/${childId}/games/${game.id}`)}
              className="play-card text-left bg-white rounded-3xl border border-[#E8A020]/15 p-5 flex flex-col gap-3"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-fredoka text-lg"
                style={{ backgroundColor: game.accent }}
              >
                {game.title[0]}
              </div>
              <div>
                <h3 className="font-fredoka font-600 text-[#2D2520] text-lg">{game.title}</h3>
                <p className="font-nunito text-sm text-[#2D2520]/60 leading-snug mt-1">{game.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="font-nunito text-xs font-700" style={{ color: game.accent }}>
                  {game.skill}
                </span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((n) => (
                    <Star
                      key={n}
                      size={14}
                      className={n <= (gameProgress?.stars || 0) ? 'fill-[#E8A020] text-[#E8A020]' : 'text-[#DDD8CC]'}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
