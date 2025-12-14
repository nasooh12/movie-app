import { useNavigate } from "react-router-dom";
import type { Movie } from "../api/tmdb";
import { useWishlist } from "../context/WishlistContext";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const wished = isInWishlist(movie.id);

  return (
    <div
      className="movie-card"
      onClick={() => navigate(`/movie/${movie.id}`)}
      role="button"
      tabIndex={0}
    >
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={movie.title}
        />
      ) : (
        <div>No Image</div>
      )}

      <div className="movie-card-title">{movie.title}</div>

      <button
        type="button"
        className={`wishlist-btn ${wished ? "on" : ""}`}
        onClick={(e) => {
          e.stopPropagation(); // ⭐ 이게 핵심
          toggleWishlist(movie);
        }}
      >
        {wished ? "추천 해제" : "추천"}
      </button>
    </div>
  );
}
