const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  const users = db.collection("users");

  // GET /users/:userId  -> profile data for frontend
  router.get("/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await users.findOne(
        { uuid: userId },
        {
          projection: {
            _id: 0,
            uuid: 1,
            username: 1,
            avatarUrl: 1,
            bio: 1,
            likedMovieIds: 1,
            favoriteMovieIds: 1,
            activities: 1,
          },
        }
      );

      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      console.error("GET /users/:userId error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // PATCH /users/:userId  -> update profile fields (bio/avatar)
  router.patch("/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { avatarUrl, bio } = req.body;

      const update = {};
      if (typeof avatarUrl === "string") update.avatarUrl = avatarUrl;
      if (typeof bio === "string") update.bio = bio;

      const result = await users.updateOne({ uuid: userId }, { $set: update });

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Profile updated" });
    } catch (err) {
      console.error("PATCH /users/:userId error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // POST /users/:userId/like
  router.post("/:userId/like", async (req, res) => {
    try {
      const { userId } = req.params;
      const { movieId } = req.body;
      if (!movieId) return res.status(400).json({ message: "movieId required" });

      await users.updateOne(
        { uuid: userId },
        {
          $addToSet: { likedMovieIds: movieId },
          $push: { activities: { type: "liked", movieId, date: new Date().toISOString() } },
        }
      );

      res.json({ message: "Liked" });
    } catch (err) {
      console.error("POST like error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // POST /users/:userId/favorite (TOGGLE)
router.post("/:userId/favorite", async (req, res) => {
  try {
    const { userId } = req.params;
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: "movieId required" });
    }

    const user = await users.findOne(
      { uuid: userId },
      { projection: { favoriteMovieIds: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFavorited = user.favoriteMovieIds?.includes(movieId);

    if (alreadyFavorited) {
      // UNFAVORITE
      await users.updateOne(
        { uuid: userId },
        { $pull: { favoriteMovieIds: movieId } }
      );

      return res.json({ favorited: false });
    } else {
      // FAVORITE
      await users.updateOne(
        { uuid: userId },
        {
          $addToSet: { favoriteMovieIds: movieId },
          $push: {
            activities: {
              type: "favorited",
              movieId,
              date: new Date().toISOString(),
            },
          },
        }
      );

      return res.json({ favorited: true });
    }
  } catch (err) {
    console.error("POST favorite error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


  // POST /users/:userId/rate
router.post("/:userId/rate", async (req, res) => {
  try {
    const { userId } = req.params;
    const { movieId, rating } = req.body;

    if (!movieId) return res.status(400).json({ message: "movieId required" });
    if (!rating) return res.status(400).json({ message: "rating required" });

    // rating expected like "4/5"
    await users.updateOne(
      { uuid: userId },
      {
        $push: {
          activities: {
            type: "reviewed",
            movieId,
            rating,
            date: new Date().toISOString(),
          },
        },
      }
    );

    res.json({ message: "Rated" });
    } catch (err) {
        console.error("POST rate error:", err);
        res.status(500).json({ message: "Server error" });
    }
    });

  return router;
};
