import { Outlet } from 'react-router-dom';

// Every leaderboard route renders inside this gate. In the prototype it lets
// everyone through: data is stored only on the practitioner's own device, so
// there is nothing here for another visitor to see. When practitioner
// accounts arrive (Phase 6), the sign-in check goes here and nowhere else.
export default function LeaderboardGate() {
  return <Outlet />;
}
