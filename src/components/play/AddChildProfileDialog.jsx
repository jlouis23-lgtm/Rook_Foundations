import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useCreateChildProfile } from '@/lib/playApi';

const AVATAR_EMOJIS = ['🦁', '🐯', '🦊', '🐼', '🐸', '🦉', '🐙', '🦄'];
const AVATAR_COLORS = ['#E8A020', '#2d8c62', '#4a7eb8', '#7a48c0', '#d1495b'];
const AGE_BANDS = ['5-7', '8-9', '10-12'];

export default function AddChildProfileDialog({ parentUserId, open, onOpenChange, onCreated }) {
  const [displayName, setDisplayName] = useState('');
  const [ageBand, setAgeBand] = useState(AGE_BANDS[0]);
  const [avatarEmoji, setAvatarEmoji] = useState(AVATAR_EMOJIS[0]);
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [error, setError] = useState('');
  const createChildProfile = useCreateChildProfile();

  const resetForm = () => {
    setDisplayName('');
    setAgeBand(AGE_BANDS[0]);
    setAvatarEmoji(AVATAR_EMOJIS[0]);
    setAvatarColor(AVATAR_COLORS[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Please enter your child's name.");
      return;
    }
    try {
      const profile = await createChildProfile.mutateAsync({
        parentUserId,
        displayName: displayName.trim(),
        ageBand,
        avatarEmoji,
        avatarColor
      });
      resetForm();
      onOpenChange(false);
      onCreated?.(profile);
    } catch (err) {
      setError(err.message || 'Something went wrong, please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) resetForm(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-fredoka text-[#2D2520]">Add a child profile</DialogTitle>
          <DialogDescription className="font-nunito">
            Create a profile so your child can play games and track their progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-nunito text-sm font-700 text-[#2D2520] mb-1.5">Child's name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Amelia"
              className="w-full rounded-xl border border-[#DDD8CC] px-3.5 py-2.5 font-nunito text-sm gold-focus focus:outline-none focus:border-[#E8A020]"
            />
          </div>

          <div>
            <label className="block font-nunito text-sm font-700 text-[#2D2520] mb-1.5">Age</label>
            <div className="flex gap-2">
              {AGE_BANDS.map((band) => (
                <button
                  type="button"
                  key={band}
                  onClick={() => setAgeBand(band)}
                  className={`px-3.5 py-1.5 rounded-xl font-nunito text-sm font-700 border transition-colors ${
                    ageBand === band
                      ? 'bg-[#E8A020] border-[#E8A020] text-white'
                      : 'border-[#DDD8CC] text-[#2D2520]/70 hover:border-[#E8A020]'
                  }`}
                >
                  {band}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-nunito text-sm font-700 text-[#2D2520] mb-1.5">Avatar</label>
            <div className="flex gap-2 flex-wrap">
              {AVATAR_EMOJIS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setAvatarEmoji(emoji)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 transition-colors ${
                    avatarEmoji === emoji ? 'border-[#E8A020]' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: `${avatarColor}22` }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-nunito text-sm font-700 text-[#2D2520] mb-1.5">Colour</label>
            <div className="flex gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setAvatarColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    avatarColor === color ? 'border-[#2D2520] scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {error && <p className="font-nunito text-sm text-red-600">{error}</p>}

          <DialogFooter>
            <button
              type="submit"
              disabled={createChildProfile.isPending}
              className="w-full bg-[#E8A020] text-white font-fredoka font-600 text-sm px-6 py-2.5 rounded-2xl hover:bg-[#d4940e] transition-all disabled:opacity-60"
            >
              {createChildProfile.isPending ? 'Creating…' : 'Create profile'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
