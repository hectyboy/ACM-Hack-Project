// src/ProfilePageNetwork.tsx
import React, { useState } from "react";

export interface NetworkContact {
  id: number;
  name: string;
  avatarUrl?: string;
  bioSnippet?: string;        // short description like "Film student" etc.
  mutualConnections?: number; // e.g. 3 mutual friends
}

interface ProfilePageNetworkProps {
  contacts: NetworkContact[];
}

/**
 * Network tab:
 * - Shows people you might connect with
 * - "Connect" button under each avatar, similar to LinkedIn
 */
const ProfilePageNetwork: React.FC<ProfilePageNetworkProps> = ({ contacts }) => {
  // Track connection status for each contact
  const [status, setStatus] = useState<Record<number, "none" | "connected">>(() => {
    const initial: Record<number, "none" | "connected"> = {};
    contacts.forEach((c) => {
      initial[c.id] = "none";
    });
    return initial;
  });

  const handleConnect = (id: number) => {
    setStatus((prev) => ({ ...prev, [id]: "connected" }));
  };

  return (
    <div>
      <h3 className="h5 mb-3">Your Network</h3>

      <div className="card bg-secondary border-0">
        <div className="card-body">
          {contacts.length === 0 && (
            <p className="mb-0 text-muted">
              No suggestions right now. Start logging films to find people with similar taste!
            </p>
          )}

          <div className="row">
            {contacts.map((person) => {
              const isConnected = status[person.id] === "connected";

              return (
                <div key={person.id} className="col-6 col-md-4 mb-4">
                  <div className="d-flex flex-column align-items-center">
                    {/* Avatar circle */}
                    <div
                      className="rounded-circle bg-dark d-flex justify-content-center align-items-center mb-2"
                      style={{ width: "140px", height: "140px", overflow: "hidden" }}
                    >
                      {person.avatarUrl ? (
                        <img
                          src={person.avatarUrl}
                          alt={person.name}
                          className="img-fluid"
                        />
                      ) : (
                        <span className="fw-semibold small">Picture</span>
                      )}
                    </div>

                    {/* Name */}
                    <div className="fw-semibold mb-1">{person.name}</div>

                    {/* Optional subtitle line */}
                    {person.bioSnippet && (
                      <div className="small text-muted text-center mb-1">
                        {person.bioSnippet}
                      </div>
                    )}

                    {typeof person.mutualConnections === "number" && (
                      <div className="small text-muted mb-2">
                        {person.mutualConnections} mutual connections
                      </div>
                    )}

                    {/* Connect button */}
                    <button
                      className={`btn ${
                        isConnected ? "btn-outline-light" : "btn-primary"
                      } btn-sm px-4`}
                      onClick={() => handleConnect(person.id)}
                      disabled={isConnected}
                    >
                      {isConnected ? "Connected" : "Connect"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageNetwork;
