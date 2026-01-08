import type { Movie } from "./MovieCatalog";

type Props = {
  movie: Movie;
  onSelect: (movie: Movie) => void;
};

export default function MovieCard({ movie, onSelect }: Props) {
  return (
    <button
      type="button"
      className="btn p-0 text-start w-100"
      onClick={() => onSelect(movie)}
      style={{ background: "transparent", border: "0" }}
    >
      <div className="text-center">
        {/* Poster wrapper keeps a consistent poster shape on any screen size */}
        <div
          className="mb-2"
          style={{
            overflow: "hidden",
            borderRadius: 8,
            aspectRatio: "2 / 3",     // ✅ consistent poster aspect ratio
            width: "100%",
            backgroundColor: "#2b2b2b" // ✅ prevents ugly gaps while image loads
          }}
        >
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-100 h-100"
            style={{
              objectFit: "cover",     // ✅ crops instead of stretching
              display: "block"
            }}
            loading="lazy"
          />
        </div>

        <div className="fw-semibold small text-light text-truncate" title={movie.title}>
          {movie.title}
        </div>
        <div className="text-muted small">{movie.year}</div>
      </div>
    </button>
  );
}
