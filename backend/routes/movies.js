const express = require("express");

module.exports = (db) => {
  const router = express.Router();
  const movies = db.collection("movies");

  // GET /movies
  // Optional query: /movies?category=Top%20Rated
  router.get("/", async (req, res) => {
    try {
      const { category } = req.query;

      const filter = {};
      if (category) filter.category = category;

      const results = await movies.find(filter).sort({ title: 1 }).toArray();

      // Convert Mongo _id to "id" string for frontend
      const cleaned = results.map((m) => ({
        id: m._id.toString(),
        title: m.title,
        category: m.category,
        year: m.year,
        posterUrl: m.posterUrl,
        trailerUrl: m.trailerUrl,
        description: m.description,
        reviewInfo: m.reviewInfo,
      }));

      res.json(cleaned);
    } catch (err) {
      console.error("GET /movies error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // POST /movies  (useful for adding movies from Postman or a future admin UI)
  router.post("/", async (req, res) => {
    try {
      const movie = req.body;

      const required = [
        "title",
        "category",
        "year",
        "posterUrl",
        "trailerUrl",
        "description",
        "reviewInfo",
      ];

      for (const key of required) {
        if (!movie[key]) {
          return res.status(400).json({ message: `Missing field: ${key}` });
        }
      }

      const result = await movies.insertOne(movie);
      res.status(201).json({ id: result.insertedId.toString() });
    } catch (err) {
      console.error("POST /movies error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
