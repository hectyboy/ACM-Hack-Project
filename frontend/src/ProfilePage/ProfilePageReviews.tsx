// src/ProfilePageReviews.tsx
import React from "react";

export interface FullReview {
  id: string; // ✅ was number
  movieTitle: string;
  movieId?: string; // ✅ optional: link to DB movie later
  rating: string; // e.g. "4/5"
  date: string; // e.g. "2025-01-01" (or ISO string)
  reviewText: string;
  likes?: number;
  comments?: number;
}

interface ProfilePageReviewsProps {
  reviews: FullReview[];
}

/**
 * Reviews tab:
 * Shows full reviews as big stacked cards
 */
const ProfilePageReviews: React.FC<ProfilePageReviewsProps> = ({ reviews }) => {
  return (
    <div>
      <h3 className="h5 mb-3">Reviews</h3>

      {reviews.length === 0 && (
        <div className="card bg-secondary border-0">
          <div className="card-body">
            <p className="mb-0 text-muted">You haven&apos;t written any reviews yet.</p>
          </div>
        </div>
      )}

      {reviews.map((review) => (
        <div key={review.id} className="card bg-secondary border-0 mb-3">
          <div className="card-body">
            {/* Top line: title + rating */}
            <div className="d-flex justify-content-between align-items-center mb-1">
              <div className="fw-semibold">{review.movieTitle}</div>
              <div className="text-warning fw-semibold">{review.rating}</div>
            </div>

            {/* Date */}
            <div className="small text-muted mb-2">{review.date}</div>

            {/* Review text */}
            <p className="mb-0">{review.reviewText}</p>

            {/* Optional footer */}
            {(review.likes || review.comments) && (
              <div className="mt-3 small text-muted">
                {typeof review.likes === "number" && <span>{review.likes} likes</span>}
                {typeof review.comments === "number" && (
                  <span className="ms-3">{review.comments} comments</span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfilePageReviews;
