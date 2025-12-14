// src/pages/WishlistPage.tsx
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import "../styles/wishlist.css";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <h1>추천 영화</h1>
        <p className="wishlist-empty">
          아직 추천한 영화가 없습니다. 홈 화면에서 마음에 드는 영화를
          클릭해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1>추천 영화</h1>

      <div className="wishlist-grid">
        {wishlist.map((movie) => (
          <div
            key={movie.id}
            className="wishlist-card"
            onClick={() => navigate(`/movie/${movie.id}`)}
            role="button"
            tabIndex={0}
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
              <div className="wishlist-card-placeholder">No Image</div>
            )}

            <div className="wishlist-card-info">
              <div className="wishlist-card-title">{movie.title}</div>
              <div className="wishlist-card-meta">
                <span>⭐ {movie.vote_average.toFixed(1)}</span>
                <span>{movie.release_date}</span>
              </div>

              {/* ✅ 추천 취소 버튼: 클릭 시 상세이동 막고 추천만 해제 */}
              <button
                type="button"
                className="wishlist-remove-button"
                onClick={(e) => {
                  e.stopPropagation(); // ⭐ 핵심
                  toggleWishlist(movie);
                }}
              >
                추천 취소
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
