import { useEffect, useState } from "react";
import ProfilePage from "./ProfilePage/ProfilePage";
import MoviePage from "./MovieFiles/MoviePage";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

type Page = "MoviePage" | "ProfilePage";

const API_BASE = "http://localhost:3000";

type AuthUser = {
  userId: string;
  username: string;
  favoriteMovieIds: string[];
  likedMovieIds: string[];
};

function App() {
  const [page, setPage] = useState<Page>("MoviePage");

  // Auth state (now includes favorites/likes for persistence)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Auth popup state - "login", "signup", or null
  const [showAuthPopup, setShowAuthPopup] = useState<"login" | "signup" | null>(null);

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Signup form state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  async function fetchUserArrays(userId: string) {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to load user profile");
    }

    return {
      favoriteMovieIds: Array.isArray(data.favoriteMovieIds) ? data.favoriteMovieIds : [],
      likedMovieIds: Array.isArray(data.likedMovieIds) ? data.likedMovieIds : [],
    };
  }

  // Restore login on refresh (and pull favorites/likes from Mongo)
  useEffect(() => {
    (async () => {
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      if (!userId || !username) return;

      try {
        const { favoriteMovieIds, likedMovieIds } = await fetchUserArrays(userId);
        setAuthUser({ userId, username, favoriteMovieIds, likedMovieIds });
      } catch {
        // If restore fails, clear stale storage
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        setAuthUser(null);
      }
    })();
  }, []);

  function handleLogout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setAuthUser(null);
    setPage("MoviePage");
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setLoginError(data?.message || "Login failed");
        return;
      }

      const userId: string = data.userId;
      const finalUsername: string = data.username ?? loginUsername;

      // Save login info
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", finalUsername);

      // ✅ fetch favorites/likes from Mongo so buttons stay correct
      const { favoriteMovieIds, likedMovieIds } = await fetchUserArrays(userId);

      setAuthUser({
        userId,
        username: finalUsername,
        favoriteMovieIds,
        likedMovieIds,
      });

      // Close popup and clear form
      setShowAuthPopup(null);
      setLoginUsername("");
      setLoginPassword("");
      setPage("ProfilePage");
    } catch {
      setLoginError("Network error — is the backend running?");
    }
  }
  async function refreshAuthUser() {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  if (!userId || !username) return;

  const res = await fetch(`${API_BASE}/users/${userId}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return;

  setAuthUser({
    userId,
    username,
    favoriteMovieIds: Array.isArray(data.favoriteMovieIds) ? data.favoriteMovieIds : [],
    likedMovieIds: Array.isArray(data.likedMovieIds) ? data.likedMovieIds : [],
  });
}


  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSignupError("");
    setSignupSuccess("");

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: signupUsername, password: signupPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSignupError(data?.message || "Sign up failed");
        return;
      }

      setSignupSuccess("Account created! Please log in.");
      setSignupUsername("");
      setSignupPassword("");
    } catch {
      setSignupError("Network error — is the backend running?");
    }
  }

  function openLoginPopup() {
    setShowAuthPopup("login");
    setLoginError("");
    setLoginUsername("");
    setLoginPassword("");
  }

  function openSignupPopup() {
    setShowAuthPopup("signup");
    setSignupError("");
    setSignupSuccess("");
    setSignupUsername("");
    setSignupPassword("");
  }

  function closeAuthPopup() {
    setShowAuthPopup(null);
    setLoginError("");
    setSignupError("");
    setSignupSuccess("");
  }

  return (
    <>
      {/* Top bar: page nav + auth controls */}
      <div className="p-2 bg-dark text-white d-flex align-items-center justify-content-between">
        <div className="d-flex gap-2">
          <button className="btn btn-outline-light btn-sm" onClick={() => setPage("MoviePage")}>
            Movie Page
          </button>

          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setPage("ProfilePage")}
            disabled={!authUser}
            title={!authUser ? "Log in to view your Profile" : ""}
          >
            Profile Page
          </button>
        </div>

        <div className="d-flex gap-2 align-items-center">
          {authUser ? (
            <>
              <span className="me-2">Hi, {authUser.username}</span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-outline-light btn-sm" onClick={openLoginPopup}>
                Login
              </button>

              <button className="btn btn-primary btn-sm" onClick={openSignupPopup}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pages */}
      {page === "ProfilePage" ? (
        authUser ? (
          <ProfilePage userId={authUser.userId} username={authUser.username} />
        ) : (
          <div className="p-4">
            <div className="alert alert-warning mb-0">Please log in to view your profile.</div>
          </div>
        )
      ) : null}

      {page === "MoviePage" ? (
        <MoviePage userId={authUser?.userId} favoriteMovieIds={authUser?.favoriteMovieIds} />

      ) : null}

      {/* Auth Popup Overlay */}
      {showAuthPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
          onClick={closeAuthPopup}
        >
          {/* Login Popup */}
          {showAuthPopup === "login" && (
            <div
              style={{
                backgroundColor: "#212529",
                borderRadius: "15px",
                border: "1px solid #444",
                width: "100%",
                maxWidth: "450px",
                color: "white",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center p-4 pb-3">
                <h5 className="m-0 fs-3 flex-grow-1 text-center">Log In</h5>
                <button
                  onClick={closeAuthPopup}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    padding: "0",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>

              <div className="px-5 pb-4">
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control bg-secondary text-white border-0"
                      placeholder="Enter your username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control bg-secondary text-white border-0"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  {loginError && (
                    <div className="alert alert-danger py-2" role="alert">
                      {loginError}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                    Sign In
                  </button>
                </form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    New here?{" "}
                    <button
                      type="button"
                      onClick={openSignupPopup}
                      style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        textDecoration: "underline",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Sign up now.
                    </button>
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* Signup Popup */}
          {showAuthPopup === "signup" && (
            <div
              style={{
                backgroundColor: "#212529",
                borderRadius: "15px",
                border: "1px solid #444",
                width: "100%",
                maxWidth: "450px",
                color: "white",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center p-4 pb-3">
                <h5 className="m-0 fs-3 flex-grow-1 text-center">Create Account</h5>
                <button
                  onClick={closeAuthPopup}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    padding: "0",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>

              <div className="px-5 pb-4">
                <form onSubmit={handleSignupSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control bg-secondary text-white border-0"
                      placeholder="Choose a username"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control bg-secondary text-white border-0"
                      placeholder="Choose a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  {signupError && (
                    <div className="alert alert-danger py-2 mt-3" role="alert">
                      {signupError}
                    </div>
                  )}

                  {signupSuccess && (
                    <div className="alert alert-success py-2 mt-3" role="alert">
                      {signupSuccess}
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mt-3">
                    Create Account
                  </button>
                </form>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={openLoginPopup}
                      style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        textDecoration: "underline",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Log in
                    </button>
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
