import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion';

const ITEMS = ['Cire végétale', 'Mèche en coton', 'Coulée à la main', 'Sans paraffine'];

function Row() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {[...ITEMS, ...ITEMS].map((t, i) => (
        <span key={i} className="flex items-center">
          <span className={`whitespace-nowrap px-6 font-serif text-[clamp(2rem,5vw,4.5rem)] ${i % 2 ? 'italic text-ambre' : ''}`}>{t}</span>
          <svg width="22" height="34" viewBox="0 0 64 100" className="flex-none text-ambre" aria-hidden>
            <path d="M32 10c10 18 20 32 20 46 0 13-9 22-20 22S12 69 12 56c0-14 10-28 20-46z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/** Bandeau défilant à l'infini ; accélère et change de sens selon le scroll. */
export default function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tween = gsap.to(track.current, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
      tween.totalTime(28 * 1000); // marge pour pouvoir défiler à l'envers sans buter sur le début
      let dir = 1;
      ScrollTrigger.create({
        trigger: track.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          if (self.direction !== dir) dir = self.direction;
          const boost = Math.min(5, 1 + Math.abs(self.getVelocity()) / 400);
          gsap.to(tween, { timeScale: dir * boost, duration: 0.2, overwrite: true });
          gsap.to(tween, { timeScale: dir, duration: 1.2, delay: 0.2 });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section aria-label="Cire végétale, mèche en coton, coulée à la main, sans paraffine" className="relative overflow-hidden border-y border-line bg-bg py-8">
      <div ref={track} className="flex w-max">
        <Row />
        <Row />
      </div>
    </section>
  );
}
