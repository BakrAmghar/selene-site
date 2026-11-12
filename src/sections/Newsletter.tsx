import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { MagneticButton } from '../components/Magnetic';
import Particles from '../components/Particles';
import { RevealText } from '../components/Reveal';
import { PROMO_CODE, useCart } from '../context/CartContext';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [applied, setApplied] = useState(false);
  const { applyPromo } = useCart();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Merci d’indiquer une adresse e-mail valide.');
      return;
    }
    setError('');
    setDone(true);
  };

  return (
    <section className="relative overflow-hidden bg-[#14110e] px-4 py-28 text-[#efebe5] sm:px-8 sm:py-36" aria-labelledby="titre-newsletter">
      <img src={import.meta.env.BASE_URL + 'images/photophores-allumes.webp'} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,#14110e_75%)]" />
      <Particles className="absolute inset-0 h-full w-full" density={0.5} />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-[0.7rem] tracking-[0.35em] text-[#e09a63]">LA LETTRE SELENE</p>
        <h2 id="titre-newsletter" className="mt-6 font-serif leading-[0.95]">
          <RevealText as="span" text="−15 %" className="block text-[clamp(4.5rem,16vw,12rem)] text-[#f0c393]" />
          <RevealText as="span" text="sur votre première commande" className="mt-2 block text-[clamp(1.6rem,3.6vw,3rem)] italic" delay={0.2} />
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[#efebe5]/75">Nouveaux parfums, coulisses de l’atelier et ventes privées. Une lettre par mois, jamais plus.</p>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.form key="form" onSubmit={submit} noValidate className="mx-auto mt-10 max-w-lg" exit={{ opacity: 0, y: -20 }}>
              <div className="flex flex-col gap-4 rounded-full sm:flex-row sm:items-center sm:border sm:border-white/25 sm:p-1.5 sm:pl-6">
                <label htmlFor="nl-email" className="sr-only">
                  Adresse e-mail
                </label>
                <input
                  id="nl-email"
                  type="email"
                  autoComplete="email"
                  placeholder="votre@email.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'nl-err' : undefined}
                  className="min-w-0 flex-1 rounded-full border border-white/25 bg-transparent px-6 py-4 text-[#efebe5] placeholder:text-white/45 focus:outline-none sm:border-0 sm:px-0 sm:py-2"
                />
                <MagneticButton type="submit" variant="light">
                  Je m’inscris
                </MagneticButton>
              </div>
              {error && (
                <p id="nl-err" role="alert" className="mt-3 text-sm text-[#f0a37a]">
                  {error}
                </p>
              )}
            </motion.form>
          ) : (
            <motion.div key="ok" className="mx-auto mt-10 max-w-md" initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} role="status">
              <p className="text-lg">Bienvenue dans la maison ✦</p>
              <p className="mt-2 text-sm text-white/70">Voici votre code de bienvenue :</p>
              <motion.p
                className="mx-auto mt-4 w-fit rounded-full border border-dashed border-[#d08a55] px-8 py-3 font-serif text-3xl tracking-[0.2em]"
                initial={{ letterSpacing: '0.6em', opacity: 0 }}
                animate={{ letterSpacing: '0.2em', opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                {PROMO_CODE}
              </motion.p>
              <button
                onClick={() => setApplied(applyPromo(PROMO_CODE))}
                disabled={applied}
                className="mt-5 text-sm underline underline-offset-4 disabled:no-underline disabled:opacity-80"
              >
                {applied ? '✓ Code appliqué à votre panier' : 'Appliquer à mon panier'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
