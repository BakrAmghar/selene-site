import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useReducedMotion } from '../lib/motion';

const LETTERS = 'SELENE'.split('');

/** Écran de chargement : une flamme s'allume, puis SELENE apparaît lettre par lettre. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(onDone, reduced ? 600 : 3000);
    return () => clearTimeout(t);
  }, [onDone, reduced]);

  return (
    <motion.div
      role="status"
      aria-label="Chargement de SELENE"
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#14110e] text-[#efebe5]"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: reduced ? 0.2 : 1, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Halo qui s'élargit quand la flamme prend */}
      <motion.div
        aria-hidden
        className="absolute h-[60vmin] w-[60vmin] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,170,90,.35), rgba(255,170,90,0) 65%)' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.6, ease: 'easeOut' }}
      />

      <svg aria-hidden width="64" height="120" viewBox="0 0 64 120" className="relative mb-8 overflow-visible">
        {/* Mèche */}
        <rect x="30.5" y="86" width="3" height="16" rx="1.5" fill="#3a2e24" />
        {/* Corps de bougie */}
        <motion.rect
          x="12" y="100" width="40" height="20" rx="3" fill="#efebe5"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        />
        {/* Étincelle d'allumage */}
        <motion.circle
          cx="32" cy="84" r="3" fill="#ffd9a0"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 2.2, 0], opacity: [0, 1, 0] }}
          transition={{ delay: 0.35, duration: 0.5 }}
        />
        <motion.g
          style={{ transformOrigin: '32px 86px' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <g className="flicker" style={{ transformOrigin: '32px 86px' }}>
            <path d="M32 18c10 18 20 32 20 46 0 13-9 22-20 22S12 77 12 64c0-14 10-28 20-46z" fill="url(#outer)" />
            <path d="M32 46c5 9 9 15 9 22 0 6-4 10-9 10s-9-4-9-10c0-7 4-13 9-22z" fill="#fff4dc" />
          </g>
        </motion.g>
        <defs>
          <linearGradient id="outer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffb75e" stopOpacity="0.1" />
            <stop offset="0.45" stopColor="#ff9a3d" />
            <stop offset="1" stopColor="#d4581e" />
          </linearGradient>
        </defs>
      </svg>

      <h1 className="relative flex font-serif text-5xl font-medium tracking-[0.45em] pl-[0.45em] sm:text-7xl" aria-hidden>
        {LETTERS.map((l, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 1.2 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {l}
          </motion.span>
        ))}
      </h1>
      <motion.p
        className="relative mt-4 text-[0.65rem] tracking-[0.5em] pl-[0.5em] text-[#efebe5]/70"
        initial={{ opacity: 0, letterSpacing: '0.2em' }}
        animate={{ opacity: 1, letterSpacing: '0.5em' }}
        transition={{ delay: 2, duration: 0.9 }}
      >
        MAISON DE BOUGIES
      </motion.p>
    </motion.div>
  );
}
