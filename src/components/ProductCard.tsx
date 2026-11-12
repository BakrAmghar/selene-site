import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { euro, type Product } from '../data/products';
import { RevealImage } from './Reveal';
import TiltCard from './TiltCard';

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const { add } = useCart();
  const imgWrap = useRef<HTMLDivElement>(null);

  return (
    <TiltCard className="rounded-sm">
      <article className="relative" style={{ transformStyle: 'preserve-3d' }}>
        <Link to={`/produit/${product.slug}`} className="block" data-cursor="big" aria-label={`${product.name}, ${product.familyLabel}, ${euro(product.price)}`}>
          <div ref={imgWrap} className="relative">
            <RevealImage
              src={product.image}
              alt={product.alt}
              className="aspect-[3/4] rounded-sm bg-bg-soft"
              imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.16]"
              direction={index % 2 ? 'up' : 'left'}
            >
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
              <span className="absolute left-4 top-4 rounded-full bg-[#efebe5]/90 px-3 py-1 text-[0.65rem] tracking-[0.15em] text-[#1c1916] backdrop-blur">
                {product.familyLabel.toUpperCase()}
              </span>
              <span
                aria-hidden
                className="absolute bottom-4 left-4 right-4 translate-y-3 font-serif text-lg italic text-[#efebe5] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
              >
                « {product.tagline} »
              </span>
            </RevealImage>
          </div>
          <div className="mt-5 flex items-start justify-between gap-4" style={{ transform: 'translateZ(30px)' }}>
            <div>
              <h3 className="font-serif text-2xl leading-tight">{product.name}</h3>
              <p className="mt-1 text-sm text-muted">
                {product.notes.coeur.join(' · ')}
              </p>
            </div>
            <p className="pt-1 text-lg tabular-nums">{euro(product.price)}</p>
          </div>
        </Link>
        <button
          onClick={() => add(product.slug, 'classique', 1, imgWrap.current)}
          className="relative z-30 mt-4 inline-flex items-center gap-2 border-b border-line pb-1 text-sm transition-colors hover:border-ambre hover:text-ambre-text"
          aria-label={`Ajouter ${product.name}, format Classique, au panier`}
        >
          <span aria-hidden className="text-base leading-none">+</span> Ajouter au panier
        </button>
      </article>
    </TiltCard>
  );
}
