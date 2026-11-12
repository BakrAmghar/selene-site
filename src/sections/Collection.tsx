import { useLayoutEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { RevealText } from '../components/Reveal';
import { products } from '../data/products';
import { gsap, prefersReducedMotion } from '../lib/motion';

export default function Collection() {
  const root = useRef<HTMLElement>(null);

  // Parallaxe : chaque colonne défile à sa propre vitesse (desktop uniquement)
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const speeds = [-40, 60, -10];
      gsap.utils.toArray<HTMLElement>('[data-col]', root.current).forEach((col, i) => {
        gsap.fromTo(col, { y: -speeds[i] }, { y: speeds[i], ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);

  const cols = [0, 1, 2].map((c) => products.filter((_, i) => i % 3 === c));

  return (
    <section ref={root} id="collection" className="relative overflow-hidden bg-bg-soft px-4 py-28 sm:px-8 sm:py-40" aria-labelledby="titre-collection">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-20 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[0.7rem] tracking-[0.35em] text-ambre-text">LA COLLECTION — 06 PARFUMS</p>
            <h2 id="titre-collection" className="mt-5 font-serif text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.95]">
              <RevealText as="span" text="Six parfums," className="block" />
              <RevealText as="span" text="une même lumière." className="block italic text-ambre" delay={0.15} />
            </h2>
          </div>
          <RevealText
            as="p"
            text="Floraux, frais, gourmands : les familles que vous préférez, d’après notre sondage. Et deux signatures marocaines, nées de nos souvenirs."
            className="max-w-sm text-muted"
          />
        </div>

        {/* Mobile / tablette : grille simple */}
        <div className="grid gap-14 sm:grid-cols-2 lg:hidden">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>

        {/* Desktop : trois colonnes en parallaxe */}
        <div className="hidden grid-cols-3 gap-10 lg:grid xl:gap-16">
          {cols.map((col, c) => (
            <div key={c} data-col className={`space-y-24 ${c === 1 ? 'pt-32' : ''}`}>
              {col.map((p) => (
                <ProductCard key={p.slug} product={p} index={products.indexOf(p)} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
