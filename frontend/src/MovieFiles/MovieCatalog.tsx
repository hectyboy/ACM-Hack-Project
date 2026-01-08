import MovieCard from "./MovieCard";

export type Movie = {
  id: string;
  title: string;
  category: string;
  year: string;
  posterUrl: string;
  trailerUrl: string;
  description: string;
  reviewInfo: string;
};

type Props = {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
};

export default function MovieCatalog({ title, movies, onMovieClick }: Props) {
  return (
    <div className="mb-4">
      <div className="d-flex align-items-baseline justify-content-between mb-2">
        <h3 className="h5 mb-0">{title}</h3>
        <small className="text-muted">{movies.length ? `${movies.length} titles` : ""}</small>
      </div>

      <div className="card bg-secondary border-0">
        <div className="card-body py-3">
          {movies.length === 0 ? (
            <div className="text-center text-muted py-4">No movies found.</div>
          ) : (
            <div className="netflix-row">
              {movies.map((movie) => (
                <div key={movie.id} className="netflix-item">
                  <MovieCard movie={movie} onSelect={onMovieClick} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
