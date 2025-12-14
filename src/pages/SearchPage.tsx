// src/pages/SearchPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../api/tmdb";
import { searchMovies } from "../api/tmdb";
import { useWishlist } from "../context/WishlistContext";
import "../styles/search.css";

type TmdbMovieResponse = {
  page: number;
  total_pages: number;
  results: Movie[];
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const fetchSearch = async (pageToLoad: number) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError("검색어를 입력해주세요.");
      setMovies([]);
      setTotalPages(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = (await searchMovies(
        trimmed,
        pageToLoad
      )) as unknown as TmdbMovieResponse;

      setMovies(data.results);
      setPage(data.page);
      setTotalPages(data.total_pages);
      setHasSearched(true);
    } catch {
      setError("검색 결과를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void fetchSearch(1);
  };

  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : false;

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>영화 검색</h1>
        <p className="search-subtitle">
          영화 제목으로 TMDB에서 검색할 수 있습니다.
        </p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          value={query}
          placeholder="검색어를 입력하세요 (예: Inception, Avengers)"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" type="submit" disabled={loading}>
          검색
        </button>
      </form>

      {loading && (
        <div className="search-status">
          검색 중입니다. 잠시만 기다려주세요…
        </div>
      )}
      {error && <div className="search-status error">{error}</div>}

      {!loading && !error && hasSearched && movies.length === 0 && (
        <div className="search-status">검색 결과가 없습니다.</div>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <div className="search-grid">
            {movies.map((movie) => {
              const wished = isInWishlist(movie.id);

              return (
                <div
                  key={movie.id}
                  className={`search-card ${wished ? "is-wish" : ""}`}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      navigate(`/movie/${movie.id}`);
                    }
                  }}
                >
                  {/* ✅ 추천 버튼: 클릭 시 상세이동 막고 추천만 토글 */}
                  <button
                    type="button"
                    className={`wishlist-btn ${wished ? "on" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(movie);
                    }}
                  >
                    {wished ? "추천 해제" : "추천"}
                  </button>

                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                    />
                  ) : (
                    <div className="search-card-placeholder">No Image</div>
                  )}
                  <div className="search-card-info">
                    <div className="search-card-title">{movie.title}</div>
                    <div className="search-card-meta">
                      <span>⭐ {movie.vote_average.toFixed(1)}</span>
                      <span>{movie.release_date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="search-pagination">
            <button
              type="button"
              className="page-btn"
              disabled={!canPrev || loading}
              onClick={() => void fetchSearch(page - 1)}
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
              onClick={() => void fetchSearch(page + 1)}
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}
