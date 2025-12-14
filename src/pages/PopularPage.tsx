// src/pages/PopularPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../api/tmdb";
import { getPopularMovies } from "../api/tmdb";
import { useWishlist } from "../context/WishlistContext";
import "../styles/popular.css";

type TmdbMovieResponse = {
  page: number;
  total_pages: number;
  results: Movie[];
};

export default function PopularPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const fetchPage = async (pageToLoad: number) => {
    try {
      setLoading(true);
      setError(null);

      const data = (await getPopularMovies(
        pageToLoad
      )) as unknown as TmdbMovieResponse;

      setMovies(data.results);
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch {
      setError("인기 영화 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPage(1);
  }, []);

  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : true;

  return (
    <div className="popular-page">
      <div className="popular-header">
        <h1>인기 영화</h1>
        <p className="popular-subtitle">
          현재 TMDB 기준으로 인기 있는 영화들을 보여줍니다.
        </p>
      </div>

      {loading && (
        <div className="popular-status">로딩 중입니다. 잠시만 기다려주세요…</div>
      )}
      {error && <div className="popular-status error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="popular-grid">
            {movies.map((movie) => {
              const wished = isInWishlist(movie.id);

              return (
                <div
                  key={movie.id}
                  className={`popular-card ${wished ? "is-wish" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") navigate(`/movie/${movie.id}`);
                  }}
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                    />
                  ) : (
                    <div className="popular-card-placeholder">No Image</div>
                  )}

                  <div className="popular-card-info">
                    <div className="popular-card-title">{movie.title}</div>
                    <div className="popular-card-meta">
                      <span>⭐ {movie.vote_average.toFixed(1)}</span>
                      <span>{movie.release_date}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="popular-card-wish-btn"
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

          <div className="popular-pagination">
            <button
              type="button"
              className="page-btn"
              disabled={!canPrev || loading}
              onClick={() => fetchPage(page - 1)}
            >
              이전
            </button>
            <span className="page-info">
              {page}
              {totalPages ? ` / ${totalPages}` : ""}
            </span>
            <button
              type="button"
              className="page-btn"
              disabled={!canNext || loading}
              onClick={() => fetchPage(page + 1)}
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}
