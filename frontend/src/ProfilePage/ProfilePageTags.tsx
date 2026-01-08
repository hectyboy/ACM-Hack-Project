// src/ProfilePageTags.tsx
import React from "react";

export interface TaggedDiscussion {
  id: string;               // ✅ Mongo-safe string id (can be UUID or Mongo _id as string)
  topic: string;            // Title of the discussion
  tagLabel: string;         // e.g. "@dante" or "#superheroes"
  lastActivity: string;     // ISO date or display string, e.g. "2025-06-01"

  // ✅ optional future wiring fields
  discussionId?: string;    // if your backend later uses a different id field
  tagType?: "mention" | "hashtag";
}

/**
 * Props for the Tags tab component.
 */
interface ProfilePageTagsProps {
  taggedDiscussions: TaggedDiscussion[];
}

/**
 * Tags tab:
 * - Shows discussions where this user has been tagged (@mention, hashtag, etc.)
 */
const ProfilePageTags: React.FC<ProfilePageTagsProps> = ({
  taggedDiscussions,
}) => {
  return (
    <div>
      <h3 className="h5 mb-3">Tagged in Discussions</h3>

      <div className="card bg-secondary border-0">
        <div className="card-body p-0">
          {taggedDiscussions.length === 0 && (
            <p className="p-3 mb-0 text-muted">
              You haven&apos;t been tagged in any discussions yet.
            </p>
          )}

          {taggedDiscussions.map((item) => (
            <div
              key={item.id}
              className="d-flex justify-content-between align-items-center border-bottom border-dark px-3 py-3"
            >
              <div>
                <div className="fw-semibold">{item.topic}</div>

                <div className="small mt-1">
                  <span className="badge bg-light text-dark me-2">
                    {item.tagLabel}
                  </span>

                  <span className="text-muted">
                    {item.tagType === "hashtag"
                      ? "Tagged via hashtag"
                      : item.tagType === "mention"
                      ? "Tagged via mention"
                      : "You were tagged in this discussion"}
                  </span>
                </div>
              </div>

              <small className="text-muted">{item.lastActivity}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageTags;
