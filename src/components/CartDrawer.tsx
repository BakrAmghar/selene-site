import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { euro, FREE_SHIPPING } from '../data/products';
import { lockScroll } from '../lib/motion';
import { MagneticButton } from './Magnetic';

export default function CartDrawer() {
  const { isOpen, close, lines, subtotal, discount, setQty, remove } = useCart();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const total = subtotal - discount;
  const left = Math.max(0, FREE_SHIPPING - total);
  const progress = Math.min(1, total / FREE_SHIPPING);

  useEffect(() => {
    lockScroll(isOpen);
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    addEventListener('keydown', onKey);
    return () => {
      removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150]">
          <motion.div
            className="absolute inset-0 bg-[#1c1916]/45 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-panier"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bg shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 id="titre-panier" className="font-serif text-2xl">
                Votre panier
              </h2>
              <button ref={closeBtn} onClick={close} className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-bg-soft" aria-label="Fermer le panier">
                <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M2 2l12 12M14 2L2 14" />
                </svg>
              </button>
            </div>

            {/* Barre de livraison offerte */}
            <div className="px-6 py-4 text-sm">
              <p className="mb-2 text-muted" aria-live="polite">
                {left > 0 ? (
                  <>
                    Plus que <strong className="text-ink">{euro(left)}</strong> pour la livraison offerte
                  </>
                ) : (
                  <>✦ La livraison vous est offerte</>
                )}
              </p>
              <div className="h-1 overflow-hidden rounded-full bg-bg-soft">
                <motion.div className="h-full origin-left rounded-full bg-ambre" initial={{ scaleX: 0 }} animate={{ scaleX: progress }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <motion.div className="flex h-full flex-col items-center justify-center text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}>
                  <svg width="44" height="70" viewBox="0 0 64 100" className="mb-6 opacity-70" aria-hidden>
                    <rect x="31" y="56" width="2" height="12" fill="currentColor" />
                    <rect x="14" y="68" width="36" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <p className="font-serif text-2xl">Votre panier est vide</p>
                  <p className="mt-2 text-sm text-muted">Une bougie attend d’être allumée.</p>
                  <Link to="/#collection" onClick={close} className="mt-6 text-sm underline underline-offset-4">
                    Découvrir la collection
                  </Link>
                </motion.div>
              ) : (
                <ul className="divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {lines.map((l, i) => (
                      <motion.li
                        key={l.key}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.15 + i * 0.05 } }}
                        exit={{ opacity: 0, x: 60, height: 0, paddingTop: 0, paddingBottom: 0 }}
                        className="flex gap-4 overflow-hidden py-5"
                      >
                        <img src={l.image} alt="" className="h-24 w-20 flex-none rounded-md object-cover" loading="lazy" />
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <p className="font-serif text-lg leading-tight">{l.name}</p>
                            <p className="text-sm tabular-nums">{euro(l.total)}</p>
                          </div>
                          <p className="text-xs text-muted">{l.formatLabel}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-line">
                              <button className="h-8 w-8" onClick={() => setQty(l.slug, l.format, l.qty - 1)} aria-label={`Retirer un ${l.name}`}>
                                −
                              </button>
                              <span className="w-6 text-center text-sm tabular-nums" aria-label={`Quantité ${l.qty}`}>
                                {l.qty}
                              </span>
                              <button className="h-8 w-8" onClick={() => setQty(l.slug, l.format, l.qty + 1)} aria-label={`Ajouter un ${l.name}`}>
                                +
                              </button>
                            </div>
                            <button onClick={() => remove(l.slug, l.format)} className="text-xs text-muted underline underline-offset-4 hover:text-ink">
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line px-6 py-6">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Sous-total</span>
                    <span className="tabular-nums">{euro(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-ambre-text">
                      <span>Bienvenue −15 %</span>
                      <span className="tabular-nums">−{euro(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 font-serif text-xl">
                    <span>Total</span>
                    <span className="tabular-nums">{euro(total)}</span>
                  </div>
                </div>
                <MagneticButton
                  className="mt-5 w-full"
                  onClick={() => {
                    close();
                    navigate('/commande');
                  }}
                >
                  Passer commande <span aria-hidden>→</span>
                </MagneticButton>
                <p className="mt-3 text-center text-xs text-muted">Paiement 100 % simulé — prototype</p>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
