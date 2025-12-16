import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../api/tmdb";
import { getPopularMovies } from "../api/tmdb";
import { useWishlist } from "../context/WishlistContext";
import PageHero from "../components/PageHero";
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

  const [viewMode, setViewMode] = useState<"table" | "infinite">("table");
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const fetchPage = async (pageToLoad: number) => {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const data = (await getPopularMovies(
        pageToLoad
      )) as unknown as TmdbMovieResponse;

      setMovies((prev) =>
        viewMode === "infinite" ? [...prev, ...data.results] : data.results
      );

      setPage(data.page);
      setTotalPages(data.total_pages);
      setHasMore(pageToLoad < data.total_pages);
    } catch {
      setError("인기 영화 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 최초 로딩 or viewMode 변경 시
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    void fetchPage(1);
  }, [viewMode]);

  // Infinite Scroll 처리
  useEffect(() => {
    if (viewMode !== "infinite") return;

    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300;

      if (nearBottom && hasMore && !loading) {
        void fetchPage(page + 1);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [viewMode, page, hasMore, loading]);

  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : true;

  return (
    <div className="popular-page">
      <PageHero
        title="인기 영화"
        subtitle="현재 TMDB 기준으로 인기 있는 영화들을 보여줍니다."
        variant="popular"
      />

      {/* View Mode Toggle */}
      <div className="popular-view-toggle">
        <button
          className={viewMode === "table" ? "active" : ""}
          onClick={() => setViewMode("table")}
        >
          Table
        </button>
        <button
          className={viewMode === "infinite" ? "active" : ""}
          onClick={() => setViewMode("infinite")}
        >
          Infinite
        </button>
      </div>

      {error && <div className="popular-status error">{error}</div>}

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

      {/* Pagination (Table View Only) */}
      {viewMode === "table" && !loading && (
        <div className="popular-pagination">
          <button
            type="button"
            className="page-btn"
            disabled={!canPrev}
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
            disabled={!canNext}
            onClick={() => fetchPage(page + 1)}
          >
            다음
          </button>
        </div>
      )}

      {/* Infinite Loading */}
      {viewMode === "infinite" && loading && (
        <div className="popular-status">불러오는 중…</div>
      )}

      {/* Top Button */}
      <button
        className="scroll-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑ TOP
      </button>
    </div>
  );
}
