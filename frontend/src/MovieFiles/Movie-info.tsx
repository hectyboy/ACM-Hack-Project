import React, { useEffect, useState } from "react";
import type { Movie } from "./MovieCatalog";

const API_BASE = "http://localhost:3000";

type Props = {
  movie: Movie;
  onBack: () => void;
  userId?: string;

  isFavorited: boolean;
  onFavoriteChanged?: (movieId: string, favorited: boolean) => void;

  // optional: lets MovieInfo refresh App auth arrays (favorites) if you wired Option A
  refreshAuthUser?: () => Promise<void>;
};

type StarRatingProps = {
  disabled?: boolean;
  value: number;
  onChange: (rating: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({ disabled, value, onChange }) => {
  const [hover, setHover] = useState<number>(0);

  return (
    <div>
      <div className="d-flex gap-1 justify-content-center">
        {[...Array(5)].map((_, idx) => {
          const val = idx + 1;
          const active = val <= (hover || value);

          return (
            <button
              key={val}
              type="button"
              className={`btn btn-sm ${active ? "btn-warning" : "btn-outline-light"}`}
              onClick={() => !disabled && onChange(val)}
              onMouseEnter={() => !disabled && setHover(val)}
              onMouseLeave={() => !disabled && setHover(0)}
              disabled={disabled}
              aria-label={`Rate ${val} stars`}
            >
              ★
            </button>
          );
        })}
      </div>

      <p className="text-center mt-2 mb-0 small text-muted">
        {disabled ? "Log in to rate" : value > 0 ? `You rated this ${value} stars!` : "Click to rate"}
      </p>
    </div>
  );
};

export default function MovieInfo({
  movie,
  onBack,
  userId,
  isFavorited,
  onFavoriteChanged,
  refreshAuthUser,
}: Props) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [savingFav, setSavingFav] = useState(false);

  const [rating, setRating] = useState<number>(0);
  const [savingRate, setSavingRate] = useState(false);
  const [rateMsg, setRateMsg] = useState<string>("");

  useEffect(() => {
    setFavorited(isFavorited);
  }, [isFavorited, movie.id]);

  async function toggleFavorite() {
    if (!userId || savingFav) return;

    setSavingFav(true);
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to favorite");

      // Your backend currently always adds (no unfavorite yet), so treat as "true"
      const newFavorited = typeof data?.favorited === "boolean" ? data.favorited : true;

      setFavorited(newFavorited);
      onFavoriteChanged?.(movie.id, newFavorited);

      await refreshAuthUser?.();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingFav(false);
    }
  }

  async function saveRating(val: number) {
    if (!userId || savingRate) return;

    setSavingRate(true);
    setRateMsg("");

    try {
      const res = await fetch(`${API_BASE}/users/${userId}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie.id,
          rating: `${val}/5`,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to save rating");

      setRateMsg("Saved to Recent Activity ✓");
      setTimeout(() => setRateMsg(""), 1500);
    } catch (err) {
      console.error(err);
      setRateMsg("Could not save rating");
      setTimeout(() => setRateMsg(""), 2000);
    } finally {
      setSavingRate(false);
    }
  }

  return (
    <div>
      <button className="btn btn-outline-light mb-3" onClick={onBack}>
        ← Back
      </button>

      <div className="card bg-secondary border-0">
        <div className="card-body">
          <div className="row g-4">
            {/* LEFT */}
            <div className="col-md-4">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="img-fluid rounded"
                style={{ aspectRatio: "2 / 3", objectFit: "cover", width: "100%" }}
              />

              {/* FAVORITE BUTTON */}
              <div className="d-grid mt-3">
                <button
                  className={`btn ${favorited ? "btn-warning" : "btn-outline-warning"}`}
                  onClick={toggleFavorite}
                  disabled={!userId || savingFav}
                  title={!userId ? "Log in to favorite movies" : ""}
                >
                  {savingFav ? "Saving..." : favorited ? "★ Favorited" : "☆ Favorite"}
                </button>
              </div>

              {/* ⭐ RATING (SAVES TO MONGO ACTIVITIES) */}
              <div className="mt-3">
                <StarRating
                  disabled={!userId || savingRate}
                  value={rating}
                  onChange={(val) => {
                    setRating(val);
                    saveRating(val);
                  }}
                />
                {rateMsg && <div className="text-center small text-muted mt-2">{rateMsg}</div>}
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-md-8">
              <h2 className="h3 mb-1">{movie.title}</h2>
              <div className="text-muted mb-3">{movie.reviewInfo}</div>

              <div className="ratio ratio-16x9 mb-3">
                <iframe
                  src={movie.trailerUrl}
                  title="YouTube trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <p className="mb-0">{movie.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
