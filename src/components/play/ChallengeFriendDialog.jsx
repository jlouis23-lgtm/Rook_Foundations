import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useFriends, useCreateChallenge } from '@/lib/playApi';

export default function ChallengeFriendDialog({ open, onOpenChange, childId, gameId, score }) {
  const { data: friends, isLoading } = useFriends(childId);
  const createChallenge = useCreateChallenge();
  const [sentTo, setSentTo] = useState(null);

  const handleChallenge = async (friend) => {
    await createChallenge.mutateAsync({ fromChildId: childId, toChildId: friend.id, gameId, fromScore: score });
    setSentTo(friend.id);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) setSentTo(null); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-fredoka text-[#2D2520]">Challenge a friend</DialogTitle>
          <DialogDescription className="font-nunito">
            Send your score of {score} to a friend and see if they can beat it.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="font-nunito text-sm text-[#2D2520]/50 py-4">Loading friends…</p>
        ) : !friends || friends.length === 0 ? (
          <p className="font-nunito text-sm text-[#2D2520]/50 py-4">
            No friends yet — add one from the Friends page first.
          </p>
        ) : (
          <div className="space-y-2 py-2">
            {friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => handleChallenge(friend)}
                disabled={createChallenge.isPending}
                className="w-full flex items-center gap-3 bg-[#F5F3EE] hover:bg-[#E8A020]/15 rounded-2xl px-3.5 py-2.5 transition-colors text-left"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{ backgroundColor: friend.avatarColor || '#E8A020' }}
                >
                  {friend.avatarEmoji || '🙂'}
                </div>
                <span className="font-nunito font-700 text-sm text-[#2D2520] flex-1">{friend.displayName}</span>
                {sentTo === friend.id && <span className="font-nunito text-xs font-700 text-[#2d8c62]">Sent!</span>}
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
