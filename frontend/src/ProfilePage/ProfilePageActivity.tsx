import React from "react";

/**
 * A single review the user has written.
 * Mongo-friendly: ids are strings.
 */
export interface Review {
  id: string;          // ✅ was number
  movieTitle: string;  // e.g. "Spider-Man"
  movieId?: string;    // ✅ optional: ties to Mongo movie id later
  rating: string;      // e.g. "4/5"
  date: string;        // e.g. "2025-01-01" (or ISO string)
}

/**
 * A discussion thread the user has participated in.
 * Mongo-friendly: ids are strings.
 */
export interface Discussion {
  id: string;          // ✅ was number
  topic: string;       // title of the discussion
  lastActivity: string;// when it was last active (or ISO string)
}

/**
 * Props for the Activity tab component.
 */
interface ProfilePageActivityProps {
  reviews: Review[];
  discussions: Discussion[];
}

/**
 * Activity tab:
 * - Recent Movie Reviews
 * - Recent Discussions
 */
const ProfilePageActivity: React.FC<ProfilePageActivityProps> = ({
  reviews,
  discussions,
}) => {
  return (
    <div>
      {/* ===== Recent Movie Reviews ===== */}
      <div className="mb-4">
        <h3 className="h5 mb-3">Recent Movie Reviews</h3>

        <div className="card bg-secondary border-0">
          <div className="card-body p-0">
            {reviews.length === 0 && (
              <p className="p-3 mb-0 text-muted">
                No reviews yet. Go log your first one!
              </p>
            )}

            {reviews.map((review) => (
              <div
                key={review.id}
                className="d-flex justify-content-between align-items-center border-bottom border-dark px-3 py-2"
              >
                <div>
                  <span className="fw-semibold">{review.movieTitle}</span>
                  <span className="ms-2 text-warning">{review.rating}</span>
                </div>

                <small className="text-muted">{review.date}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Recent Discussions ===== */}
      <div>
        <h3 className="h5 mb-3">Recent Discussions</h3>

        <div className="card bg-secondary border-0">
          <div className="card-body p-0">
            {discussions.length === 0 && (
              <p className="p-3 mb-0 text-muted">
                No discussions yet. Join a conversation!
              </p>
            )}

            {discussions.map((discussion) => (
              <div
                key={discussion.id}
                className="d-flex justify-content-between align-items-center border-bottom border-dark px-3 py-2"
              >
                <div className="fw-semibold">{discussion.topic}</div>

                <small className="text-muted">
                  Last activity: {discussion.lastActivity}
                </small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageActivity;
