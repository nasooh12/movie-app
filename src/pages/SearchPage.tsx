// src/pages/SearchPage.tsx
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Movie } from "../api/tmdb";
import { searchMovies } from "../api/tmdb";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero";
import "../styles/search.css";

type TmdbMovieResponse = {
  page: number;
  total_pages: number;
  results: Movie[];
};

type SortType = "popularity" | "rating" | "latest";

export default function SearchPage() {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [query, setQuery] = useState("");
  const [rawMovies, setRawMovies] = useState<Movie[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // 🔹 필터 상태
  const [minRating, setMinRating] = useState<number>(0);
  const [sortType, setSortType] = useState<SortType>("popularity");

  const fetchSearch = async (pageToLoad: number) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError("검색어를 입력해주세요.");
      setRawMovies([]);
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

      setRawMovies(data.results);
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

  // 🔹 필터 + 정렬 적용된 최종 결과
  const movies = useMemo(() => {
    let list = [...rawMovies];

    if (minRating > 0) {
      list = list.filter((m) => m.vote_average >= minRating);
    }

    if (sortType === "rating") {
      list.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortType === "latest") {
      list.sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
      );
    }
    // popularity는 기본 순서 유지

    return list;
  }, [rawMovies, minRating, sortType]);

  const resetFilters = () => {
    setMinRating(0);
    setSortType("popularity");
  };

  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : false;

  return (
    <div className="search-page">
      <PageHero
        title="영화 검색"
        subtitle="TMDB에서 원하는 영화를 찾아보세요."
        variant="search"
      />

      {/* 🔹 검색 입력 */}
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          value={query}
          placeholder="검색어를 입력하세요"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-button" type="submit" disabled={loading}>
          검색
        </button>
      </form>

      {/* 🔹 필터 UI */}
      <div className="search-filters">
        <label>
          최소 평점
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            <option value={0}>전체</option>
            <option value={6}>6점 이상</option>
            <option value={7}>7점 이상</option>
            <option value={8}>8점 이상</option>
          </select>
        </label>

        <label>
          정렬
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value as SortType)}
          >
            <option value="popularity">기본</option>
            <option value="rating">평점순</option>
            <option value="latest">최신순</option>
          </select>
        </label>

        <button
          type="button"
          className="filter-reset-btn"
          onClick={resetFilters}
        >
          초기화
        </button>
      </div>

      {loading && (
        <div className="search-status">검색 중입니다. 잠시만 기다려주세요…</div>
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
                    <div className="search-card-placeholder">No Image</div>
                  )}

                  <div className="search-card-info">
                    <div className="search-card-title">{movie.title}</div>
                    <div className="search-card-meta">
                      <span>⭐ {movie.vote_average.toFixed(1)}</span>
                      <span>{movie.release_date}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="search-card-wish-btn"
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
