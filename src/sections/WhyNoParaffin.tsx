import { useLayoutEffect, useRef } from 'react';
import { Counter, FadeUp, RevealImage, RevealText } from '../components/Reveal';
import { gsap, prefersReducedMotion } from '../lib/motion';

const COMPARE = [
  { label: 'Origine', paraffine: 'Résidu du raffinage du pétrole', vegetale: 'Colza et soja cultivés en Europe' },
  { label: 'Combustion', paraffine: 'Peut noircir les murs et dégager de la suie', vegetale: 'Flamme douce, combustion propre' },
  { label: 'Durée', paraffine: 'Brûle vite', vegetale: 'Brûle plus lentement et plus longtemps' },
  { label: 'Fin de vie', paraffine: 'Ressource fossile, non renouvelable', vegetale: 'Renouvelable et biodégradable' },
];

export default function WhyNoParaffin() {
  const root = useRef<HTMLElement>(null);

  // Gouttes de pétrole qui « se transforment » en feuilles : les lignes du tableau barrent la paraffine
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 82%', once: true } });
        tl.from(row, { opacity: 0, y: 30, duration: 0.8, ease: 'expo.out' })
          .from(row.querySelector('[data-strike]'), { scaleX: 0, duration: 0.7, ease: 'power3.inOut' }, '-=0.2')
          .from(row.querySelector('[data-veg]'), { opacity: 0, x: -20, duration: 0.7, ease: 'expo.out' }, '-=0.3');
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="paraffine" className="relative bg-bg px-4 py-28 sm:px-8 sm:py-40" aria-labelledby="titre-paraffine">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex items-center gap-4 text-[0.7rem] tracking-[0.35em] text-ambre-text">
          <span className="h-px w-10 bg-current" /> LE SAVIEZ-VOUS ?
        </div>
        <RevealText as="h2" mode="chars" text="Pourquoi sans paraffine ?" className="mt-6 font-serif text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.95]" />

        <div className="mt-16 grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <RevealImage
                src={import.meta.env.BASE_URL + 'images/flamme-macro.webp'}
                alt="Gros plan sur la flamme d’une bougie dans l’obscurité"
                className="aspect-[4/5] rounded-sm"
                parallax
              />
              <p className="mt-3 text-xs text-muted">Une flamme propre : ni fumée noire, ni suie.</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <RevealText
              as="p"
              mode="scrub"
              text="La plupart des bougies du commerce sont coulées dans de la paraffine, un résidu du raffinage du pétrole. Chez SELENE, nous utilisons uniquement de la cire végétale : elle vient des champs, pas des raffineries."
              className="font-serif text-[clamp(1.6rem,3.2vw,2.9rem)] leading-[1.2]"
            />

            <div className="mt-16 divide-y divide-line border-y border-line">
              <div className="hidden grid-cols-[8rem_1fr_1fr] gap-6 py-3 text-[0.7rem] tracking-[0.25em] text-muted sm:grid">
                <span />
                <span>PARAFFINE</span>
                <span className="text-ambre-text">CIRE VÉGÉTALE SELENE</span>
              </div>
              {COMPARE.map((c) => (
                <div key={c.label} data-row className="grid gap-2 py-6 sm:grid-cols-[8rem_1fr_1fr] sm:gap-6">
                  <span className="text-xs tracking-[0.2em] text-muted">{c.label.toUpperCase()}</span>
                  <span className="relative w-fit text-muted">
                    <span className="sr-only">Paraffine : </span>
                    {c.paraffine}
                    <span data-strike aria-hidden className="absolute left-0 top-1/2 h-px w-full origin-left bg-ink/60" />
                  </span>
                  <span data-veg className="font-medium">
                    <span className="sr-only">Cire végétale : </span>
                    <span aria-hidden className="mr-2 text-ambre">✦</span>
                    {c.vegetale}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
              {[
                { to: 50, suffix: ' h', label: 'de combustion pour la Classique' },
                { to: 100, suffix: ' %', label: 'cire d’origine végétale' },
                { to: 0, suffix: ' g', label: 'de paraffine ou de pétrole' },
                { to: 3, suffix: '', label: 'ingrédients : cire, coton, parfum' },
              ].map((s, i) => (
                <FadeUp key={s.label} delay={i * 0.1}>
                  <Counter to={s.to} suffix={s.suffix} className="block whitespace-nowrap font-serif text-[clamp(2.4rem,4.2vw,3.8rem)] leading-none tabular-nums" />
                  <p className="mt-3 text-sm text-muted">{s.label}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
