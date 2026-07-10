import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from '../ui/ScrollProgress';

export default function PageLayout() {
  return (
    <div className="min-h-screen bg-ivory">
      <ScrollProgress />
      <Navbar />
      <main>
        {/* No page-level fade/animation wrapper here on purpose: an
            opacity-based transition tied to route changes proved unreliable
            under rapid navigation (pages could get stuck invisible). Each
            page's own sections still animate in on scroll via whileInView,
            so the site doesn't feel static — this just removes the one
            animation that could leave a whole page blank. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}