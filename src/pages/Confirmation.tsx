import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { euro } from '../data/products';
import { prefersReducedMotion } from '../lib/motion';

type Order = {
  numero: string;
  prenom: string;
  email: string;
  total: number;
  adresse: string;
  livraison: { label: string; delay: string };
  articles: { name: string; format: string; qty: number; image: string }[];
};

const ease = [0.22, 1, 0.36, 1] as const;

/** Étincelles dorées façon braises, tirées depuis les deux côtés puis en pluie douce. */
function sparkle() {
  if (prefersReducedMotion()) return () => {};
  const colors = ['#f0c393', '#d08a55', '#9a5f34', '#fff1d6', '#efebe5'];
  const base = { colors, ticks: 260, gravity: 0.7, scalar: 0.9, disableForReducedMotion: true, zIndex: 260 };
  const timers = [
    setTimeout(() => {
      confetti({ ...base, particleCount: 90, spread: 70, angle: 60, origin: { x: 0, y: 0.75 } });
      confetti({ ...base, particleCount: 90, spread: 70, angle: 120, origin: { x: 1, y: 0.75 } });
    }, 700),
    setTimeout(() => confetti({ ...base, particleCount: 120, spread: 160, startVelocity: 25, origin: { x: 0.5, y: 0.35 }, shapes: ['circle'] }), 1300),
  ];
  const end = Date.now() + 2600;
  let raf = 0;
  const rain = () => {
    confetti({ ...base, particleCount: 2, startVelocity: 0, gravity: 0.35, ticks: 400, origin: { x: Math.random(), y: -0.05 }, shapes: ['circle'], scalar: 0.6 });
    if (Date.now() < end) raf = requestAnimationFrame(rain);
  };
  timers.push(setTimeout(() => (raf = requestAnimationFrame(rain)), 1600));
  return () => {
    timers.forEach(clearTimeout);
    cancelAnimationFrame(raf);
  };
}

export default function Confirmation() {
  const { state } = useLocation();
  let order = state as Order | null;
  if (!order) {
    try {
      order = JSON.parse(sessionStorage.getItem('selene-commande') || 'null');
    } catch {
      order = null;
    }
  }

  useEffect(() => {
    document.title = 'Merci ! — SELENE';
    if (!order) return;
    return sparkle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!order) {
    return (
      <main id="contenu" className="flex min-h-[80svh] flex-col items-center justify-center px-4 pt-24 text-center">
        <h1 className="font-serif text-5xl">Aucune commande récente</h1>
        <Link to="/" className="mt-8 underline underline-offset-4">
          Retour à l’accueil
        </Link>
      </main>
    );
  }

  return (
    <main id="contenu" className="relative overflow-hidden px-4 pb-32 pt-36 sm:px-8">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-20 h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(var(--glow),.35),transparent)]" />
      <div className="relative mx-auto max-w-2xl text-center">
        <motion.svg
          width="56" height="88" viewBox="0 0 64 100" className="mx-auto" aria-hidden
          initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 12 }}
        >
          <g className="flicker" style={{ transformOrigin: '32px 78px' }}>
            <path d="M32 10c10 18 20 32 20 46 0 13-9 22-20 22S12 69 12 56c0-14 10-28 20-46z" fill="var(--accent)" />
            <path d="M32 40c5 9 9 15 9 22 0 6-4 10-9 10s-9-4-9-10c0-7 4-13 9-22z" fill="#fff1d6" />
          </g>
          <rect x="18" y="80" width="28" height="18" rx="3" fill="currentColor" opacity=".85" />
        </motion.svg>
        <p className="mt-8 text-[0.7rem] tracking-[0.35em] text-ambre-text">COMMANDE N° {order.numero}</p>
        <h1 className="mt-4 font-serif text-[clamp(3rem,8vw,6rem)] leading-[0.95]">
          {['Merci,', `${order.prenom} !`].map((l, i) => (
            <span key={i} className="line-mask">
              <motion.span className={`block ${i ? 'italic text-ambre' : ''}`} initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.6 + i * 0.12, duration: 1.1, ease }}>
                {l}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="mt-6 text-muted" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}>
          Vos bougies vont être emballées à la main. Un e-mail de confirmation (simulé) a été envoyé à <strong className="text-ink">{order.email}</strong>.
        </motion.p>

        <motion.div className="mt-12 rounded-3xl bg-card p-6 text-left sm:p-8" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.9, ease }}>
          <ul className="space-y-4">
            {order.articles.map((a, i) => (
              <motion.li key={i} className="flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 + i * 0.08 }}>
                <img src={a.image} alt="" className="h-16 w-14 rounded-md object-cover" />
                <span className="flex-1">
                  <span className="block font-serif">{a.name}</span>
                  <span className="block text-xs text-muted">
                    {a.format} × {a.qty}
                  </span>
                </span>
              </motion.li>
            ))}
          </ul>
          <dl className="mt-6 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs tracking-[0.15em] text-muted">LIVRAISON</dt>
              <dd className="mt-1">
                {order.livraison.label} — {order.livraison.delay}
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.15em] text-muted">ADRESSE</dt>
              <dd className="mt-1">{order.adresse}</dd>
            </div>
            <div className="sm:col-span-2 flex items-baseline justify-between border-t border-line pt-4">
              <dt className="font-serif text-xl">Total payé (simulé)</dt>
              <dd className="font-serif text-2xl tabular-nums">{euro(order.total)}</dd>
            </div>
          </dl>
        </motion.div>

        <Link to="/" className="mt-12 inline-block underline underline-offset-4">
          Retourner à la boutique
        </Link>
      </div>
    </main>
  );
}
