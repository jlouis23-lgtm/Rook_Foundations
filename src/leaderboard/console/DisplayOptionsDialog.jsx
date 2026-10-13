import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const OPTIONS = [
  { key: 'showRecent', label: 'Recent results', hint: 'Each child’s last five results and the points they earned.' },
  { key: 'showPlayed', label: 'Games played', hint: 'How many games each child has played.' },
  { key: 'showRecord', label: 'Wins, draws and losses', hint: 'A count of each for every child.' }
];

// What the children see on the display, beyond rank, name and points.
export default function DisplayOptionsDialog({ open, onOpenChange, display, onChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-fredoka text-[#2D2520]">What children see</DialogTitle>
          <DialogDescription className="font-nunito text-base">
            Position, name and points are always shown. Choose what else appears on the display.
          </DialogDescription>
        </DialogHeader>
        <ul>
          {OPTIONS.map((option) => (
            <li key={option.key} className="flex items-center justify-between gap-4 py-3 border-b border-[#2D2520]/10">
              <label htmlFor={`display-${option.key}`} className="font-nunito">
                <span className="block font-700 text-[#2D2520]">{option.label}</span>
                <span className="block text-sm text-[#2D2520]/60">{option.hint}</span>
              </label>
              <Switch
                id={`display-${option.key}`}
                checked={!!display[option.key]}
                onCheckedChange={(checked) => onChange({ [option.key]: checked })}
              />
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
