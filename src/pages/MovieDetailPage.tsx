// src/pages/MovieDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie } from "../api/tmdb";
import { getMovieDetail } from "../api/tmdb";
import { useWishlist } from "../context/WishlistContext";
import "../styles/movieDetail.css"; // ✅ 기존 CSS 사용

const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";
const IMG_W500 = "https://image.tmdb.org/t/p/w500";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = useMemo(() => Number(params.id), [params.id]);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toggleWishlist, isInWishlist } = useWishlist();
  const wished = movie ? isInWishlist(movie.id) : false;

  useEffect(() => {
    let cancelled = false;

    async function fetchDetail() {
      if (!Number.isFinite(movieId) || movieId <= 0) {
        setError("유효하지 않은 영화 ID입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetail(movieId);
        if (!cancelled) setMovie(data);
      } catch {
        if (!cancelled) setError("영화 상세 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [movieId]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-error">로딩 중…</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="detail-page">
        <div className="detail-error">{error ?? "Not found"}</div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `${IMG_ORIGINAL}${movie.backdrop_path}`
    : undefined;

  const posterUrl = movie.poster_path
    ? `${IMG_W500}${movie.poster_path}`
    : undefined;

  return (
    <div className="detail-page">
      <div
        className="detail-hero"
        style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : {}}
      >
        <div className="detail-hero-overlay" />

        <div className="detail-content">
          <div className="detail-poster">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} />
            ) : (
              <div className="detail-poster-placeholder">No Image</div>
            )}
          </div>

          <div>
            <h1 className="detail-title">{movie.title}</h1>

            <div className="detail-meta">
              <span>⭐ {movie.vote_average.toFixed(1)}</span>
              <span>{movie.release_date || "개봉일 정보 없음"}</span>
            </div>

            <p className="detail-overview">
              {movie.overview?.trim()
                ? movie.overview
                : "줄거리 정보가 없습니다."}
            </p>

            <button
              type="button"
              className={`detail-wish-btn ${wished ? "on" : ""}`}
              onClick={() => toggleWishlist(movie)}
            >
              {wished ? "추천 해제" : "추천하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
