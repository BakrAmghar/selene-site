import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import Cursor from './components/Cursor';
import Footer from './components/Footer';
import Header from './components/Header';
import Loader from './components/Loader';
import PageTransition from './components/PageTransition';
import { ScrollTrigger, scrollToTarget, startSmoothScroll } from './lib/motion';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProductPage from './pages/Product';

export default function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const done = useCallback(() => setLoading(false), []);

  useEffect(() => {
    startSmoothScroll();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = loading ? 'hidden' : '';
    if (!loading) ScrollTrigger.refresh();
  }, [loading]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="grain">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[500] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">
        Aller au contenu
      </a>
      <AnimatePresence>{loading && <Loader onDone={done} />}</AnimatePresence>
      <Cursor />
      <Header />
      <CartDrawer />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          scrollToTarget(0, true);
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home ready={!loading} /></PageTransition>} />
          <Route path="/produit/:slug" element={<PageTransition><ProductPage /></PageTransition>} />
          <Route path="/commande" element={<PageTransition><Checkout /></PageTransition>} />
          <Route path="/confirmation" element={<PageTransition><Confirmation /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
    </MotionConfig>
  );
}
