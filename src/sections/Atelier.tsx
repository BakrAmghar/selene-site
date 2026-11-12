import { useLayoutEffect, useRef } from 'react';
import { RevealImage, RevealText } from '../components/Reveal';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion';

const STEPS = [
  {
    n: '01',
    title: 'La fonte',
    text: 'Notre cire de colza et de soja est fondue doucement, au bain-marie, sans jamais dépasser 80 °C pour préserver sa texture crémeuse.',
    img: import.meta.env.BASE_URL + 'images/cire-fondue.webp',
    alt: 'Cire fondue autour d’une flamme, en gros plan',
  },
  {
    n: '02',
    title: 'Le parfum',
    text: 'Nous incorporons nos huiles parfumées de Grasse à la bonne température, puis nous mélangeons lentement pendant deux minutes.',
    img: import.meta.env.BASE_URL + 'images/pots-ambres-fleurs.webp',
    alt: 'Pots en verre ambré et bouquet de fleurs séchées dans une lumière douce',
  },
  {
    n: '03',
    title: 'La coulée',
    text: 'Chaque pot est coulé à la main autour d’une mèche en coton tressé, centrée avec soin pour une flamme régulière.',
    img: import.meta.env.BASE_URL + 'images/meche-coton.webp',
    alt: 'Mèche en coton tressé et sa flamme orangée',
  },
  {
    n: '04',
    title: 'La cure',
    text: 'Les bougies reposent deux semaines à l’abri de la lumière. Le temps que la cire et le parfum ne fassent plus qu’un.',
    img: import.meta.env.BASE_URL + 'images/plaid-bougie.webp',
    alt: 'Bougie en pot posée sur un plaid en laine dans un intérieur chaleureux',
  },
];

export default function Atelier() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // La ligne se dessine au rythme du scroll
      gsap.fromTo('[data-line]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 65%', end: 'bottom 65%', scrub: 0.6 } });
      // Les pastilles s'allument quand la ligne les atteint
      gsap.utils.toArray<HTMLElement>('[data-dot]').forEach((dot) => {
        ScrollTrigger.create({
          trigger: dot,
          start: 'top 65%',
          onEnter: () => dot.classList.add('lit'),
          onLeaveBack: () => dot.classList.remove('lit'),
        });
      });
      gsap.utils.toArray<HTMLElement>('[data-step-text]').forEach((el) => {
        gsap.from(el.children, { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 80%', once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="atelier" className="relative bg-bg px-4 py-28 sm:px-8 sm:py-40" aria-labelledby="titre-atelier">
      <div className="mx-auto max-w-[1300px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[0.7rem] tracking-[0.35em] text-ambre-text">L’ATELIER</p>
          <RevealText as="h2" text="Quatre gestes, deux semaines de patience." className="mt-5 font-serif text-[clamp(2.4rem,6vw,5.5rem)] leading-[1]" />
        </div>

        <div data-steps className="relative mt-24">
          {/* Ligne centrale (desktop) ou à gauche (mobile) */}
          <div aria-hidden className="absolute left-[11px] top-0 h-full w-[2px] bg-line md:left-1/2 md:-translate-x-1/2">
            <div data-line className="h-full w-full origin-top bg-ambre shadow-[0_0_12px_rgba(var(--glow),.8)]" />
          </div>

          <ol className="space-y-24 md:space-y-36">
            {STEPS.map((s, i) => (
              <li key={s.n} className="relative grid items-center gap-8 pl-12 md:grid-cols-2 md:gap-24 md:pl-0">
                <span data-dot aria-hidden className="step-dot absolute left-0 top-2 z-10 h-6 w-6 rounded-full border-2 border-ambre bg-bg md:left-1/2 md:top-1/2 md:-ml-3 md:-mt-3" />
                <div className={i % 2 ? 'md:order-2' : ''}>
                  <RevealImage src={s.img} alt={s.alt} className="aspect-[4/3] rounded-sm" direction={i % 2 ? 'left' : 'right'} parallax />
                </div>
                <div data-step-text className={i % 2 ? 'md:order-1 md:text-right' : ''}>
                  <p className="font-serif text-6xl text-ambre md:text-8xl">{s.n}</p>
                  <h3 className="mt-4 font-serif text-3xl md:text-4xl">{s.title}</h3>
                  <p className={`mt-4 max-w-md leading-relaxed text-muted ${i % 2 ? 'md:ml-auto' : ''}`}>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
