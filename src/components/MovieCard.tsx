import { useNavigate } from "react-router-dom";
import type { Movie } from "../api/tmdb";
import "../styles/movieCard.css";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="movie-card"
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
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={movie.title}
        />
      ) : (
        <div className="movie-card-placeholder">No Image</div>
      )}

      <div className="movie-card-title">{movie.title}</div>
    </div>
  );
}
