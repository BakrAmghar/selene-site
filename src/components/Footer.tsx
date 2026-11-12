import { Link } from 'react-router-dom';
import { credits } from '../data/credits';
import { RevealText } from './Reveal';
import { NAV, useAnchorNav } from './Header';

export default function Footer() {
  const goTo = useAnchorNav();
  return (
    <footer className="relative overflow-hidden bg-[#14110e] px-4 pb-10 pt-24 text-[#efebe5] sm:px-8">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(208,138,85,.25),transparent)]" />
      <div className="relative mx-auto max-w-[1500px]">
        <RevealText as="p" mode="chars" text="SELENE" className="font-serif text-[22vw] leading-[0.8] tracking-[0.06em] text-[#efebe5]/90 lg:text-[17rem]" />
        <div className="mt-16 grid gap-12 border-t border-white/15 pt-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <p className="font-serif text-xl">Maison de bougies</p>
            <p className="mt-3 text-sm leading-relaxed text-[#efebe5]/75">
              Cire végétale, mèche en coton, pot réutilisable. Coulées à la main, en petites séries.
            </p>
          </div>
          <nav aria-label="Pied de page">
            <p className="mb-4 text-xs tracking-[0.25em] text-[#efebe5]/60">EXPLORER</p>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button onClick={() => goTo(n.id)} className="hover:text-[#e09a63]">
                    {n.label}
                  </button>
                </li>
              ))}
              <li>
                <Link to="/produit/fleur-d-oranger" className="hover:text-[#e09a63]">
                  Fleur d’oranger
                </Link>
              </li>
            </ul>
          </nav>
          <div>
            <p className="mb-4 text-xs tracking-[0.25em] text-[#efebe5]/60">PROMESSES</p>
            <ul className="space-y-2 text-sm text-[#efebe5]/85">
              <li>Livraison offerte dès 40 €</li>
              <li>Pots consignés &amp; réutilisables</li>
              <li>0 % paraffine, 100 % végétal</li>
              <li>Coulées à la main</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs tracking-[0.25em] text-[#efebe5]/60">CRÉDITS PHOTOS</p>
            <p className="text-xs leading-relaxed text-[#efebe5]/70">
              Photographies issues d’
              <a className="underline underline-offset-2" href="https://unsplash.com" target="_blank" rel="noreferrer">
                Unsplash
              </a>{' '}
              :{' '}
              {credits.map((c, i) => (
                <span key={c.file}>
                  <a href={c.url} target="_blank" rel="noreferrer" className="hover:text-[#e09a63]" title={c.subject}>
                    {c.author}
                  </a>
                  {i < credits.length - 1 ? ', ' : '.'}
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 text-xs text-[#efebe5]/55 sm:flex-row">
          <p>© {new Date().getFullYear()} SELENE — Prototype, aucun paiement réel.</p>
          <p>Fait avec patience, cire et lumière.</p>
        </div>
      </div>
    </footer>
  );
}
