import { motion } from 'framer-motion';
import { useLayoutEffect, useRef } from 'react';
import { MagneticButton } from '../components/Magnetic';
import Particles from '../components/Particles';
import { useAnchorNav } from '../components/Header';
import { gsap, prefersReducedMotion } from '../lib/motion';

const LINES = ['La lumière', 'qui prend', 'son temps.'];
const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const goTo = useAnchorNav();

  // Parallaxe de sortie : l'image s'enfonce, le texte s'élève et s'efface
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('[data-hero-img]', { yPercent: 18, scale: 1.15, ease: 'none', scrollTrigger: st });
      gsap.to('[data-hero-copy]', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, []);

  // Lumière qui suit la souris (variables CSS, sans re-render)
  useLayoutEffect(() => {
    const el = root.current!;
    const l = light.current!;
    let tx = innerWidth * 0.62, ty = innerHeight * 0.45, x = tx, y = ty, raf = 0;
    const reduced = prefersReducedMotion();
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    const loop = () => {
      x += (tx - x) * (reduced ? 1 : 0.08);
      y += (ty - y) * (reduced ? 1 : 0.08);
      l.style.setProperty('--mx', `${x}px`);
      l.style.setProperty('--my', `${y}px`);
      raf = requestAnimationFrame(loop);
    };
    loop();
    el.addEventListener('pointermove', move);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', move);
    };
  }, []);

  return (
    <section ref={root} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#14110e] text-[#efebe5]" aria-labelledby="hero-titre">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.25, filter: 'brightness(0.2)' }}
        animate={ready ? { scale: 1, filter: 'brightness(0.62)' } : undefined}
        transition={{ duration: 2.6, ease }}
      >
        <img
          data-hero-img
          src={import.meta.env.BASE_URL + 'images/hero-salle-bougies.webp'}
          alt="Une salle plongée dans la pénombre, éclairée par des centaines de bougies"
          className="h-full w-full object-cover object-[50%_62%]"
          fetchPriority="high"
        />
      </motion.div>

      {/* Lumière chaude qui suit la souris */}
      <div
        ref={light}
        aria-hidden
        className="absolute inset-0 mix-blend-soft-light"
        style={{ background: 'radial-gradient(520px circle at var(--mx) var(--my), rgba(255,190,120,.85), rgba(255,160,80,.25) 35%, transparent 70%)' }}
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,17,14,.55)_0%,transparent_30%,transparent_55%,rgba(20,17,14,.85)_100%)]" />
      <Particles className="absolute inset-0 h-full w-full" />

      <div data-hero-copy className="relative z-10 mx-auto flex h-full max-w-[1500px] flex-col justify-end px-4 pb-16 sm:px-8 sm:pb-20">
        <motion.p
          className="mb-6 text-[0.62rem] tracking-[0.22em] text-[#efebe5]/80 sm:text-[0.7rem] sm:tracking-[0.4em]"
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.5, duration: 1, ease }}
        >
          BOUGIES NATURELLES · COULÉES À LA MAIN
        </motion.p>
        <h1 id="hero-titre" className="font-serif text-[clamp(3.2rem,11vw,10.5rem)] font-normal leading-[0.92] tracking-[-0.02em]">
          {LINES.map((line, i) => (
            <span key={line} className="line-mask">
              <motion.span
                className={`block ${i === 1 ? 'pl-[8vw] italic text-[#f0c393]' : ''} ${i === 2 ? 'pl-[2vw]' : ''}`}
                initial={{ y: '110%', rotate: 4 }}
                animate={ready ? { y: '0%', rotate: 0 } : undefined}
                transition={{ delay: 0.6 + i * 0.15, duration: 1.3, ease }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <motion.p
            className="max-w-sm text-base leading-relaxed text-[#efebe5]/85"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1.2, duration: 1, ease }}
          >
            Cire végétale, mèche en coton, pot réutilisable. Des parfums floraux, frais et gourmands pour habiller vos soirées d’une lumière douce.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 1.35, duration: 1, ease }}
          >
            <MagneticButton variant="light" onClick={() => goTo('collection')}>
              Découvrir la collection <span aria-hidden>↓</span>
            </MagneticButton>
            <MagneticButton variant="ghost" onClick={() => goTo('quiz')}>
              Trouve ton parfum
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-white/20 sm:block"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: 2 }}
      >
        <motion.span className="block h-1/2 w-full bg-white" animate={{ y: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} />
      </motion.div>
    </section>
  );
}
