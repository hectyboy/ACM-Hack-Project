// src/ProfilePageWatchlist.tsx
import React from "react";

export interface WatchlistMovie {
  id: string;              // ✅ Mongo-safe string id
  movieId?: string;        // ✅ future backend wiring
  title: string;
  year: string;            // ✅ matches Mongo movies.year
  posterUrl: string;       // ✅ matches Mongo movies.posterUrl
}

interface ProfilePageWatchlistProps {
  movies: WatchlistMovie[];
}

/**
 * Watchlist tab:
 * Shows movies the user wants to watch, as posters with title + year.
 */
const ProfilePageWatchlist: React.FC<ProfilePageWatchlistProps> = ({
  movies,
}) => {
  return (
    <div>
      <h3 className="h5 mb-3">Watchlist</h3>

      <div className="card bg-secondary border-0">
        <div className="card-body">
          {movies.length === 0 && (
            <p className="mb-0 text-muted">
              Your watchlist is empty. Start adding some movies!
            </p>
          )}

          {movies.length > 0 && (
            <div className="row">
              {movies.map((movie) => (
                <div key={movie.id} className="col-6 col-md-3 mb-3">
                  <div className="text-center">
                    <div className="poster-wrapper mb-2">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        style={{
                          aspectRatio: "2 / 3",
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />
                    </div>

                    <div className="fw-semibold small">{movie.title}</div>
                    <div className="text-muted small">{movie.year}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageWatchlist;
