import { useLayoutEffect, useRef } from 'react';
import { RevealText } from '../components/Reveal';
import { gsap, prefersReducedMotion } from '../lib/motion';

const POSTS = [
  { src: import.meta.env.BASE_URL + 'images/photophores-allumes.webp', alt: 'Dizaines de photophores allumés sur une table sombre', likes: 1284, size: 'h-[62vh] w-[46vh]' },
  { src: import.meta.env.BASE_URL + 'images/bouquet-sec.webp', alt: 'Bouquet de fleurs séchées et petites bougies dorées', likes: 932, size: 'h-[48vh] w-[36vh] self-end' },
  { src: import.meta.env.BASE_URL + 'images/bougie-ceramique.webp', alt: 'Petite bougie allumée dans une coupelle, lumière orangée', likes: 2051, size: 'h-[44vh] w-[58vh]' },
  { src: import.meta.env.BASE_URL + 'images/mer-de-bougies.webp', alt: 'Une mer de bougies chauffe-plat allumées', likes: 1760, size: 'h-[64vh] w-[44vh] self-end' },
  { src: import.meta.env.BASE_URL + 'images/flamme-nuit.webp', alt: 'Une flamme solitaire dans la nuit', likes: 845, size: 'h-[40vh] w-[60vh]' },
  { src: import.meta.env.BASE_URL + 'images/pots-ambres-fleurs.webp', alt: 'Pots ambrés et fleurs séchées près d’une fenêtre', likes: 1422, size: 'h-[58vh] w-[40vh] self-end' },
  { src: import.meta.env.BASE_URL + 'images/bougie-pilier-flamme.webp', alt: 'Bougie pilier orangée allumée sur fond noir', likes: 1103, size: 'h-[46vh] w-[66vh]' },
];

/** Galerie type Instagram : défilement horizontal piloté par le scroll vertical. */
export default function InstaGallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const distance = () => track.current!.scrollWidth - innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      // Chaque photo bascule légèrement selon sa position (effet de profondeur)
      gsap.utils.toArray<HTMLElement>('[data-post] img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -8, scale: 1.18 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-bg" aria-labelledby="titre-insta">
      <div className="flex h-[100svh] flex-col justify-center motion-reduce:h-auto motion-reduce:py-24">
        <div ref={track} className="flex w-max items-stretch gap-6 px-4 motion-reduce:w-full motion-reduce:overflow-x-auto sm:gap-10 sm:px-8">
          <div className="flex w-[80vw] max-w-md flex-none flex-col justify-center sm:w-[34rem] sm:max-w-none">
            <p className="text-[0.7rem] tracking-[0.35em] text-ambre-text">@SELENE.BOUGIES</p>
            <RevealText as="h2" text="Vos soirées, à la lueur de SELENE." className="mt-5 font-serif text-[clamp(2.4rem,5vw,4.6rem)] leading-[1]" />
            <p className="mt-6 max-w-sm text-muted">Partagez vos moments avec #lumièreselene : chaque mois, nous offrons un coffret découverte à une photo coup de cœur.</p>
            <p className="mt-8 flex items-center gap-3 text-sm">
              Faites défiler <span aria-hidden className="inline-block animate-pulse">→</span>
            </p>
          </div>
          {POSTS.map((p, i) => (
            <figure key={p.src} data-post className={`group relative flex-none overflow-hidden rounded-sm ${p.size} max-h-[70vh] max-w-[80vw]`}>
              <img src={p.src} alt={p.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              <figcaption className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-4 text-sm text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span>@selene.bougies</span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2 0 3.6 1.2 4.5 2.6.9-1.4 2.5-2.6 4.5-2.6 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z" />
                  </svg>
                  {p.likes.toLocaleString('fr-FR')}
                  <span className="sr-only">mentions j’aime</span>
                </span>
              </figcaption>
              <span aria-hidden className="absolute left-3 top-3 font-serif text-xs text-white/80">
                {String(i + 1).padStart(2, '0')}
              </span>
            </figure>
          ))}
          <div aria-hidden className="w-[10vw] flex-none" />
        </div>
      </div>
    </section>
  );
}
