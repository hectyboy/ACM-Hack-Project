// src/ProfilePageLikes.tsx
import React from "react";

export interface LikedPost {
  id: number;
  text: string;   // short content of the post
  date: string;   // when you liked it
}

export interface LikedMovie {
  id: number;
  title: string;
  year: number;
  imageUrl?: string;
}

export interface LikedDiscussion {
  id: number;
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
 * - Liked posts
 * - Liked movies
 * - Liked discussions
 */
const ProfilePageLikes: React.FC<ProfilePageLikesProps> = ({
  posts,
  movies,
  discussions,
}) => {
  return (
    <div>
      <h3 className="h5 mb-3">Likes</h3>

      {/* Liked posts */}
      <div className="card bg-secondary border-0 mb-3">
        <div className="card-header bg-transparent border-0">
          <h4 className="h6 text-uppercase text-muted mb-0">Liked posts</h4>
        </div>
        <div className="card-body">
          {posts.length === 0 && (
            <p className="mb-0 text-muted">
              You haven&apos;t liked any posts yet.
            </p>
          )}
          {posts.map((post) => (
            <div
              key={post.id}
              className="border-bottom border-dark pb-2 mb-2 small"
            >
              <div>{post.text}</div>
              <div className="text-muted">{post.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Liked movies */}
      <div className="card bg-secondary border-0 mb-3">
        <div className="card-header bg-transparent border-0">
          <h4 className="h6 text-uppercase text-muted mb-0">Liked movies</h4>
        </div>
        <div className="card-body">
          {movies.length === 0 && (
            <p className="mb-0 text-muted">
              You haven&apos;t liked any movies yet.
            </p>
          )}

          <div className="row">
            {movies.map((movie) => (
              <div key={movie.id} className="col-6 col-md-3 mb-3">
                <div className="text-center">
                  <div className="poster-wrapper mb-2">
                    {movie.imageUrl ? (
                      <img src={movie.imageUrl} alt={movie.title} />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100">
                        <span className="small">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="fw-semibold small">{movie.title}</div>
                  <div className="text-muted small">{movie.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Liked discussions */}
      <div className="card bg-secondary border-0">
        <div className="card-header bg-transparent border-0">
          <h4 className="h6 text-uppercase text-muted mb-0">
            Liked discussions
          </h4>
        </div>
        <div className="card-body">
          {discussions.length === 0 && (
            <p className="mb-0 text-muted">
              You haven&apos;t liked any discussions yet.
            </p>
          )}
          {discussions.map((d) => (
            <div
              key={d.id}
              className="d-flex justify-content-between align-items-center border-bottom border-dark pb-2 mb-2 small"
            >
              <div className="fw-semibold">{d.topic}</div>
              <div className="text-muted">Last activity: {d.lastActivity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageLikes;
