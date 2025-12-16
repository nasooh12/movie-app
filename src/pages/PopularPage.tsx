import { useEffect, useRef, useState } from "react";
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
  const [showTop, setShowTop] = useState(false);

  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  // viewMode 변경 시 초기화 + 1페이지 로드 + 스크롤 위치 초기화
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setTotalPages(null);
    setHasMore(true);
    setError(null);

    window.scrollTo({ top: 0 });
    void fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  // Table View 요구사항: 스크롤 불가 처리
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (viewMode === "table") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [viewMode]);

  // TOP 버튼: 일정 이상 내려가면 표시
  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Infinite Scroll: 바닥(sentinel) 보이면 다음 페이지 로드
  useEffect(() => {
    if (viewMode !== "infinite") return;
    if (!sentinelRef.current) return;

    const el = sentinelRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (!hasMore || loading) return;
        void fetchPage(page + 1);
      },
      { root: null, rootMargin: "400px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [viewMode, hasMore, loading, page]);

  const canPrev = page > 1;
  const canNext = totalPages ? page < totalPages : true;

  return (
    <div className="popular-page">
      <PageHero
        title="인기 영화"
        subtitle="현재 TMDB 기준으로 인기 있는 영화들을 보여줍니다."
        variant="popular"
      />

      <div className="popular-view-toggle">
        <button
          type="button"
          className={viewMode === "table" ? "active" : ""}
          onClick={() => setViewMode("table")}
        >
          Table
        </button>
        <button
          type="button"
          className={viewMode === "infinite" ? "active" : ""}
          onClick={() => setViewMode("infinite")}
        >
          Infinite
        </button>
      </div>

      {error && <div className="popular-status error">{error}</div>}

      {/* Table View에서는 화면 안에만 보여야 하니까 wrapper로 높이 제한 */}
      <div className={viewMode === "table" ? "popular-table-wrap" : ""}>
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
                  aria-label={wished ? "추천 해제" : "추천하기"}
                >
                  {wished ? "★" : "☆"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Table View Pagination */}
        {viewMode === "table" && (
          <div className="popular-pagination">
            <button
              type="button"
              className="page-btn"
              disabled={!canPrev || loading}
              onClick={() => void fetchPage(page - 1)}
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
              onClick={() => void fetchPage(page + 1)}
            >
              다음
            </button>
          </div>
        )}
      </div>

      {/* Infinite View Loading + Sentinel */}
      {viewMode === "infinite" && (
        <>
          {loading && <div className="popular-status">불러오는 중…</div>}
          <div ref={sentinelRef} className="popular-sentinel" />
          {!hasMore && movies.length > 0 && (
            <div className="popular-status">마지막 페이지입니다.</div>
          )}
        </>
      )}

      {/* Top Button */}
      <button
        type="button"
        className={`scroll-top-btn ${showTop ? "show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="맨 위로"
      >
        ↑
      </button>
    </div>
  );
}
