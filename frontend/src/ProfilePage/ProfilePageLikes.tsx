// src/ProfilePageLikes.tsx
import React from "react";

export interface LikedPost {
  id: string;
  text: string;
  date: string; // e.g. "2025-06-01"
}

export interface LikedMovie {
  id: string;         // ✅ Mongo-safe string id
  title: string;
  year: string;       // ✅ matches Mongo movies.year
  posterUrl: string;  // ✅ matches Mongo movies.posterUrl
}

export interface LikedDiscussion {
  id: string;
  topic: string;
  lastActivity: string;
}

interface ProfilePageLikesProps {
  posts: LikedPost[];
  movies: LikedMovie[];
  discussions: LikedDiscussion[];
}

/**
 * Likes tab:
 * Shows liked posts, movies, and discussions
 */
const ProfilePageLikes: React.FC<ProfilePageLikesProps> = ({
  posts,
  movies,
  discussions,
}) => {
  return (
    <div>
      <h3 className="h5 mb-3">Likes</h3>

      {/* ===== Liked Movies ===== */}
      <div className="mb-4">
        <h4 className="h6 mb-2">Liked Movies</h4>
        <div className="card bg-secondary border-0">
          <div className="card-body">
            {movies.length === 0 && (
              <p className="mb-0 text-muted">You haven&apos;t liked any movies yet.</p>
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
                            width: "100%",
                            aspectRatio: "2 / 3",
                            objectFit: "cover",
                            borderRadius: 8,
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

      {/* ===== Liked Posts ===== */}
      <div className="mb-4">
        <h4 className="h6 mb-2">Liked Posts</h4>
        <div className="card bg-secondary border-0">
          <div className="card-body p-0">
            {posts.length === 0 && (
              <p className="p-3 mb-0 text-muted">No liked posts yet.</p>
            )}

            {posts.map((post) => (
              <div
                key={post.id}
                className="border-bottom border-dark px-3 py-3"
              >
                <div className="small">{post.text}</div>
                <div className="text-muted small mt-1">{post.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Liked Discussions ===== */}
      <div>
        <h4 className="h6 mb-2">Liked Discussions</h4>
        <div className="card bg-secondary border-0">
          <div className="card-body p-0">
            {discussions.length === 0 && (
              <p className="p-3 mb-0 text-muted">No liked discussions yet.</p>
            )}

            {discussions.map((d) => (
              <div
                key={d.id}
                className="d-flex justify-content-between align-items-center border-bottom border-dark px-3 py-3"
              >
                <div className="fw-semibold">{d.topic}</div>
                <small className="text-muted">{d.lastActivity}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageLikes;
