import "../styles/page-hero.css";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  variant?: "home" | "popular" | "search" | "wishlist";
};

export default function PageHero({
  title,
  subtitle,
  variant = "home",
}: PageHeroProps) {
  return (
    <div className={`page-hero ${variant}`}>
      <h1 className="page-hero-title">{title}</h1>
      {subtitle ? <p className="page-hero-subtitle">{subtitle}</p> : null}
    </div>
  );
}
