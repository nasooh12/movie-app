// src/pages/HomePage.tsx
import MovieSection from "../components/MovieSection";
import PageHero from "../components/PageHero";
import "../styles/home.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <h1>Movie Demo</h1>
          <p>지금 가장 인기 있는 영화들을 만나보세요.</p>
        </div>
      </div>

      <PageHero
        title="홈"
        subtitle="지금 상영중 / 인기 / 평점 / 개봉 예정 영화를 한 번에 확인하세요."
        variant="home"
      />

      <MovieSection title="인기 영화" type="popular" />
      <MovieSection title="현재 상영 중" type="now_playing" />
      <MovieSection title="높은 평점 영화" type="top_rated" />
      <MovieSection title="개봉 예정" type="upcoming" />
    </div>
  );
}
