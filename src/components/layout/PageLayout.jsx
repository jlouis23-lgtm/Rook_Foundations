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
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}