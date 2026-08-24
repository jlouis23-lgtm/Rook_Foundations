import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Copy } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useChildProfiles, useDeleteChildProfile } from '@/lib/playApi';
import { usePageMeta } from '@/hooks/use-page-meta';
import AddChildProfileDialog from '@/components/play/AddChildProfileDialog';

export default function PlayManageProfiles() {
  usePageMeta('Rook Play | Manage profiles', 'Add, edit or remove your child profiles.');
  const { user } = useAuth();
  const { data: children, isLoading } = useChildProfiles(user?.id);
  const deleteChildProfile = useDeleteChildProfile();
  const [addOpen, setAddOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const copyCode = (child) => {
    navigator.clipboard?.writeText(child.friendCode);
    setCopiedId(child.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Link to="/play" className="inline-flex items-center gap-1.5 font-nunito text-sm font-700 text-[#2D2520]/60 hover:text-[#E8A020] mb-6">
        <ArrowLeft size={16} /> Back to profiles
      </Link>

      <h1 className="font-fredoka text-2xl sm:text-3xl font-600 text-[#2D2520] mb-6">Manage profiles</h1>

      {isLoading ? (
        <p className="font-nunito text-[#2D2520]/50">Loading…</p>
      ) : (
        <div className="space-y-3 mb-6">
          {children?.map((child) => (
            <div key={child.id} className="flex items-center gap-4 bg-white rounded-2xl border border-[#E8A020]/15 p-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: child.avatarColor || '#E8A020' }}
              >
                {child.avatarEmoji || '🙂'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-nunito font-700 text-[#2D2520] truncate">{child.displayName}</p>
                <p className="font-nunito text-xs text-[#2D2520]/50">Age {child.ageBand || '—'}</p>
              </div>
              <button
                onClick={() => copyCode(child)}
                title="Copy friend code"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F3EE] font-nunito text-xs font-700 text-[#2D2520]/70 hover:text-[#E8A020] transition-colors"
              >
                <Copy size={13} /> {copiedId === child.id ? 'Copied!' : child.friendCode}
              </button>
              <button
                onClick={() => window.confirm(`Remove ${child.displayName}'s profile? This can't be undone.`) && deleteChildProfile.mutate(child.id)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-[#2D2520]/40 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setAddOpen(true)}
        className="flex items-center gap-2 font-nunito font-700 text-sm text-[#E8A020] hover:text-[#d4940e]"
      >
        <Plus size={16} /> Add another child
      </button>

      <AddChildProfileDialog parentUserId={user?.id} open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
