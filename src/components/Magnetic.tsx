import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '../lib/motion';

/** Enveloppe magnétique : l'élément suit légèrement la souris. */
export default function Magnetic({ children, strength = 0.35, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== 'mouse') return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

type BtnProps = {
  children: ReactNode;
  variant?: 'dark' | 'light' | 'amber' | 'ghost';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants = {
  dark: 'bg-ink text-bg',
  light: 'bg-[#efebe5] text-[#1c1916]',
  amber: 'bg-ambre text-white',
  ghost: 'border border-current text-current',
};

/** Bouton magnétique avec remplissage qui monte au survol. */
export function MagneticButton({ children, variant = 'dark', className = '', ...rest }: BtnProps) {
  return (
    <Magnetic>
      <button
        {...rest}
        className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-transform active:scale-[0.97] disabled:opacity-50 ${variants[variant]} ${className}`}
      >
        <span
          aria-hidden
          className={`absolute inset-0 translate-y-full rounded-[50%] ${variant === 'amber' ? 'bg-[#1c1916]' : 'bg-ambre'} transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-hover:rounded-none group-disabled:hidden`}
        />
        <span className="relative z-10 inline-flex items-center gap-3 transition-colors duration-300 group-hover:text-white">{children}</span>
      </button>
    </Magnetic>
  );
}
