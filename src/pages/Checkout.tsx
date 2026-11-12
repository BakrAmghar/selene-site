import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagneticButton } from '../components/Magnetic';
import { shippingCost, useCart } from '../context/CartContext';
import { euro, FREE_SHIPPING } from '../data/products';
import { scrollToTarget } from '../lib/motion';

type Ship = 'relais' | 'domicile' | 'express';
const STEPS = ['Coordonnées', 'Livraison', 'Paiement'];
const SHIP_OPTIONS: { id: Ship; label: string; delay: string }[] = [
  { id: 'relais', label: 'Point relais', delay: '3 à 4 jours ouvrés' },
  { id: 'domicile', label: 'Colissimo à domicile', delay: '2 à 3 jours ouvrés' },
  { id: 'express', label: 'Express', delay: 'Livré demain avant 13 h' },
];

type Form = Record<'prenom' | 'nom' | 'email' | 'tel' | 'adresse' | 'cp' | 'ville' | 'carte' | 'titulaire' | 'exp' | 'cvc', string>;
const EMPTY: Form = { prenom: '', nom: '', email: '', tel: '', adresse: '', cp: '', ville: '', carte: '', titulaire: '', exp: '', cvc: '' };

const RULES: Partial<Record<keyof Form, [RegExp, string]>> = {
  prenom: [/^.{2,}$/, 'Indiquez votre prénom.'],
  nom: [/^.{2,}$/, 'Indiquez votre nom.'],
  email: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Adresse e-mail invalide.'],
  tel: [/^(\+33\s?|0)[1-9](\s?\d{2}){4}$/, 'Numéro de téléphone français invalide.'],
  adresse: [/^.{5,}$/, 'Indiquez votre adresse.'],
  cp: [/^\d{5}$/, 'Code postal à 5 chiffres.'],
  ville: [/^.{2,}$/, 'Indiquez votre ville.'],
  carte: [/^(\d{4} ){3}\d{4}$/, 'Numéro de carte à 16 chiffres.'],
  titulaire: [/^.{3,}$/, 'Nom du titulaire requis.'],
  exp: [/^(0[1-9]|1[0-2])\/\d{2}$/, 'Format MM/AA.'],
  cvc: [/^\d{3}$/, '3 chiffres.'],
};
const FIELDS_BY_STEP: (keyof Form)[][] = [
  ['prenom', 'nom', 'email', 'tel'],
  ['adresse', 'cp', 'ville'],
  ['carte', 'titulaire', 'exp', 'cvc'],
];

function Field({
  id, label, value, error, onChange, onBlur, type = 'text', autoComplete, inputMode, placeholder, className = '', onFocus,
}: {
  id: string; label: string; value: string; error?: string; onChange: (v: string) => void; onBlur?: () => void; type?: string; autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; placeholder?: string; className?: string; onFocus?: () => void;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-xs tracking-[0.15em] text-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className="field"
      />
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-err`} role="alert" className="mt-1 text-xs text-[#b0412e] dark:text-[#f0a37a]" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Checkout() {
  const { lines, subtotal, discount, promo, applyPromo, removePromo, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [ship, setShip] = useState<Ship>('relais');
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    document.title = 'Commande — SELENE';
  }, []);

  const afterDiscount = subtotal - discount;
  const shipping = shippingCost(ship, afterDiscount);
  const total = afterDiscount + shipping;

  const set = (k: keyof Form) => (v: string) => {
    let val = v;
    if (k === 'carte') val = v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    if (k === 'exp') {
      const d = v.replace(/\D/g, '').slice(0, 4);
      val = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    }
    if (k === 'cvc') val = v.replace(/\D/g, '').slice(0, 3);
    if (k === 'cp') val = v.replace(/\D/g, '').slice(0, 5);
    setForm((f) => ({ ...f, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const check = (k: keyof Form) => {
    const r = RULES[k];
    const err = r && !r[0].test(form[k].trim()) ? r[1] : undefined;
    setErrors((e) => ({ ...e, [k]: err }));
    return !err;
  };
  const validateStep = () => FIELDS_BY_STEP[step].map(check).every(Boolean);

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    scrollToTarget(0);
  };

  const next = () => {
    if (!validateStep()) {
      const first = FIELDS_BY_STEP[step].find((k) => RULES[k] && !RULES[k]![0].test(form[k].trim()));
      if (first) document.getElementById(`f-${first}`)?.focus();
      return;
    }
    if (step < 2) return go(step + 1);
    // Paiement simulé
    setPaying(true);
    setTimeout(() => {
      const order = {
        numero: `SEL-${Date.now().toString(36).toUpperCase().slice(-6)}`,
        prenom: form.prenom,
        email: form.email,
        total,
        livraison: SHIP_OPTIONS.find((s) => s.id === ship)!,
        adresse: `${form.adresse}, ${form.cp} ${form.ville}`,
        articles: lines.map((l) => ({ name: l.name, format: l.formatLabel, qty: l.qty, image: l.image })),
      };
      try {
        sessionStorage.setItem('selene-commande', JSON.stringify(order));
      } catch {
        /* ignore */
      }
      clear();
      navigate('/confirmation', { state: order });
    }, 1800);
  };

  if (lines.length === 0 && !paying) {
    return (
      <main id="contenu" className="flex min-h-[80svh] flex-col items-center justify-center px-4 pt-24 text-center">
        <h1 className="font-serif text-5xl">Votre panier est vide</h1>
        <p className="mt-4 text-muted">Ajoutez une bougie avant de passer commande.</p>
        <Link to="/#collection" className="mt-8 underline underline-offset-4">
          Voir la collection
        </Link>
      </main>
    );
  }

  const variants = {
    enter: (d: number) => ({ x: d * 80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -80, opacity: 0 }),
  };

  return (
    <main id="contenu" className="mx-auto max-w-[1300px] px-4 pb-32 pt-32 sm:px-8">
      <h1 className="font-serif text-[clamp(2.6rem,6vw,5rem)] leading-none">Commande</h1>

      {/* Indicateur d'étapes */}
      <ol className="mt-10 flex items-center gap-3 text-sm" aria-label="Étapes de la commande">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-3">
            <button
              onClick={() => i < step && go(i)}
              disabled={i > step}
              aria-current={i === step ? 'step' : undefined}
              className="flex items-center gap-3 disabled:cursor-default"
            >
              <span
                className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border text-xs transition-colors duration-500 ${
                  i < step ? 'border-ambre bg-ambre text-white' : i === step ? 'border-ink bg-ink text-bg' : 'border-line text-muted'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </span>
              <span className={`hidden sm:inline ${i === step ? '' : 'text-muted'}`}>{s}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span className="relative h-px flex-1 bg-line">
                <motion.span className="absolute inset-0 origin-left bg-ambre" animate={{ scaleX: step > i ? 1 : 0 }} transition={{ duration: 0.6 }} />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-14 lg:grid-cols-12">
        <form
          className="lg:col-span-7"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
        >
          <div className="relative overflow-hidden px-1">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div key={step} custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                {step === 0 && (
                  <fieldset>
                    <legend className="font-serif text-3xl">Vos coordonnées</legend>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      <Field id="f-prenom" label="PRÉNOM" value={form.prenom} error={errors.prenom} onChange={set('prenom')} onBlur={() => form.prenom && check('prenom')} autoComplete="given-name" />
                      <Field id="f-nom" label="NOM" value={form.nom} error={errors.nom} onChange={set('nom')} onBlur={() => form.nom && check('nom')} autoComplete="family-name" />
                      <Field id="f-email" label="E-MAIL" type="email" value={form.email} error={errors.email} onChange={set('email')} onBlur={() => form.email && check('email')} autoComplete="email" className="sm:col-span-2" />
                      <Field id="f-tel" label="TÉLÉPHONE" type="tel" value={form.tel} error={errors.tel} onChange={set('tel')} onBlur={() => form.tel && check('tel')} autoComplete="tel" placeholder="06 12 34 56 78" className="sm:col-span-2" />
                    </div>
                  </fieldset>
                )}

                {step === 1 && (
                  <fieldset>
                    <legend className="font-serif text-3xl">Livraison</legend>
                    <div className="mt-8 grid gap-6 sm:grid-cols-3">
                      <Field id="f-adresse" label="ADRESSE" value={form.adresse} error={errors.adresse} onChange={set('adresse')} autoComplete="street-address" className="sm:col-span-3" />
                      <Field id="f-cp" label="CODE POSTAL" value={form.cp} error={errors.cp} onChange={set('cp')} inputMode="numeric" autoComplete="postal-code" />
                      <Field id="f-ville" label="VILLE" value={form.ville} error={errors.ville} onChange={set('ville')} autoComplete="address-level2" className="sm:col-span-2" />
                    </div>
                    <div className="mt-10 space-y-3" role="radiogroup" aria-label="Mode de livraison">
                      {SHIP_OPTIONS.map((o) => {
                        const cost = shippingCost(o.id, afterDiscount);
                        const active = ship === o.id;
                        return (
                          <button
                            type="button"
                            role="radio"
                            aria-checked={active}
                            key={o.id}
                            onClick={() => setShip(o.id)}
                            className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${active ? 'border-ambre bg-ambre-soft/50' : 'border-line hover:border-ink'}`}
                          >
                            <span className={`flex h-5 w-5 flex-none items-center justify-center rounded-full border ${active ? 'border-ambre' : 'border-line'}`}>
                              {active && <motion.span layoutId="ship-dot" className="h-2.5 w-2.5 rounded-full bg-ambre" />}
                            </span>
                            <span className="flex-1">
                              <span className="block font-medium">{o.label}</span>
                              <span className="block text-xs text-muted">{o.delay}</span>
                            </span>
                            <span className="tabular-nums">{cost === 0 ? 'Offerte' : euro(cost)}</span>
                          </button>
                        );
                      })}
                    </div>
                    {afterDiscount < FREE_SHIPPING && <p className="mt-4 text-xs text-muted">Livraison standard offerte dès {euro(FREE_SHIPPING)} d’achat.</p>}
                  </fieldset>
                )}

                {step === 2 && (
                  <fieldset>
                    <legend className="font-serif text-3xl">Paiement</legend>
                    <p className="mt-2 rounded-xl bg-ambre-soft/60 px-4 py-3 text-sm">
                      Prototype : <strong>aucun paiement réel</strong>. Saisissez n’importe quel numéro à 16 chiffres (ex. 4242 4242 4242 4242).
                    </p>

                    {/* Carte qui se retourne pour le CVC */}
                    <div className="mx-auto mt-8 max-w-sm" style={{ perspective: 1200 }} aria-hidden>
                      <motion.div className="relative aspect-[1.586] w-full" style={{ transformStyle: 'preserve-3d' }} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#2a211a,#9a5f34)] p-6 text-[#efebe5] shadow-2xl [backface-visibility:hidden]">
                          <div className="flex items-start justify-between">
                            <span className="font-serif tracking-[0.3em]">SELENE</span>
                            <span className="h-8 w-11 rounded-md bg-[linear-gradient(135deg,#f0c393,#b98a55)]" />
                          </div>
                          <p className="font-mono text-lg tracking-[0.12em] sm:text-xl">{form.carte || '•••• •••• •••• ••••'}</p>
                          <div className="flex justify-between text-xs uppercase">
                            <span className="truncate pr-4">{form.titulaire || 'Titulaire'}</span>
                            <span>{form.exp || 'MM/AA'}</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#9a5f34,#2a211a)] shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <div className="mt-6 h-10 bg-black/70" />
                          <div className="mx-6 mt-5 flex h-9 items-center justify-end rounded bg-[#efebe5] px-3 font-mono text-[#1c1916]">{form.cvc || '•••'}</div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                      <Field id="f-carte" label="NUMÉRO DE CARTE" value={form.carte} error={errors.carte} onChange={set('carte')} inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
                      <Field id="f-titulaire" label="TITULAIRE" value={form.titulaire} error={errors.titulaire} onChange={set('titulaire')} autoComplete="cc-name" className="sm:col-span-2" />
                      <Field id="f-exp" label="EXPIRATION" value={form.exp} error={errors.exp} onChange={set('exp')} inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" />
                      <Field
                        id="f-cvc" label="CVC" value={form.cvc} error={errors.cvc} onChange={set('cvc')} inputMode="numeric" autoComplete="cc-csc" placeholder="123"
                        onFocus={() => setFlipped(true)} onBlur={() => setFlipped(false)}
                      />
                    </div>
                  </fieldset>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
            {step > 0 ? (
              <button type="button" onClick={() => go(step - 1)} className="text-sm underline underline-offset-4">
                ← Retour
              </button>
            ) : (
              <span />
            )}
            <MagneticButton type="submit" disabled={paying} variant={step === 2 ? 'amber' : 'dark'}>
              {paying ? (
                <span className="flex items-center gap-3">
                  <motion.span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />
                  Paiement en cours…
                </span>
              ) : step === 2 ? (
                `Payer ${euro(total)}`
              ) : (
                <>
                  Continuer <span aria-hidden>→</span>
                </>
              )}
            </MagneticButton>
          </div>
        </form>

        {/* Récapitulatif */}
        <aside className="lg:col-span-5" aria-labelledby="titre-recap">
          <div className="rounded-3xl bg-card p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 id="titre-recap" className="font-serif text-2xl">
              Récapitulatif
            </h2>
            <ul className="mt-6 space-y-4">
              {lines.map((l) => (
                <li key={l.key} className="flex items-center gap-4">
                  <span className="relative flex-none">
                    <img src={l.image} alt="" className="h-16 w-14 rounded-md object-cover" />
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[0.65rem] text-bg">{l.qty}</span>
                  </span>
                  <span className="flex-1">
                    <span className="block font-serif">{l.name}</span>
                    <span className="block text-xs text-muted">{l.formatLabel}</span>
                  </span>
                  <span className="text-sm tabular-nums">{euro(l.total)}</span>
                </li>
              ))}
            </ul>

            {!promo ? (
              <form
                className="mt-6 flex gap-2 border-t border-line pt-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setCodeMsg(applyPromo(code) ? '' : 'Code invalide. Essayez BIENVENUE15.');
                }}
              >
                <label htmlFor="promo" className="sr-only">
                  Code promo
                </label>
                <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code promo" className="field flex-1 uppercase" />
                <button type="submit" className="rounded-full border border-line px-5 text-sm hover:border-ink">
                  Appliquer
                </button>
              </form>
            ) : (
              <p className="mt-6 flex items-center justify-between border-t border-line pt-6 text-sm">
                <span>
                  Code <strong>{promo}</strong> appliqué
                </span>
                <button onClick={removePromo} className="text-xs text-muted underline">
                  Retirer
                </button>
              </p>
            )}
            {codeMsg && (
              <p role="alert" className="mt-2 text-xs text-[#b0412e] dark:text-[#f0a37a]">
                {codeMsg}
              </p>
            )}

            <dl className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Sous-total</dt>
                <dd className="tabular-nums">{euro(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-ambre-text">
                  <dt>Réduction −15 %</dt>
                  <dd className="tabular-nums">−{euro(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Livraison</dt>
                <dd className="tabular-nums">{step === 0 ? (afterDiscount >= FREE_SHIPPING ? 'Offerte' : 'Calculée à l’étape 2') : shipping === 0 ? 'Offerte' : euro(shipping)}</dd>
              </div>
              <div className="flex justify-between pt-3 font-serif text-2xl">
                <dt>Total</dt>
                <dd className="tabular-nums">{euro(total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
}
