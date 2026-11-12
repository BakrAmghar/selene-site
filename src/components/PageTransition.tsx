import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '../lib/motion';

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Rideau couleur cire : à la sortie d'une page, il monte et recouvre l'écran ;
 * à l'entrée de la suivante, il continue sa course et dévoile la nouvelle page.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    );
  }
  return (
    <>
      <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
        {children}
      </motion.div>
      {/* Rideau de sortie : monte depuis le bas */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[250] origin-bottom bg-wax"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="absolute inset-x-0 -top-24 h-24 bg-[radial-gradient(60%_100%_at_50%_100%,var(--wax),transparent)]" />
      </motion.div>
      {/* Rideau d'entrée : s'en va vers le haut */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[250] flex origin-top items-center justify-center bg-wax"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.8, ease, delay: 0.1 } }}
        exit={{ scaleY: 0 }}
      >
        <motion.svg width="26" height="40" viewBox="0 0 64 100" initial={{ opacity: 1 }} animate={{ opacity: 0, transition: { duration: 0.2 } }}>
          <path d="M32 10c10 18 20 32 20 46 0 13-9 22-20 22S12 69 12 56c0-14 10-28 20-46z" fill="var(--accent)" />
        </motion.svg>
      </motion.div>
    </>
  );
}
