// src/pages/MovieDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie } from "../api/tmdb";
import { getMovieDetail } from "../api/tmdb";
import { useWishlist } from "../context/WishlistContext";
import "../styles/movieDetail.css";

type MovieDetail = Movie & {
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
};

export default function MovieDetailPage() {
  const { id } = useParams();
  const movieId = Number(id);

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!movieId || Number.isNaN(movieId)) {
        setError("잘못된 영화 ID입니다.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = (await getMovieDetail(movieId)) as MovieDetail;
        setMovie(data);
      } catch {
        setError("영화 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    void fetchDetail();
  }, [movieId]);

  if (loading) {
    return <div className="detail-page">로딩 중…</div>;
  }

  if (error) {
    return <div className="detail-page detail-error">{error}</div>;
  }

  if (!movie) {
    return <div className="detail-page">영화 정보가 없습니다.</div>;
  }

  const wished = isInWishlist(movie.id);

  return (
    <div className="detail-page">
      <div
        className="detail-hero"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : undefined,
        }}
      >
        <div className="detail-hero-overlay" />
        <div className="detail-content">
          <div className="detail-poster">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="detail-poster-placeholder">No Image</div>
            )}
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{movie.title}</h1>

            {movie.tagline && <p className="detail-tagline">{movie.tagline}</p>}

            <div className="detail-meta">
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
              <span>{movie.release_date}</span>
              {movie.runtime ? <span>{movie.runtime}분</span> : null}
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="detail-genres">
                {movie.genres.map((g) => (
                  <span key={g.id} className="genre-chip">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="detail-overview">{movie.overview}</p>

            <button
              type="button"
              className={`detail-wish-btn ${wished ? "on" : ""}`}
              onClick={() => toggleWishlist(movie)}
            >
              {wished ? "추천 해제" : "추천 추가"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
