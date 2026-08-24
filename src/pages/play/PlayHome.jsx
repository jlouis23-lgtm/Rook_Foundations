import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useChildProfiles } from '@/lib/playApi';
import { usePageMeta } from '@/hooks/use-page-meta';
import AddChildProfileDialog from '@/components/play/AddChildProfileDialog';

export default function PlayHome() {
  usePageMeta('Rook Play | Choose a profile', 'Choose your child profile to start playing.');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: children, isLoading } = useChildProfiles(user?.id);
  const [addOpen, setAddOpen] = useState(false);

  if (isLoading) {
    return <div className="text-center py-24 font-nunito text-[#2D2520]/50">Loading profiles…</div>;
  }

  const hasChildren = children && children.length > 0;

  return (
    <div className="max-w-3xl mx-auto text-center py-10">
      <h1 className="font-fredoka text-3xl sm:text-4xl font-600 text-[#2D2520] mb-2">Who's playing?</h1>
      <p className="font-nunito text-[#2D2520]/60 mb-10">
        {hasChildren ? 'Choose a profile to jump back in.' : 'Create your first child profile to get started.'}
      </p>

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {children?.map((child) => (
          <button
            key={child.id}
            onClick={() => navigate(`/play/${child.id}`)}
            className="play-card flex flex-col items-center gap-3 w-32"
          >
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl shadow-sm"
              style={{ backgroundColor: child.avatarColor || '#E8A020' }}
            >
              {child.avatarEmoji || '🙂'}
            </div>
            <span className="font-nunito font-700 text-[#2D2520] text-sm truncate w-full">{child.displayName}</span>
          </button>
        ))}

        <button
          onClick={() => setAddOpen(true)}
          className="play-card flex flex-col items-center gap-3 w-32"
        >
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center border-2 border-dashed border-[#E8A020]/40 text-[#E8A020]">
            <Plus size={32} />
          </div>
          <span className="font-nunito font-700 text-[#2D2520]/70 text-sm">Add child</span>
        </button>
      </div>

      {hasChildren && (
        <button
          onClick={() => navigate('/play/manage')}
          className="inline-flex items-center gap-2 font-nunito text-sm font-700 text-[#2D2520]/60 hover:text-[#E8A020] transition-colors"
        >
          <Settings size={16} /> Manage profiles
        </button>
      )}

      <AddChildProfileDialog
        parentUserId={user?.id}
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreated={(profile) => navigate(`/play/${profile.id}`)}
      />
    </div>
  );
}
