// src/ProfilePage/ProfilePage.tsx
import React, { useEffect, useMemo, useState } from "react";
import MovieInfo from "../MovieFiles/Movie-info";

import ProfilePageActivity, { type Review, type Discussion } from "./ProfilePageActivity";
import ProfilePageTags, { type TaggedDiscussion } from "./ProfilePageTags";
import ProfilePageNetwork, { type NetworkContact } from "./ProfilePageNetwork";
import ProfilePageReviews, { type FullReview } from "./ProfilePageReviews";
import ProfilePageWatchlist, { type WatchlistMovie } from "./ProfilePageWatchlist";
import ProfilePageLikes, { type LikedPost, type LikedMovie, type LikedDiscussion } from "./ProfilePageLikes";

/* ───────────────────────────────────────────
   CONFIG
──────────────────────────────────────────── */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

/* ───────────────────────────────────────────
   PROFILE TAB TYPE
──────────────────────────────────────────── */
type ProfileTab =
  | "none"
  | "activity"
  | "watchlist"
  | "likes"
  | "tags"
  | "network"
  | "reviews";

/* ───────────────────────────────────────────
   PROPS
──────────────────────────────────────────── */
interface ProfilePageProps {
  userId: string;
  username: string;
}

/* ───────────────────────────────────────────
   BACKEND TYPES
──────────────────────────────────────────── */
interface DbMovie {
  id: string;
  title: string;
  category: string;
  year: string;
  posterUrl: string;
  trailerUrl: string;
  description: string;
  reviewInfo: string;
}

type UserActivity = {
  type: "liked" | "favorited" | "reviewed" | "watched";
  movieId: string;
  date: string;
  rating?: string;
};

interface UserProfile {
  uuid: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  likedMovieIds: string[];
  favoriteMovieIds: string[];
  activities: UserActivity[];
}

/* ───────────────────────────────────────────
   DUMMY TAB DATA (safe placeholders)
──────────────────────────────────────────── */
const recentReviews: Review[] = [
  { id: "review-1", movieTitle: "Spider-Man", rating: "4/5", date: "2023-01-01" },
];

const recentDiscussions: Discussion[] = [
  { id: "discussion-1", topic: "Best MCU Phase 1 movie?", lastActivity: "2025-06-01" },
];

const taggedDiscussions: TaggedDiscussion[] = [
  { id: "tag-1", topic: "Spider-Man rewatch thread", tagLabel: "@joe", lastActivity: "2025-06-05" },
];

const networkSuggestions: NetworkContact[] = [
  { id: "net-1", name: "Alex Johnson", avatarUrl: "", bioSnippet: "Film student", mutualConnections: 3 },
];

const allReviews: FullReview[] = [
  {
    id: "full-review-1",
    movieTitle: "Spider-Man",
    rating: "4/5",
    date: "2023-01-01",
    reviewText: "Still one of my favorite superhero origin stories.",
    likes: 12,
    comments: 3,
  },
];

const watchlistMovies: WatchlistMovie[] = [
  {
    id: "watch-1",
    title: "Spider-Man 2",
    year: "2004",
    posterUrl: "https://m.media-amazon.com/images/I/51eT6luMLyL._AC_.jpg",
  },
];

const likedPosts: LikedPost[] = [
  { id: "post-1", text: "Just finished my MCU rewatch and Spider-Man still hits hardest.", date: "2025-06-01" },
];

const likedDiscussions: LikedDiscussion[] = [
  { id: "discussion-like-1", topic: "Best superhero trilogies", lastActivity: "2025-06-05" },
];

/* ───────────────────────────────────────────
   UTIL
──────────────────────────────────────────── */
function formatDate(iso: string) {
  return iso.slice(0, 10);
}

function BackToProfileButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="btn btn-outline-light mb-3" onClick={onClick}>
      ← Back to Profile
    </button>
  );
}

/* ───────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────── */
const ProfilePage: React.FC<ProfilePageProps> = ({ userId, username }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("none");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [movies, setMovies] = useState<DbMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ when a favorite poster is clicked, show MovieInfo
  const [selectedMovie, setSelectedMovie] = useState<DbMovie | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [pRes, mRes] = await Promise.all([
          fetch(`${API_BASE}/users/${userId}`),
          fetch(`${API_BASE}/movies`),
        ]);

        const pData = await pRes.json().catch(() => ({}));
        const mData = await mRes.json().catch(() => []);

        if (!pRes.ok) throw new Error(pData?.message || "Failed to load profile");
        if (!mRes.ok) throw new Error((mData as any)?.message || "Failed to load movies");

        if (cancelled) return;

        // ✅ guard against undefined arrays (prevents .map crash)
        const safeProfile: UserProfile = {
          uuid: pData.uuid,
          username: pData.username,
          avatarUrl: pData.avatarUrl,
          bio: pData.bio,
          likedMovieIds: Array.isArray(pData.likedMovieIds) ? pData.likedMovieIds : [],
          favoriteMovieIds: Array.isArray(pData.favoriteMovieIds) ? pData.favoriteMovieIds : [],
          activities: Array.isArray(pData.activities) ? pData.activities : [],
        };

        setProfile(safeProfile);
        setMovies(Array.isArray(mData) ? mData : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const movieById = useMemo(() => {
    const map = new Map<string, DbMovie>();
    movies.forEach((m) => map.set(m.id, m));
    return map;
  }, [movies]);

  const favoriteMovies = useMemo(() => {
    if (!profile) return [];
    return profile.favoriteMovieIds
      .map((id) => movieById.get(id))
      .filter(Boolean) as DbMovie[];
  }, [profile, movieById]);

  const likedMovies: LikedMovie[] = useMemo(() => {
    if (!profile) return [];
    return profile.likedMovieIds
      .map((id) => movieById.get(id))
      .filter(Boolean)
      .map((m) => ({
        id: m!.id,
        title: m!.title,
        year: m!.year,
        posterUrl: m!.posterUrl,
      }));
  }, [profile, movieById]);

  const recentActivity = useMemo(() => {
    if (!profile) return [];
    return [...profile.activities]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((a, i) => ({
        id: `activity-${i}`,
        action: a.type,
        movieTitle: movieById.get(a.movieId)?.title || "Unknown",
        rating: a.rating,
        date: formatDate(a.date),
      }));
  }, [profile, movieById]);

  // ✅ If a favorite is clicked, show the movie info page
  if (selectedMovie) {
    const isFavorited = profile?.favoriteMovieIds.includes(selectedMovie.id) ?? false;

    return (
      <div className="bg-dark text-light min-vh-100 p-4">
        <MovieInfo
          movie={{
            id: selectedMovie.id,
            title: selectedMovie.title,
            posterUrl: selectedMovie.posterUrl,
            trailerUrl: selectedMovie.trailerUrl,
            description: selectedMovie.description,
            reviewInfo: selectedMovie.reviewInfo,
            category: selectedMovie.category,
            year: selectedMovie.year,
          }}
          onBack={() => setSelectedMovie(null)}
          userId={userId}
          isFavorited={isFavorited}
        />
      </div>
    );
  }

  if (loading) return <div className="text-light p-4">Loading profile…</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;
  if (!profile) return <div className="alert alert-danger m-3">Profile not found.</div>;

  return (
    <div className="bg-dark text-light min-vh-100">
      <nav className="navbar navbar-dark bg-secondary mb-4">
        <div className="container-fluid">
          <span className="navbar-brand">Letterboxd Clone</span>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* LEFT */}
          <div className="col-md-3 text-center">
            <div
              className="rounded-circle bg-secondary mx-auto mb-3"
              style={{ width: 160, height: 160 }}
            />
            <h2 className="h5">{profile.username || username}</h2>
            <div className="bg-secondary p-3 rounded mt-3">
              {profile.bio || "This user hasn’t added a bio yet."}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-md-9">
            <ul className="nav nav-tabs mb-3">
              {["activity", "watchlist", "likes", "tags", "network", "reviews"].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab as ProfileTab)}
                    style={{ textTransform: "capitalize" }}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>

            {activeTab !== "none" && (
              <BackToProfileButton onClick={() => setActiveTab("none")} />
            )}

            {activeTab === "none" && (
              <>
                <h3 className="h5 mb-3">Favorite Movies</h3>

                {favoriteMovies.length === 0 ? (
                  <div className="card bg-secondary border-0">
                    <div className="card-body">
                      <p className="mb-0 text-muted">No favorites yet.</p>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {favoriteMovies.map((m) => (
                      <div
                        key={m.id}
                        className="col-6 col-md-3 mb-3 text-center"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedMovie(m)}
                        title="Open movie"
                      >
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="img-fluid rounded mb-2"
                          style={{ aspectRatio: "2 / 3", objectFit: "cover", width: "100%" }}
                        />
                        <div className="small fw-semibold">{m.title}</div>
                        <div className="text-muted small">{m.year}</div>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="h5 mt-4 mb-3">Recent Activity</h3>
                {recentActivity.length === 0 ? (
                  <div className="card bg-secondary border-0">
                    <div className="card-body">
                      <p className="mb-0 text-muted">No activity yet.</p>
                    </div>
                  </div>
                ) : (
                  recentActivity.map((a) => (
                    <div key={a.id} className="border-bottom border-dark py-2">
                      <strong style={{ textTransform: "capitalize" }}>{a.action}</strong>{" "}
                      {a.movieTitle}
                      {a.rating && <span className="text-warning ms-2">{a.rating}</span>}
                      <span className="text-muted float-end">{a.date}</span>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === "activity" && (
              <ProfilePageActivity reviews={recentReviews} discussions={recentDiscussions} />
            )}

            {activeTab === "watchlist" && <ProfilePageWatchlist movies={watchlistMovies} />}

            {activeTab === "likes" && (
              <ProfilePageLikes posts={likedPosts} movies={likedMovies} discussions={likedDiscussions} />
            )}

            {activeTab === "tags" && <ProfilePageTags taggedDiscussions={taggedDiscussions} />}

            {activeTab === "network" && <ProfilePageNetwork contacts={networkSuggestions} />}

            {activeTab === "reviews" && <ProfilePageReviews reviews={allReviews} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
