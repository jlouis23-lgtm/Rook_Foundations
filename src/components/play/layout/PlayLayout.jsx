import { Link, Outlet, useParams } from 'react-router-dom';
import { LogOut, Users2, Trophy, Swords, ArrowLeftRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useChildProfile } from '@/lib/playApi';

export default function PlayLayout() {
  const { logout } = useAuth();
  const { childId } = useParams();
  const { data: activeChild } = useChildProfile(childId);

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <nav className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#E8A020]/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/play" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-[#E8A020] rounded-xl flex items-center justify-center shadow-sm shadow-[#E8A020]/30">
              <span className="text-white text-lg leading-none">♜</span>
            </div>
            <span className="font-fredoka text-[#2D2520] text-lg font-600 leading-none hidden sm:inline">
              Rook Play
            </span>
          </Link>

          {childId && (
            <div className="hidden md:flex items-center gap-4 font-nunito text-sm font-700 text-[#2D2520]/70">
              <Link to={`/play/${childId}`} className="flex items-center gap-1.5 hover:text-[#E8A020] transition-colors">
                <Trophy size={16} /> Games
              </Link>
              <Link to={`/play/${childId}/friends`} className="flex items-center gap-1.5 hover:text-[#E8A020] transition-colors">
                <Users2 size={16} /> Friends
              </Link>
              <Link to={`/play/${childId}/challenges`} className="flex items-center gap-1.5 hover:text-[#E8A020] transition-colors">
                <Swords size={16} /> Challenges
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 shrink-0">
            {activeChild && (
              <div className="hidden sm:flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: activeChild.avatarColor || '#E8A020' }}
                >
                  {activeChild.avatarEmoji || '🙂'}
                </div>
                <span className="font-nunito text-sm font-700 text-[#2D2520]">{activeChild.displayName}</span>
              </div>
            )}
            {childId && (
              <Link
                to="/play"
                title="Switch profile"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-[#2D2520]/60 hover:text-[#E8A020] hover:bg-[#E8A020]/10 transition-colors"
              >
                <ArrowLeftRight size={18} />
              </Link>
            )}
            <button
              onClick={() => logout()}
              title="Sign out"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-[#2D2520]/60 hover:text-[#E8A020] hover:bg-[#E8A020]/10 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
