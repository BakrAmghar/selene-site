import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger, scrollToTarget } from '../lib/motion';
import Atelier from '../sections/Atelier';
import Collection from '../sections/Collection';
import Hero from '../sections/Hero';
import InstaGallery from '../sections/InstaGallery';
import Marquee from '../sections/Marquee';
import Newsletter from '../sections/Newsletter';
import Quiz from '../sections/Quiz';
import WhyNoParaffin from '../sections/WhyNoParaffin';

export default function Home({ ready }: { ready: boolean }) {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = 'SELENE — Maison de bougies naturelles';
  }, []);

  // Arrivée depuis une autre page avec une ancre (#collection, #quiz…)
  useEffect(() => {
    if (!hash || !ready) return;
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToTarget(hash);
    }, 900);
    return () => clearTimeout(t);
  }, [hash, ready]);

  return (
    <main id="contenu">
      <Hero ready={ready} />
      <Marquee />
      <WhyNoParaffin />
      <Collection />
      <Atelier />
      <Quiz />
      <InstaGallery />
      <Newsletter />
    </main>
  );
}
