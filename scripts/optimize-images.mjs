// Convertit les photos sources (JPEG Unsplash) en WebP optimisés, largeur max 1600 px.
// Usage : node scripts/optimize-images.mjs <dossier-source> [<dossier-source-2> ...]
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const MAP = {
  'ahmet-yuksek-VXtUvUaU5Fo': 'hero-salle-bougies',
  'rafael-garcin-j9-AnSj7Eu8': 'photophores-allumes',
  'manoj-roy-KkqnhL3HjtA': 'flamme-nuit',
  'david-tomaseti-AaZlf5FgUws': 'bougie-pilier-flamme',
  'amon-zae-8ai0WrvWUjU': 'flamme-macro',
  'valentin-jDSZZfOoU-w': 'cire-fondue',
  'carlos-andres-suarez-ortega-4u_q9EPh_qM': 'meche-coton',
  'clay-banks-oHmNZqfqUDc': 'plaid-bougie',
  'nico-8IK1OrkMzMQ': 'pots-ambres-fleurs',
  'chirag-k-Pg2jm-PMVWs': 'bougie-ceramique',
  'alexis-fauvet-SKkvHiX_p6U': 'mer-de-bougies',
  'shayla-bruins-ZPAnMf2KLzk': 'bouquet-sec',
  'katsia-jazwinska-jJi31q3OKog': 'produit-rose-poivre',
  'mariah-krafft-jYSLPo5P3Xo': 'produit-lin-frais',
  'karolina-grabowska-ozu_xlDz5Ec': 'produit-vanille-caramel',
  'pmv-chamara-KLU0scqbKQ0': 'produit-fleur-oranger',
  'brooke-balentine-qbNM7uf97Uo': 'produit-the-menthe',
  'luma-candles-K1Xi_R_mfpk': 'produit-ambre-santal',
};

const out = path.resolve('public/images');
fs.mkdirSync(out, { recursive: true });
for (const dir of process.argv.slice(2)) {
  for (const f of fs.readdirSync(dir)) {
    const key = f.replace(/-unsplash\.jpe?g$/i, '');
    const name = MAP[key];
    if (!name) continue;
    const info = await sharp(path.join(dir, f))
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(path.join(out, name + '.webp'));
    console.log(`${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} Ko`);
  }
}
