import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MagneticButton } from '../components/Magnetic';
import { RevealText } from '../components/Reveal';
import { useCart } from '../context/CartContext';
import { euro, getProduct, products } from '../data/products';

type Option = { label: string; emoji: string; scores: Record<string, number> };
const QUESTIONS: { q: string; options: Option[] }[] = [
  {
    q: 'Quel moment veux-tu sublimer ?',
    options: [
      { label: 'Un bain, une soirée rien qu’à moi', emoji: '🛁', scores: { 'rose-poivre-rose': 2, 'lin-frais': 1 } },
      { label: 'Un dîner entre amis', emoji: '🍽', scores: { 'the-a-la-menthe': 2, 'fleur-d-oranger': 1 } },
      { label: 'Un livre sous un plaid', emoji: '📖', scores: { 'vanille-caramel': 2, 'ambre-santal': 2 } },
      { label: 'Un dimanche matin ensoleillé', emoji: '☀️', scores: { 'lin-frais': 2, 'fleur-d-oranger': 1 } },
    ],
  },
  {
    q: 'Quelle famille t’attire le plus ?',
    options: [
      { label: 'Les fleurs', emoji: '🌸', scores: { 'rose-poivre-rose': 3, 'fleur-d-oranger': 2 } },
      { label: 'La fraîcheur', emoji: '🌿', scores: { 'lin-frais': 3, 'the-a-la-menthe': 2 } },
      { label: 'La gourmandise', emoji: '🍮', scores: { 'vanille-caramel': 3 } },
      { label: 'Les bois chauds', emoji: '🪵', scores: { 'ambre-santal': 3, 'vanille-caramel': 1 } },
    ],
  },
  {
    q: 'Si tu pouvais partir ce soir…',
    options: [
      { label: 'Un jardin parisien au printemps', emoji: '🌹', scores: { 'rose-poivre-rose': 2 } },
      { label: 'Une maison sur la côte bretonne', emoji: '🌊', scores: { 'lin-frais': 2 } },
      { label: 'Un riad à Marrakech', emoji: '🕌', scores: { 'fleur-d-oranger': 2, 'the-a-la-menthe': 2 } },
      { label: 'Un chalet sous la neige', emoji: '❄️', scores: { 'ambre-santal': 2, 'vanille-caramel': 1 } },
    ],
  },
];

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const { add } = useCart();
  const imgRef = useRef<HTMLDivElement>(null);
  const done = step >= QUESTIONS.length;

  const result = (() => {
    if (!done) return null;
    const total: Record<string, number> = {};
    answers.forEach((a, i) => Object.entries(QUESTIONS[i].options[a].scores).forEach(([k, v]) => (total[k] = (total[k] ?? 0) + v)));
    const best = products.slice().sort((a, b) => (total[b.slug] ?? 0) - (total[a.slug] ?? 0))[0];
    return getProduct(best.slug)!;
  })();

  const choose = (i: number) => {
    setAnswers((a) => [...a.slice(0, step), i]);
    setStep((s) => s + 1);
  };
  const restart = () => {
    setAnswers([]);
    setStep(0);
  };

  return (
    <section id="quiz" className="relative overflow-hidden bg-[#1c1916] px-4 py-28 text-[#efebe5] sm:px-8 sm:py-40" aria-labelledby="titre-quiz">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(208,138,85,.22),transparent)]" />
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-[0.7rem] tracking-[0.35em] text-[#e09a63]">TROUVE TON PARFUM</p>
          <RevealText as="h2" text="Trois questions, une bougie faite pour toi." className="mt-5 font-serif text-[clamp(2.2rem,5.5vw,4.8rem)] leading-[1.02]" />
        </div>

        {/* Progression */}
        <div className="mx-auto mt-14 flex max-w-xs items-center gap-2" aria-hidden>
          {QUESTIONS.map((_, i) => (
            <div key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
              <motion.div className="h-full origin-left bg-[#d08a55]" animate={{ scaleX: step > i ? 1 : 0 }} transition={{ duration: 0.6 }} />
            </div>
          ))}
        </div>

        <div className="relative mt-12 min-h-[360px]" aria-live="polite">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 60, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -60, filter: 'blur(6px)' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-center text-sm text-white/60">
                  Question {step + 1} sur {QUESTIONS.length}
                </p>
                <h3 className="mt-3 text-center font-serif text-3xl sm:text-4xl">{QUESTIONS[step].q}</h3>
                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {QUESTIONS[step].options.map((o, i) => (
                    <motion.button
                      key={o.label}
                      onClick={() => choose(i)}
                      className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.03] px-6 py-5 text-left transition-colors hover:border-[#d08a55] hover:bg-white/[0.07]"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.06 } }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span aria-hidden className="text-2xl transition-transform duration-300 group-hover:scale-125">
                        {o.emoji}
                      </span>
                      <span>{o.label}</span>
                    </motion.button>
                  ))}
                </div>
                {step > 0 && (
                  <button onClick={() => setStep((s) => s - 1)} className="mx-auto mt-8 block text-sm text-white/60 underline underline-offset-4 hover:text-white">
                    ← Question précédente
                  </button>
                )}
              </motion.div>
            ) : (
              result && (
                <motion.div
                  key="result"
                  className="grid items-center gap-10 sm:grid-cols-2"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    ref={imgRef}
                    className="relative aspect-[4/5] overflow-hidden rounded-sm"
                    initial={{ clipPath: 'circle(0% at 50% 60%)' }}
                    animate={{ clipPath: 'circle(75% at 50% 60%)' }}
                    transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <img src={result.image} alt={result.alt} className="h-full w-full object-cover" />
                    <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 70%, ${result.tint}55, transparent 70%)` }} />
                  </motion.div>
                  <div>
                    <p className="text-sm tracking-[0.25em] text-[#e09a63]">TA BOUGIE IDÉALE</p>
                    <h3 className="mt-3 font-serif text-5xl leading-none">{result.name}</h3>
                    <p className="mt-3 font-serif text-xl italic text-white/80">« {result.tagline} »</p>
                    <p className="mt-5 leading-relaxed text-white/75">{result.description}</p>
                    <p className="mt-5 text-sm text-white/60">
                      Cœur : {result.notes.coeur.join(', ')} · {euro(result.price)}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <MagneticButton variant="light" onClick={() => add(result.slug, 'classique', 1, imgRef.current)}>
                        Ajouter au panier
                      </MagneticButton>
                      <Link to={`/produit/${result.slug}`} className="text-sm underline underline-offset-4">
                        Voir la bougie
                      </Link>
                    </div>
                    <button onClick={restart} className="mt-8 text-sm text-white/60 hover:text-white">
                      ↺ Recommencer le quiz
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
