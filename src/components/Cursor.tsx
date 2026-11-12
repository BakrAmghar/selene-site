import { useEffect, useRef } from 'react';

/** Halo lumineux qui suit la souris et grossit sur les éléments interactifs. */
export default function Cursor() {
  const halo = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('has-cursor');

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const cur = { ...pos };
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let raf = 0;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        cur.x = pos.x;
        cur.y = pos.y;
        halo.current!.style.opacity = '1';
        dot.current!.style.opacity = '1';
      }
      const t = e.target as HTMLElement;
      const interactive = t.closest('a, button, [role="button"], input, select, textarea, label, [data-cursor]');
      targetScale = interactive ? (t.closest('[data-cursor="big"]') ? 4.2 : 2.6) : 1;
    };
    const leave = () => {
      visible = false;
      halo.current!.style.opacity = '0';
      dot.current!.style.opacity = '0';
    };
    const down = () => (targetScale *= 0.8);
    const up = () => (targetScale /= 0.8);

    const loop = () => {
      const k = reduced ? 1 : 0.18;
      cur.x += (pos.x - cur.x) * k;
      cur.y += (pos.y - cur.y) * k;
      scale += (targetScale - scale) * (reduced ? 1 : 0.15);
      halo.current!.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      dot.current!.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    addEventListener('pointermove', move, { passive: true });
    addEventListener('pointerdown', down);
    addEventListener('pointerup', up);
    document.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('pointermove', move);
      removeEventListener('pointerdown', down);
      removeEventListener('pointerup', up);
      document.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div
        ref={halo}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[400] h-9 w-9 rounded-full border border-ambre/50 opacity-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(255,196,128,.45) 0%, rgba(232,150,80,.22) 45%, rgba(208,138,85,0) 72%)',
          boxShadow: '0 0 24px 4px rgba(255,170,90,.25)',
          willChange: 'transform',
        }}
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[401] h-1.5 w-1.5 rounded-full bg-ambre opacity-0 transition-opacity duration-300"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
