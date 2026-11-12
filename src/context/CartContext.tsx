import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { FORMATS, FREE_SHIPPING, getProduct, priceFor, type FormatId } from '../data/products';
import { prefersReducedMotion } from '../lib/motion';

export type CartLine = { slug: string; format: FormatId; qty: number };
export type DetailedLine = CartLine & { key: string; name: string; image: string; formatLabel: string; unit: number; total: number };

export const PROMO_CODE = 'BIENVENUE15';
const STORAGE_KEY = 'selene-panier';
const PROMO_KEY = 'selene-promo';

type CartCtx = {
  lines: DetailedLine[];
  count: number;
  subtotal: number;
  discount: number;
  promo: string | null;
  isOpen: boolean;
  bump: number;
  open: () => void;
  close: () => void;
  add: (slug: string, format: FormatId, qty?: number, sourceImg?: HTMLElement | null) => void;
  setQty: (slug: string, format: FormatId, qty: number) => void;
  remove: (slug: string, format: FormatId) => void;
  clear: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Fait voler une copie de l'image du produit jusqu'à l'icône du panier. */
function flyToCart(source: HTMLElement, onLand: () => void) {
  const target = document.getElementById('cart-icon');
  if (!target || prefersReducedMotion()) return onLand();
  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const img = source instanceof HTMLImageElement ? source : source.querySelector('img');
  const ghost = document.createElement('div');
  const size = Math.min(from.width, from.height, 220);
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${from.left + from.width / 2 - size / 2}px`,
    top: `${from.top + from.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundImage: img ? `url(${img.currentSrc || img.src})` : '',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 20px 60px -10px rgba(154,95,52,.6)',
    zIndex: '200',
    pointerEvents: 'none',
  });
  document.body.appendChild(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  // Trajectoire en arc : point intermédiaire au-dessus de la ligne droite
  const anim = ghost.animate(
    [
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 140}px) scale(.55)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.08)`, opacity: 0.6 },
    ],
    { duration: 900, easing: 'cubic-bezier(.55,0,.35,1)' },
  );
  anim.onfinish = () => {
    ghost.remove();
    onLand();
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>(() => load(STORAGE_KEY, []));
  const [promo, setPromo] = useState<string | null>(() => load(PROMO_KEY, null));
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* stockage indisponible : le panier reste en mémoire */
    }
  }, [raw]);
  useEffect(() => {
    try {
      localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
    } catch {
      /* idem */
    }
  }, [promo]);

  const lines = useMemo<DetailedLine[]>(
    () =>
      raw.flatMap((l) => {
        const p = getProduct(l.slug);
        if (!p) return [];
        const unit = priceFor(p, l.format);
        const f = FORMATS.find((x) => x.id === l.format)!;
        return [{ ...l, key: `${l.slug}-${l.format}`, name: p.name, image: p.image, formatLabel: `${f.label} · ${f.detail}`, unit, total: unit * l.qty }];
      }),
    [raw],
  );

  const subtotal = lines.reduce((s, l) => s + l.total, 0);
  const discount = promo ? Math.round(subtotal * 0.15 * 100) / 100 : 0;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const add = useCallback<CartCtx['add']>((slug, format, qty = 1, sourceImg) => {
    const commit = () => {
      setRaw((prev) => {
        const i = prev.findIndex((l) => l.slug === slug && l.format === format);
        if (i === -1) return [...prev, { slug, format, qty }];
        const next = [...prev];
        next[i] = { ...next[i], qty: Math.min(99, next[i].qty + qty) };
        return next;
      });
      setBump((b) => b + 1);
    };
    if (sourceImg) flyToCart(sourceImg, commit);
    else commit();
  }, []);

  const setQty = useCallback((slug: string, format: FormatId, qty: number) => {
    setRaw((prev) =>
      qty <= 0 ? prev.filter((l) => !(l.slug === slug && l.format === format)) : prev.map((l) => (l.slug === slug && l.format === format ? { ...l, qty: Math.min(99, qty) } : l)),
    );
  }, []);

  const value: CartCtx = {
    lines,
    count,
    subtotal,
    discount,
    promo,
    isOpen,
    bump,
    open: () => setOpen(true),
    close: () => setOpen(false),
    add,
    setQty,
    remove: (slug, format) => setQty(slug, format, 0),
    clear: () => {
      setRaw([]);
      setPromo(null);
    },
    applyPromo: (code) => {
      const ok = code.trim().toUpperCase() === PROMO_CODE;
      if (ok) setPromo(PROMO_CODE);
      return ok;
    },
    removePromo: () => setPromo(null),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart doit être utilisé dans CartProvider');
  return c;
}

export function shippingCost(mode: 'relais' | 'domicile' | 'express', subtotalAfterDiscount: number) {
  const free = subtotalAfterDiscount >= FREE_SHIPPING;
  if (mode === 'express') return 8.9;
  if (free) return 0;
  return mode === 'relais' ? 3.9 : 4.9;
}
