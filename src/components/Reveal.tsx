import { createElement, useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

type TextProps = {
  text: string;
  as?: Tag;
  className?: string;
  /** words / chars : apparition au passage ; scrub : les mots s'allument au rythme du scroll */
  mode?: 'words' | 'chars' | 'scrub';
  delay?: number;
  stagger?: number;
};

/** Texte qui se révèle mot par mot ou lettre par lettre au scroll. */
export function RevealText({ text, as = 'p', className = '', mode = 'words', delay = 0, stagger }: TextProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll<HTMLElement>('[data-r]');
      if (mode === 'scrub') {
        gsap.fromTo(
          items,
          { opacity: 0.12 },
          { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
        );
      } else {
        gsap.from(items, {
          yPercent: 110,
          rotate: mode === 'chars' ? 8 : 3,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          delay,
          stagger: stagger ?? (mode === 'chars' ? 0.025 : 0.05),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      }
    }, el);
    return () => ctx.revert();
  }, [mode, delay, stagger, text]);

  const words = text.split(' ');
  const content = words.map((w, i) => (
    <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-top" aria-hidden>
      {mode === 'chars' ? (
        w.split('').map((c, j) => (
          <span key={j} data-r className="inline-block will-change-transform">
            {c}
          </span>
        ))
      ) : (
        <span data-r className="inline-block will-change-transform">
          {w}
        </span>
      )}
      {i < words.length - 1 && ' '}
    </span>
  ));

  return createElement(as, { ref, className, 'aria-label': text }, content);
}

type ImgProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  direction?: 'up' | 'left' | 'right';
  parallax?: boolean;
  eager?: boolean;
  children?: ReactNode;
};

/** Image révélée par un masque (clip-path) avec un léger dézoom. */
export function RevealImage({ src, alt, className = '', imgClassName = '', direction = 'up', parallax = false, eager = false, children }: ImgProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const img = el.querySelector('img');
    const from = { up: 'inset(100% 0% 0% 0%)', left: 'inset(0% 100% 0% 0%)', right: 'inset(0% 0% 0% 100%)' }[direction];
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      gsap.fromTo(img, { scale: 1.35 }, { scale: 1.08, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      if (parallax) {
        gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      }
    }, el);
    return () => ctx.revert();
  }, [direction, parallax]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`h-full w-full object-cover ${imgClassName}`} />
      {children}
    </div>
  );
}

/** Compteur animé (ex. 50 h de combustion). */
export function Counter({ to, suffix = '', prefix = '', className = '', duration = 2 }: { to: number; suffix?: string; prefix?: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${prefix}${to}${suffix}`;
      return;
    }
    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: to,
        duration,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => (el.textContent = `${prefix}${Math.round(obj.v)}${suffix}`),
      });
    });
    return () => ctx.revert();
  }, [to, suffix, prefix, duration]);
  return (
    <span ref={ref} className={className} aria-label={`${prefix}${to}${suffix}`}>
      {prefix}0{suffix}
    </span>
  );
}

/** Apparition douce générique (fondu + montée) au scroll. */
export function FadeUp({ children, className = '', delay = 0, y = 40 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(el, { y, opacity: 0, duration: 1.2, delay, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    return () => ctx.revert();
  }, [delay, y]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
