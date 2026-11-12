export type Family = 'floral' | 'frais' | 'gourmand' | 'signature' | 'boisé';

export type Product = {
  slug: string;
  name: string;
  family: Family;
  familyLabel: string;
  price: number; // format Classique 220 g
  tagline: string;
  description: string;
  image: string;
  alt: string;
  notes: { tete: string[]; coeur: string[]; fond: string[] };
  mood: string;
  tint: string; // couleur d'ambiance (halo, accents)
};

export type FormatId = 'mini' | 'classique' | 'coffret';

export const FORMATS: { id: FormatId; label: string; detail: string; burn: string }[] = [
  { id: 'mini', label: 'Mini', detail: '80 g', burn: '≈ 20 h de combustion' },
  { id: 'classique', label: 'Classique', detail: '220 g', burn: '≈ 50 h de combustion' },
  { id: 'coffret', label: 'Coffret découverte', detail: '3 minis', burn: '≈ 3 × 20 h de combustion' },
];

export const FREE_SHIPPING = 40;

export function priceFor(product: Product, format: FormatId) {
  if (format === 'mini') return 10;
  if (format === 'coffret') return 27;
  return product.price;
}

export const products: Product[] = [
  {
    slug: 'rose-poivre-rose',
    name: 'Rose & Poivre rose',
    family: 'floral',
    familyLabel: 'Floral',
    price: 18,
    tagline: 'Un bouquet de roses, une pointe d’épice.',
    description:
      'La rose de mai rencontre l’éclat pétillant des baies roses. Un floral lumineux, jamais sucré, qui transforme un salon en jardin au crépuscule.',
    image: import.meta.env.BASE_URL + 'images/produit-rose-poivre.webp',
    alt: 'Petite bougie allumée près d’un vase en verre ambré garni de fleurs séchées',
    notes: { tete: ['Baies roses', 'Bergamote'], coeur: ['Rose de mai', 'Pivoine'], fond: ['Musc blanc', 'Cèdre'] },
    mood: 'Romantique',
    tint: '#C98B7A',
  },
  {
    slug: 'lin-frais',
    name: 'Lin frais',
    family: 'frais',
    familyLabel: 'Frais',
    price: 16,
    tagline: 'Des draps propres séchés au soleil.',
    description:
      'Une brise de coton, de muguet et d’air marin. La bougie des dimanches matin, des fenêtres ouvertes et des maisons qui sentent bon le propre.',
    image: import.meta.env.BASE_URL + 'images/produit-lin-frais.webp',
    alt: 'Bougie crème à trois mèches à côté d’une tasse de thé et d’un livre ouvert',
    notes: { tete: ['Aldéhydes', 'Citron'], coeur: ['Fleur de coton', 'Muguet'], fond: ['Musc', 'Ambrette'] },
    mood: 'Apaisant',
    tint: '#A9B7B4',
  },
  {
    slug: 'vanille-caramel',
    name: 'Vanille & Caramel',
    family: 'gourmand',
    familyLabel: 'Gourmand',
    price: 17,
    tagline: 'La douceur d’une cuisine en hiver.',
    description:
      'Une vanille de Madagascar enrobée de caramel au beurre salé et d’une touche de fève tonka. Réconfortant comme un plaid et un chocolat chaud.',
    image: import.meta.env.BASE_URL + 'images/produit-vanille-caramel.webp',
    alt: 'Bougie allumée dans un pot en verre ambré posée sur une pierre, à côté de livres',
    notes: { tete: ['Lait d’amande', 'Poire'], coeur: ['Caramel', 'Fleur de vanille'], fond: ['Vanille bourbon', 'Fève tonka'] },
    mood: 'Réconfortant',
    tint: '#C9945E',
  },
  {
    slug: 'fleur-d-oranger',
    name: 'Fleur d’oranger',
    family: 'signature',
    familyLabel: 'Signature marocaine',
    price: 18,
    tagline: 'Les riads de Fès au printemps.',
    description:
      'Hommage aux cours fleuries du Maroc : la fleur d’oranger distillée, le néroli et une eau de miel. Une signature solaire et intime.',
    image: import.meta.env.BASE_URL + 'images/produit-fleur-oranger.webp',
    alt: 'Plusieurs bougies allumées dans des pots en verre ambré à étiquettes blanches',
    notes: { tete: ['Néroli', 'Petit-grain'], coeur: ['Fleur d’oranger', 'Jasmin'], fond: ['Miel', 'Musc doux'] },
    mood: 'Solaire',
    tint: '#E0A15E',
  },
  {
    slug: 'the-a-la-menthe',
    name: 'Thé à la menthe',
    family: 'signature',
    familyLabel: 'Signature marocaine',
    price: 18,
    tagline: 'Le rituel du thé, versé de haut.',
    description:
      'Menthe nanah fraîchement cueillie, thé vert gunpowder et une pointe de sucre. La convivialité marocaine, dans un pot.',
    image: import.meta.env.BASE_URL + 'images/produit-the-menthe.webp',
    alt: 'Une main allume avec une allumette une bougie verte posée sur un rondin de bois',
    notes: { tete: ['Menthe nanah', 'Citron vert'], coeur: ['Thé vert gunpowder', 'Feuille de figuier'], fond: ['Sucre blond', 'Bois clair'] },
    mood: 'Convivial',
    tint: '#7F9C7A',
  },
  {
    slug: 'ambre-santal',
    name: 'Ambre & Santal',
    family: 'boisé',
    familyLabel: 'Boisé',
    price: 19,
    tagline: 'Un feu de bois dans une bibliothèque.',
    description:
      'Un santal crémeux, une résine d’ambre chaude et un souffle de cuir. Profonde et enveloppante, la bougie des longues soirées.',
    image: import.meta.env.BASE_URL + 'images/produit-ambre-santal.webp',
    alt: 'Pots de bougies en verre ambré présentés sur des blocs de pierre claire',
    notes: { tete: ['Cardamome', 'Poivre noir'], coeur: ['Bois de santal', 'Cuir'], fond: ['Ambre', 'Benjoin', 'Vétiver'] },
    mood: 'Enveloppant',
    tint: '#9A5F34',
  },
];

export const getProduct = (slug?: string) => products.find((p) => p.slug === slug);

export const euro = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);
