type Props = { className?: string; compact?: boolean };

export default function Logo({ className = '', compact = false }: Props) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif text-[1.45rem] font-medium tracking-[0.42em] pl-[0.42em]">SELENE</span>
      {!compact && <span className="mt-1.5 font-sans text-[0.55rem] font-medium tracking-[0.38em] pl-[0.38em] opacity-75">MAISON DE BOUGIES</span>}
    </span>
  );
}
