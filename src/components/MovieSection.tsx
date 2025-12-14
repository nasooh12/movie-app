// src/components/MovieSection.tsx
import type { Movie } from "../api/tmdb";
import {
  getPopularMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../api/tmdb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import "../styles/movie-section.css";

type SectionType = "popular" | "now_playing" | "top_rated" | "upcoming";

type MovieSectionProps = {
  title: string;
  type: SectionType;
};

export default function MovieSection({ title, type }: MovieSectionProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    let cancelled = false;

    async function fetchMovies() {
      try {
        setLoading(true);
        setError(null);

        let data;
        switch (type) {
          case "popular":
            data = await getPopularMovies();
            break;
          case "now_playing":
            data = await getNowPlayingMovies();
            break;
          case "top_rated":
            data = await getTopRatedMovies();
            break;
          case "upcoming":
            data = await getUpcomingMovies();
            break;
          default:
            data = await getPopularMovies();
        }

        if (!cancelled) {
          setMovies(data.results);
        }
      } catch {
        if (!cancelled) {
          setError("영화 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMovies();
    return () => {
      cancelled = true;
    };
  }, [type]);

  return (
    <section className="movie-section">
      <h2 className="movie-section-title">{title}</h2>

      {loading && <div className="movie-section-status">로딩 중...</div>}
      {error && <div className="movie-section-status error">{error}</div>}

      {!loading && !error && (
        <div className="movie-row">
          {movies.map((movie) => {
            const wished = isInWishlist(movie.id);

            return (
              <div
                key={movie.id}
                className={`movie-card ${wished ? "is-wish" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/movie/${movie.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/movie/${movie.id}`);
                  }
                }}
              >
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                  />
                ) : (
                  <div className="movie-card-placeholder">No Image</div>
                )}

                <div className="movie-card-info">
                  <div className="movie-card-title">{movie.title}</div>
                  <div className="movie-card-meta">
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                    <span>{movie.release_date}</span>
                  </div>
                </div>

                {/* 추천 버튼 */}
                <button
                  type="button"
                  className="movie-card-wish-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(movie);
                  }}
                >
                  {wished ? "★" : "☆"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
