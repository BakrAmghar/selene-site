# SELENE — Maison de bougies (prototype)

Site e-commerce prototype en français : Vite + React + TypeScript + Tailwind CSS v4, GSAP/ScrollTrigger, Lenis, Framer Motion.
Aucun paiement réel : le parcours d'achat est entièrement simulé.

## Lancer le site

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de production dans dist/
npm run preview    # prévisualiser le build
```

Code promo de test : `BIENVENUE15` (−15 %). Carte de test : n'importe quels 16 chiffres (ex. 4242 4242 4242 4242).

## Images

Les photos (Unsplash) sont dans `public/images/` en WebP (1600 px max). Crédits : voir `CREDITS.md`.
Pour régénérer depuis des JPEG sources : `node scripts/optimize-images.mjs <dossier-source>`.
