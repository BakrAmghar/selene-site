import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main id="contenu" className="flex min-h-[80svh] flex-col items-center justify-center px-4 pt-24 text-center">
      <svg width="40" height="64" viewBox="0 0 64 100" aria-hidden className="mb-6 text-muted">
        <path d="M32 40c3 6 6 9 6 14a6 6 0 0 1-12 0c0-5 3-8 6-14z" fill="none" stroke="currentColor" strokeDasharray="3 3" />
        <rect x="31" y="60" width="2" height="10" fill="currentColor" />
        <rect x="16" y="70" width="32" height="26" rx="3" fill="none" stroke="currentColor" />
      </svg>
      <h1 className="font-serif text-6xl">Flamme éteinte</h1>
      <p className="mt-4 text-muted">Cette page n’existe pas, ou elle s’est envolée en fumée.</p>
      <Link to="/" className="mt-8 underline underline-offset-4">
        Revenir à l’accueil
      </Link>
    </main>
  );
}
