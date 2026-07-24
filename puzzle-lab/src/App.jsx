import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import BoardRecall from '@/pages/BoardRecall';
import MemoryMatch from '@/pages/MemoryMatch';
import PatternDetective from '@/pages/PatternDetective';
import OddOneOut from '@/pages/OddOneOut';
import SequenceRecall from '@/pages/SequenceRecall';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board-recall" element={<BoardRecall />} />
          <Route path="/memory-match" element={<MemoryMatch />} />
          <Route path="/pattern-detective" element={<PatternDetective />} />
          <Route path="/odd-one-out" element={<OddOneOut />} />
          <Route path="/sequence-recall" element={<SequenceRecall />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
