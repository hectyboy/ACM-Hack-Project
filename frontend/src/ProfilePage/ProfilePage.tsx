// src/ProfilePage.tsx
import React, { useState } from "react";

import ProfilePageActivity, {
  type Review,
  type Discussion,
} from "./ProfilePageActivity";

import ProfilePageTags, {
  type TaggedDiscussion,
} from "./ProfilePageTags";

import ProfilePageNetwork, {
  type NetworkContact,
} from "./ProfilePageNetwork";

import ProfilePageReviews, {
  type FullReview,
} from "./ProfilePageReviews";

import ProfilePageWatchlist, {
  type WatchlistMovie,
} from "./ProfilePageWatchlist";

import ProfilePageLikes, {
  type LikedPost,
  type LikedMovie,
  type LikedDiscussion,
} from "./ProfilePageLikes";


/* ───────────────────────────────────────────
   PROFILE TAB TYPE (Films removed)
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
  username: string;
  avatarUrl?: string;
  bio?: string;
}

interface Film {
  id: number;
  title: string;
  year: number;
  imageUrl: string;
}

interface ActivityItem {
  id: number;
  action: string;
  movieTitle: string;
  rating?: string;
  date: string;
}


/* ───────────────────────────────────────────
   DUMMY SECTIONS (Same as before)
──────────────────────────────────────────── */

const favoriteMovies: Film[] = [
  {
    id: 1,
    title: "Spider-Man",
    year: 2002,
    imageUrl: "https://m.media-amazon.com/images/I/71Ff5WRGVLL.jpg",
  },
  {
    id: 2,
    title: "Thunderbolts*",
    year: 2025,
    imageUrl:
      "https://m.media-amazon.com/images/I/61nRTBkcOEL._AC_UF894,1000_QL80_.jpg",
  },
  {
    id: 3,
    title: "The Avengers",
    year: 2012,
    imageUrl: "https://i.ebayimg.com/images/g/1MUAAOSwoLpfJHqq/s-l1200.jpg",
  },
  {
    id: 4,
    title: "Superman",
    year: 2025,
    imageUrl:
      "https://m.media-amazon.com/images/I/51kO0GWyCIL._AC_UF894,1000_QL80_.jpg",
  },
];

const recentActivity: ActivityItem[] = [
  {
    id: 1,
    action: "reviewed",
    movieTitle: "Spider-Man",
    rating: "4/5",
    date: "2023-01-01",
  },
  {
    id: 2,
    action: "watched",
    movieTitle: "Thunderbolts*",
    date: "2025-05-30",
  },
  {
    id: 3,
    action: "reviewed",
    movieTitle: "The Avengers",
    rating: "4/5",
    date: "2023-03-01",
  },
  {
    id: 4,
    action: "watched",
    movieTitle: "Superman",
    date: "2025-07-16",
  },
];

const recentReviews: Review[] = [
  { id: 1, movieTitle: "Spider-Man", rating: "4/5", date: "2023-01-01" },
  { id: 2, movieTitle: "Thunderbolts*", rating: "3/5", date: "2025-05-30" },
];

const recentDiscussions: Discussion[] = [
  {
    id: 1,
    topic: "Best MCU Phase 1 movie?",
    lastActivity: "2025-06-01",
  },
  {
    id: 2,
    topic: "Underrated superhero films",
    lastActivity: "2025-06-15",
  },
];

const taggedDiscussions: TaggedDiscussion[] = [
  {
    id: 1,
    topic: "Spider-Man rewatch thread",
    tagLabel: "@dante",
    lastActivity: "2025-06-05",
  },
  {
    id: 2,
    topic: "Top 10 superhero movies of all time",
    tagLabel: "@dante",
    lastActivity: "2025-06-10",
  },
  {
    id: 3,
    topic: "Underrated MCU villains",
    tagLabel: "#mcu",
    lastActivity: "2025-06-18",
  },
];

const networkSuggestions: NetworkContact[] = [
  {
    id: 1,
    name: "Alex Johnson",
    avatarUrl: "",
    bioSnippet: "Film student • Loves superheroes",
    mutualConnections: 3,
  },
  {
    id: 2,
    name: "Morgan Lee",
    avatarUrl: "",
    bioSnippet: "Horror & indie fan",
    mutualConnections: 1,
  },
  {
    id: 3,
    name: "Sam Patel",
    avatarUrl: "",
    bioSnippet: "MCU completionist",
    mutualConnections: 5,
  },
  {
    id: 4,
    name: "Jordan Smith",
    avatarUrl: "",
    bioSnippet: "Action & sci-fi",
    mutualConnections: 2,
  },
];

const allReviews: FullReview[] = [
  {
    id: 1,
    movieTitle: "Spider-Man",
    rating: "4/5",
    date: "2023-01-01",
    reviewText:
      "Still one of my favorite superhero origin stories...",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    movieTitle: "The Avengers",
    rating: "4/5",
    date: "2023-03-01",
    reviewText:
      "The big crossover that actually works...",
    likes: 8,
    comments: 2,
  },
];

const watchlistMovies: WatchlistMovie[] = [
  {
    id: 1,
    title: "Spider-Man 2",
    year: 2004,
    imageUrl: "https://m.media-amazon.com/images/I/51eT6luMLyL._AC_.jpg",
  },
];

const likedPosts: LikedPost[] = [
  {
    id: 1,
    text: "Just finished my MCU rewatch and Spider-Man still hits hardest.",
    date: "2025-06-01",
  },
];

const likedMovies: LikedMovie[] = [
  {
    id: 1,
    title: "Spider-Man",
    year: 2002,
    imageUrl: "https://m.media-amazon.com/images/I/71Ff5WRGVLL.jpg",
  },
];

const likedDiscussions: LikedDiscussion[] = [
  {
    id: 1,
    topic: "Best superhero trilogies",
    lastActivity: "2025-06-05",
  },
];


/* ───────────────────────────────────────────
   BUTTON COMPONENT
──────────────────────────────────────────── */

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

const ProfilePage: React.FC<ProfilePageProps> = ({
  username,
  avatarUrl,
  bio,
}) => {

  const [activeTab, setActiveTab] = useState<ProfileTab>("none");

  return (
    <div className="bg-dark text-light min-vh-100">

      <nav className="navbar navbar-dark bg-secondary mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Letterboxd Clone</span>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row mb-4">

          {/* LEFT SIDE */}
          <div className="col-md-3 d-flex flex-column align-items-center">

            <div
              className="rounded-circle bg-secondary d-flex justify-content-center align-items-center mb-3"
              style={{ width: "160px", height: "160px", overflow: "hidden" }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={username} className="img-fluid" />
              ) : (
                <span className="fw-semibold">Profile Picture</span>
              )}
            </div>

            <h2 className="h4">{username}</h2>

            <div className="mt-3 w-100">
              <h3 className="h6 text-uppercase text-muted">Bio</h3>
              <div className="p-3 bg-secondary rounded">
                <p className="mb-0">
                  {bio || "This user hasn’t added a bio yet."}
                </p>
              </div>
            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="col-md-9">

            <ul className="nav nav-tabs mb-3">

              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "activity" ? "active" : ""}`}
                  onClick={() => setActiveTab("activity")}
                >
                  Activity
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "watchlist" ? "active" : ""}`}
                  onClick={() => setActiveTab("watchlist")}
                >
                  Watchlist
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "likes" ? "active" : ""}`}
                  onClick={() => setActiveTab("likes")}
                >
                  Likes
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "tags" ? "active" : ""}`}
                  onClick={() => setActiveTab("tags")}
                >
                  Tags
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "network" ? "active" : ""}`}
                  onClick={() => setActiveTab("network")}
                >
                  Network
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </button>
              </li>

            </ul>


            {/* Back Button */}
            {activeTab !== "none" && (
              <BackToProfileButton onClick={() => setActiveTab("none")} />
            )}


            {/* HOME VIEW */}
            {activeTab === "none" && (
              <>
                <div className="mb-4">
                  <h3 className="h5 mb-3">Favorite Movies</h3>
                  <div className="card bg-secondary border-0">
                    <div className="card-body">
                      <div className="row">
                        {favoriteMovies.map((movie) => (
                          <div
                            key={movie.id}
                            className="col-6 col-md-3 mb-3"
                          >
                            <div className="text-center">
                              <div className="poster-wrapper mb-2">
                                <img src={movie.imageUrl} alt={movie.title} />
                              </div>
                              <div className="fw-semibold small">
                                {movie.title}
                              </div>
                              <div className="text-muted small">
                                {movie.year}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="h5 mb-3">Recent Activity</h3>

                  <div className="card bg-secondary border-0">
                    <div className="card-body p-0">

                      {recentActivity.map((item) => (
                        <div
                          key={item.id}
                          className="d-flex justify-content-between align-items-center border-bottom border-dark px-3 py-2"
                        >
                          <div>
                            <span className="fw-semibold">
                              {item.action} {item.movieTitle}
                            </span>
                            {item.rating && (
                              <span className="ms-2 text-warning">
                                {item.rating}
                              </span>
                            )}
                          </div>
                          <small className="text-muted">{item.date}</small>
                        </div>
                      ))}

                    </div>
                  </div>

                </div>
              </>
            )}


            {/* ACTIVITY */}
            {activeTab === "activity" && (
              <ProfilePageActivity
                reviews={recentReviews}
                discussions={recentDiscussions}
              />
            )}


            {/* WATCHLIST */}
            {activeTab === "watchlist" && (
              <ProfilePageWatchlist movies={watchlistMovies} />
            )}


            {/* LIKES */}
            {activeTab === "likes" && (
              <ProfilePageLikes
                posts={likedPosts}
                movies={likedMovies}
                discussions={likedDiscussions}
              />
            )}


            {/* TAGS */}
            {activeTab === "tags" && (
              <ProfilePageTags taggedDiscussions={taggedDiscussions} />
            )}


            {/* NETWORK */}
            {activeTab === "network" && (
              <ProfilePageNetwork contacts={networkSuggestions} />
            )}


            {/* REVIEWS */}
            {activeTab === "reviews" && (
              <ProfilePageReviews reviews={allReviews} />
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
