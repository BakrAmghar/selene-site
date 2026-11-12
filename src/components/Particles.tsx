import { useEffect, useRef } from 'react';

type P = { x: number; y: number; r: number; vx: number; vy: number; life: number; max: number; kind: 'ember' | 'smoke'; phase: number };

/** Particules de lumière (braises) et volutes de fumée qui flottent doucement. Canvas 2D. */
export default function Particles({ className = '', density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, running = true;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const parts: P[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const target = Math.round(Math.min(90, (w * h) / 16000) * density);
    const spawn = (initial = false): P => {
      const smoke = Math.random() < 0.18;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 20,
        r: smoke ? 40 + Math.random() * 70 : 0.6 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(smoke ? 0.15 + Math.random() * 0.25 : 0.25 + Math.random() * 0.7),
        life: initial ? Math.random() * 600 : 0,
        max: 500 + Math.random() * 500,
        kind: smoke ? 'smoke' : 'ember',
        phase: Math.random() * Math.PI * 2,
      };
    };
    for (let i = 0; i < target; i++) parts.push(spawn(true));

    // Sprite de braise pré-rendu (plus rapide qu'un dégradé par particule)
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const s = sprite.getContext('2d')!;
    const g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,236,200,1)');
    g.addColorStop(0.25, 'rgba(255,190,110,.8)');
    g.addColorStop(1, 'rgba(255,150,60,0)');
    s.fillStyle = g;
    s.fillRect(0, 0, 64, 64);

    let t = 0;
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.life += 1;
        p.x += p.vx + Math.sin(t * 0.01 + p.phase) * 0.25;
        p.y += p.vy;
        const k = p.life / p.max;
        const fade = Math.sin(Math.min(1, k) * Math.PI);
        if (p.kind === 'smoke') {
          ctx.globalCompositeOperation = 'source-over';
          const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * (1 + k));
          gr.addColorStop(0, `rgba(239,235,229,${0.05 * fade})`);
          gr.addColorStop(1, 'rgba(239,235,229,0)');
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * (1 + k), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalCompositeOperation = 'lighter';
          const flick = 0.6 + 0.4 * Math.sin(t * 0.15 + p.phase);
          ctx.globalAlpha = fade * flick;
          const size = p.r * 10;
          ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
          ctx.globalAlpha = 1;
        }
        if (p.life > p.max || p.y < -120) Object.assign(p, spawn());
      }
      ctx.globalCompositeOperation = 'source-over';
      if (running) raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      draw();
      running = false;
    } else raf = requestAnimationFrame(draw);

    // Pause quand le canvas sort de l'écran (performance)
    const io = new IntersectionObserver(([e]) => {
      if (reduced) return;
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(draw);
      } else if (!e.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} />;
}
