import { Route, Routes } from 'react-router-dom';
import LeaderboardGate from './LeaderboardGate';
import ConsoleLayout from './console/ConsoleLayout';
import HomePage from './console/HomePage';
import SetupPage from './console/SetupPage';
import SessionPage from './console/SessionPage';
import GroupPage from './console/GroupPage';
import DisplayPage from './display/DisplayPage';
import GroupDisplayPage from './display/GroupDisplayPage';
import PageNotFound from '@/lib/PageNotFound';

// The whole leaderboard application, mounted at /leaderboard/* and loaded
// only when someone visits it.
export default function LeaderboardApp() {
  return (
    <Routes>
      <Route element={<LeaderboardGate />}>
        <Route element={<ConsoleLayout />}>
          <Route index element={<HomePage />} />
          <Route path="new/:gameId" element={<SetupPage />} />
          <Route path="session/:sessionId" element={<SessionPage />} />
          <Route path="group/:groupId" element={<GroupPage />} />
        </Route>
        {/* Child-facing display: no console chrome and no controls. */}
        <Route path="display/:sessionId" element={<DisplayPage />} />
        <Route path="display/group/:groupId" element={<GroupDisplayPage />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
