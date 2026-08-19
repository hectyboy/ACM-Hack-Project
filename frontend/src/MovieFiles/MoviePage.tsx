import { useEffect, useMemo, useState } from "react";
import MovieCatalog, { type Movie } from "./MovieCatalog";
import MovieInfo from "./Movie-info";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

type MoviePageProps = {
  userId?: string;
  favoriteMovieIds?: string[];
  refreshAuthUser?: () => Promise<void>;
};


export default function MoviePage({ userId, favoriteMovieIds }: MoviePageProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");

  // Local “view” of favorites so the UI can update immediately on toggle
  // (still seeded from Mongo-backed props)
  const [favIds, setFavIds] = useState<string[]>(favoriteMovieIds ?? []);

  // Keep local favorites in sync if parent updates (login refresh, etc.)
  useEffect(() => {
    setFavIds(favoriteMovieIds ?? []);
  }, [favoriteMovieIds]);

  // ✅ Movies loaded from backend
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* const MOCK_MOVIES: Movie[] = [
    {
      id: "1",
      title: "Inception",
      category: "Sci-Fi",
      year: "2010",
      posterUrl: "https://image.tmdb.org/t/p/w500/l4P14319R2fPCoP333144.jpg",
      trailerUrl: "",
      description: "A thief who steals corporate secrets through dream-sharing technology.",
      reviewInfo: ""
    },
    {
      id: "2",
      title: "Interstellar",
      category: "Sci-Fi",
      year: "2014",
      posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6Mxl4vR31.jpg",
      trailerUrl: "",
      description: "A team of explorers travel through a wormhole in space.",
      reviewInfo: ""
    }
  ];
  */ 
  
  // Fetch movies once on mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError("");
        setLoading(true);

        const res = await fetch(`${API_BASE}/movies`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load movies");
        }

        if (!cancelled) setMovies(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error loading movies");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Derived lists
  const exploreMovies = useMemo(
    () => movies.filter((m) => m.category === "Explore"),
    [movies]
  );

  const topRatedMovies = useMemo(
    () => movies.filter((m) => m.category === "Top Rated"),
    [movies]
  );

  const filterList = (list: Movie[]) => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((m) => m.title.toLowerCase().includes(q));
  };

  // Used by MovieInfo to update the indicator immediately after toggle
  function handleFavoriteChanged(movieId: string, favorited: boolean) {
    setFavIds((prev) => {
      const has = prev.includes(movieId);
      if (favorited) {
        return has ? prev : [...prev, movieId];
      } else {
        return has ? prev.filter((id) => id !== movieId) : prev;
      }
    });
  }

  const isSelectedFavorited =
    selectedMovie ? favIds.includes(selectedMovie.id) : false;

  return (
    <div className="bg-dark text-light min-vh-100">
      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-secondary sticky-top">
        <div className="container-fluid">
          <a
            className="navbar-brand"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedMovie(null);
            }}
          >
            MovieHub
          </a>

          <div className="d-flex align-items-center gap-2">
            <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search Movies"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn btn-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="container-fluid py-4">
        {loading ? (
          <div className="text-center text-light py-5">Loading movies...</div>
        ) : error ? (
          <div className="alert alert-danger mx-auto" style={{ maxWidth: 720 }}>
            {error}
            <div className="mt-2">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        ) : selectedMovie ? (
          <MovieInfo
            movie={selectedMovie}
            onBack={() => setSelectedMovie(null)}
            userId={userId}
            isFavorited={isSelectedFavorited}
            onFavoriteChanged={handleFavoriteChanged}
          />
        ) : (
          <>
            <MovieCatalog
              title="Explore More"
              movies={filterList(exploreMovies)}
              onMovieClick={setSelectedMovie}
            />
            <MovieCatalog
              title="Top Rated"
              movies={filterList(topRatedMovies)}
              onMovieClick={setSelectedMovie}
            />
          </>
        )}
      </div>
    </div>
  );
}
