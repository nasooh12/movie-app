// src/pages/WishlistPage.tsx
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import PageHero from "../components/PageHero";
import "../styles/wishlist.css";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <PageHero
          title="추천 영화"
          subtitle="내가 추천한(위시리스트) 영화 목록입니다."
          variant="wishlist"
        />

        <p className="wishlist-empty">
          아직 추천한 영화가 없습니다. 홈 화면에서 마음에 드는 영화를
          클릭해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <PageHero
        title="추천 영화"
        subtitle="내가 추천한(위시리스트) 영화 목록입니다."
        variant="wishlist"
      />

      <div className="wishlist-grid">
        {wishlist.map((movie) => (
          <div
            key={movie.id}
            className="wishlist-card"
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
              <div className="wishlist-card-placeholder">No Image</div>
            )}

            <div className="wishlist-card-info">
              <div className="wishlist-card-title">{movie.title}</div>
              <div className="wishlist-card-meta">
                <span>⭐ {movie.vote_average.toFixed(1)}</span>
                <span>{movie.release_date}</span>
              </div>

              <button
                type="button"
                className="wishlist-remove-button"
                onClick={(e) => {
                  e.stopPropagation();
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
