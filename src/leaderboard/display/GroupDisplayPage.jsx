import { useParams } from 'react-router-dom';
import { useGroupView, useLeaderboardSync } from '../data/hooks';
import { DisplayMessage } from './DisplayBoard';
import OverallBoard from './OverallBoard';

// A group's overall leaderboard on its own, opened from the group page.
export default function GroupDisplayPage() {
  const { groupId } = useParams();
  useLeaderboardSync();
  const { data: groupView, isLoading, error } = useGroupView(groupId);

  if (isLoading) return null;
  if (error || !groupView) {
    return (
      <DisplayMessage>
        This leaderboard is not available here. Open the display from the practitioner console on the same device.
      </DisplayMessage>
    );
  }
  return <OverallBoard groupView={groupView} />;
}
