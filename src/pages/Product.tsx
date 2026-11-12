import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MagneticButton } from '../components/Magnetic';
import ProductCard from '../components/ProductCard';
import { FadeUp, RevealText } from '../components/Reveal';
import { useCart } from '../context/CartContext';
import { euro, FORMATS, getProduct, priceFor, products, type FormatId } from '../data/products';
import NotFound from './NotFound';

const ease = [0.22, 1, 0.36, 1] as const;

/** Grande photo avec zoom : suit la souris au survol, bascule au toucher. */
function ZoomImage({ src, alt, tint }: { src: string; alt: string; tint: string }) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const ref = useRef<HTMLDivElement>(null);
  const setFrom = (x: number, y: number) => {
    const r = ref.current!.getBoundingClientRect();
    setOrigin(`${((x - r.left) / r.width) * 100}% ${((y - r.top) / r.height) * 100}%`);
  };
  return (
    <motion.div
      ref={ref}
      className="relative aspect-[4/5] overflow-hidden rounded-sm bg-bg-soft lg:aspect-auto lg:h-[calc(100svh-7rem)]"
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
      onPointerMove={(e) => e.pointerType === 'mouse' && setFrom(e.clientX, e.clientY)}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setZoom(true)}
      onPointerLeave={() => setZoom(false)}
      data-cursor="big"
    >
      <motion.img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={{ transformOrigin: origin }}
        initial={{ scale: 1.3 }}
        animate={{ scale: zoom ? 2 : 1 }}
        transition={{ duration: zoom ? 0.6 : 1.4, ease }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: `radial-gradient(circle at 50% 80%, ${tint}66, transparent 65%)` }} />
      <button
        onClick={(e) => {
          setFrom(e.clientX, e.clientY);
          setZoom((z) => !z);
        }}
        className="absolute bottom-4 right-4 flex h-11 items-center gap-2 rounded-full bg-[#efebe5]/90 px-4 text-xs text-[#1c1916] backdrop-blur"
        aria-pressed={zoom}
        aria-label={zoom ? 'Dézoomer la photo' : 'Zoomer sur la photo'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
          {!zoom && <path d="M11 8v6M8 11h6" />}
          {zoom && <path d="M8 11h6" />}
        </svg>
        {zoom ? 'Dézoomer' : 'Zoom'}
      </button>
    </motion.div>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const [format, setFormat] = useState<FormatId>('classique');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) document.title = `${product.name} — SELENE`;
  }, [product]);

  if (!product) return <NotFound />;

  const price = priceFor(product, format);
  const fmt = FORMATS.find((f) => f.id === format)!;
  const others = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  const onAdd = () => {
    add(product.slug, format, qty, imgRef.current);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <main id="contenu" className="pt-24">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div ref={imgRef} className="lg:sticky lg:top-24 lg:col-span-7 lg:self-start">
          <ZoomImage src={product.image} alt={product.alt} tint={product.tint} />
        </div>

        <div className="pb-10 lg:col-span-5 lg:pt-10">
          <motion.nav aria-label="Fil d’Ariane" className="text-xs text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }}>
            <Link to="/" className="hover:text-ink">
              Accueil
            </Link>{' '}
            /{' '}
            <Link to="/#collection" className="hover:text-ink">
              Collection
            </Link>{' '}
            / <span aria-current="page">{product.name}</span>
          </motion.nav>

          <motion.p className="mt-8 text-[0.7rem] tracking-[0.35em] text-ambre-text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}>
            {product.familyLabel.toUpperCase()} · {product.mood.toUpperCase()}
          </motion.p>
          <h1 className="mt-4 font-serif text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.95]">
            <span className="line-mask">
              <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.75, duration: 1.1, ease }}>
                {product.name}
              </motion.span>
            </span>
          </h1>
          <motion.p className="mt-4 font-serif text-xl italic text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1 } }}>
            « {product.tagline} »
          </motion.p>

          <div className="mt-8 flex items-baseline gap-3" aria-live="polite">
            <AnimatePresence mode="popLayout">
              <motion.span key={price} className="font-serif text-4xl tabular-nums" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                {euro(price)}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm text-muted">TTC · {fmt.burn}</span>
          </div>

          <FadeUp className="mt-8 leading-relaxed text-muted">
            <p>{product.description}</p>
          </FadeUp>

          {/* Choix du format */}
          <fieldset className="mt-10">
            <legend className="mb-3 text-xs tracking-[0.25em] text-muted">FORMAT</legend>
            <div className="grid grid-cols-3 gap-2" role="radiogroup">
              {FORMATS.map((f) => {
                const active = f.id === format;
                return (
                  <button
                    key={f.id}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setFormat(f.id)}
                    className={`relative rounded-xl border px-3 py-4 text-left transition-colors ${active ? 'border-transparent text-bg' : 'border-line hover:border-ink'}`}
                  >
                    {active && <motion.span layoutId="format-pill" className="absolute inset-0 rounded-xl bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    <span className="relative block text-sm font-medium">{f.label}</span>
                    <span className={`relative block text-xs ${active ? 'opacity-75' : 'text-muted'}`}>
                      {f.detail} · {euro(priceFor(product, f.id))}
                    </span>
                  </button>
                );
              })}
            </div>
            {format === 'coffret' && (
              <motion.p className="mt-3 text-xs text-muted" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                Le coffret réunit ce parfum et deux autres minis de la collection, dans une boîte en carton recyclé.
              </motion.p>
            )}
          </fieldset>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex h-14 items-center rounded-full border border-line">
              <button className="h-full w-12" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuer la quantité">
                −
              </button>
              <span className="w-8 text-center tabular-nums" aria-live="polite" aria-label={`Quantité : ${qty}`}>
                {qty}
              </span>
              <button className="h-full w-12" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Augmenter la quantité">
                +
              </button>
            </div>
            <MagneticButton onClick={onAdd} className="flex-1 sm:flex-none">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={added ? 'ok' : 'add'} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
                  {added ? '✓ Ajouté au panier' : `Ajouter au panier — ${euro(price * qty)}`}
                </motion.span>
              </AnimatePresence>
            </MagneticButton>
          </div>
          <p className="mt-4 text-xs text-muted">Livraison offerte dès 40 € · Expédition sous 48 h</p>

          {/* Notes olfactives */}
          <section className="mt-14" aria-labelledby="titre-notes">
            <h2 id="titre-notes" className="text-xs tracking-[0.25em] text-muted">
              NOTES OLFACTIVES
            </h2>
            <FadeUp y={30}>
            <ol className="mt-5 space-y-0 border-t border-line">
              {(
                [
                  ['Tête', 'Les premières minutes', product.notes.tete],
                  ['Cœur', 'L’âme du parfum', product.notes.coeur],
                  ['Fond', 'Ce qui reste dans la pièce', product.notes.fond],
                ] as const
              ).map(([label, hint, notes]) => (
                  <li key={label} className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-b border-line py-5">
                    <div>
                      <p className="font-serif text-2xl">{label}</p>
                      <p className="text-[0.7rem] text-muted">{hint}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {notes.map((n) => (
                        <span key={n} className="rounded-full bg-ambre-soft px-3 py-1 text-sm">
                          {n}
                        </span>
                      ))}
                    </div>
                  </li>
              ))}
            </ol>
            </FadeUp>
          </section>

          <section className="mt-12 grid grid-cols-3 gap-4 text-center text-xs text-muted" aria-label="Engagements">
            {[
              ['🌾', 'Cire de colza & soja'],
              ['🧵', 'Mèche 100 % coton'],
              ['♻️', 'Pot réutilisable'],
            ].map(([ico, t]) => (
              <div key={t} className="rounded-xl border border-line px-2 py-4">
                <span aria-hidden className="block text-xl">
                  {ico}
                </span>
                <span className="mt-2 block">{t}</span>
              </div>
            ))}
          </section>
        </div>
      </div>

      <section className="mx-auto mt-24 max-w-[1500px] px-4 pb-32 sm:px-8" aria-label="Vous aimerez aussi">
        <RevealText as="h2" text="Vous aimerez aussi" className="font-serif text-4xl sm:text-5xl" />
        <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
