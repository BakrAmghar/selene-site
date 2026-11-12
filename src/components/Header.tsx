import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { lockScroll, scrollToTarget } from '../lib/motion';
import Logo from './Logo';
import Magnetic from './Magnetic';

export const NAV = [
  { id: 'collection', label: 'Collection' },
  { id: 'paraffine', label: 'Sans paraffine' },
  { id: 'atelier', label: 'L’atelier' },
  { id: 'quiz', label: 'Trouve ton parfum' },
];

export function useAnchorNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (id: string) => {
    if (pathname === '/') scrollToTarget(`#${id}`);
    else navigate(`/#${id}`);
  };
}

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#14110e' : '#EFEBE5');
    try {
      localStorage.setItem('selene-theme', dark ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }, [dark]);
  return [dark, () => setDark((d) => !d)] as const;
}

export default function Header() {
  const { count, open, bump } = useCart();
  const { pathname } = useLocation();
  const goTo = useAnchorNav();
  const [dark, toggleTheme] = useTheme();
  const [menu, setMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(pathname === '/');
  const cartCtl = useAnimationControls();

  useEffect(() => {
    let last = scrollY;
    const on = () => {
      const y = scrollY;
      setScrolled(y > 30);
      setHidden(y > last && y > 300);
      setOverHero(pathname === '/' && y < innerHeight - 90);
      last = y;
    };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, [pathname]);

  useEffect(() => {
    if (bump === 0) return;
    setHidden(false);
    cartCtl.start({ scale: [1, 1.45, 0.85, 1.12, 1], rotate: [0, -12, 10, -4, 0], transition: { duration: 0.7 } });
  }, [bump, cartCtl]);

  useEffect(() => {
    lockScroll(menu);
  }, [menu]);
  useEffect(() => setMenu(false), [pathname]);

  const light = overHero && !menu;
  const color = light ? 'text-[#efebe5]' : 'text-ink';

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-[120] transition-colors duration-500 ${color}`}
        animate={{ y: hidden && !menu ? '-110%' : '0%' }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      >
        <div
          className={`absolute inset-0 -z-10 transition-all duration-500 ${scrolled && !light && !menu ? 'bg-bg/75 backdrop-blur-xl border-b border-line' : 'border-b border-transparent'}`}
        />
        <div className="mx-auto grid h-20 max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8">
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex gap-7 text-[0.8rem] tracking-wide">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button onClick={() => goTo(n.id)} className="group relative py-2">
                    {n.label}
                    <span className="absolute bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Burger animé (mobile) */}
          <button
            className="relative z-10 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={menu ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menu}
            aria-controls="menu-mobile"
            onClick={() => setMenu((m) => !m)}
          >
            <span className="relative block h-3 w-6">
              <motion.span className="absolute left-0 top-0 h-[1.5px] w-full bg-current" animate={menu ? { top: '50%', rotate: 45 } : { top: '0%', rotate: 0 }} />
              <motion.span className="absolute bottom-0 left-0 h-[1.5px] w-full bg-current" animate={menu ? { bottom: '40%', rotate: -45, width: '100%' } : { bottom: '0%', rotate: 0, width: '65%' }} />
            </span>
          </button>

          <Link to="/" aria-label="SELENE, retour à l’accueil" className="justify-self-center">
            <Logo />
          </Link>

          <div className="flex items-center justify-self-end gap-1 sm:gap-3">
            <Magnetic>
              <button onClick={toggleTheme} className="flex h-11 w-11 items-center justify-center rounded-full" aria-label={dark ? 'Activer le mode clair' : 'Activer le mode sombre'}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.svg
                    key={dark ? 'moon' : 'sun'}
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  >
                    {dark ? (
                      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="4.2" />
                        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                      </>
                    )}
                  </motion.svg>
                </AnimatePresence>
              </button>
            </Magnetic>
            <Magnetic>
              <motion.button
                id="cart-icon"
                animate={cartCtl}
                onClick={open}
                className="relative flex h-11 items-center gap-2 rounded-full px-3"
                aria-label={`Ouvrir le panier, ${count} article${count > 1 ? 's' : ''}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" />
                  <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
                </svg>
                <span className="hidden text-[0.8rem] sm:inline">Panier</span>
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0, y: -6 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0 }}
                      className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ambre px-1 text-[0.65rem] font-semibold text-white"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </Magnetic>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="menu-mobile"
            className="fixed inset-0 z-[110] flex flex-col justify-between bg-wax px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: 'circle(0% at 8% 4%)' }}
            animate={{ clipPath: 'circle(150% at 8% 4%)' }}
            exit={{ clipPath: 'circle(0% at 8% 4%)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Menu mobile">
              <ul className="space-y-2">
                {NAV.map((n, i) => (
                  <li key={n.id} className="overflow-hidden">
                    <motion.button
                      onClick={() => {
                        setMenu(false);
                        setTimeout(() => goTo(n.id), 350);
                      }}
                      className="flex w-full items-baseline gap-4 py-1 text-left font-serif text-[2.6rem] leading-tight"
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '110%' }}
                      transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="font-sans text-xs text-ambre-text">0{i + 1}</span>
                      {n.label}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.p className="text-sm text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.7 } }} exit={{ opacity: 0 }}>
              Cire végétale · Mèche en coton · Coulée à la main
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
