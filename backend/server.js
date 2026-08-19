require("dotenv").config();
const express = require("express");
const cors = require("cors");
const makeUsersRouter = require("./routes/users");

const { connectToDB } = require("./db/mongo");
const makeAuthRouter = require("./routes/auth");
const makeMoviesRouter = require("./routes/movies"); // ✅ NEW

const app = express();

// ✅ middleware BEFORE routes
app.use(cors());
app.use(express.json());

async function startServer() {
  const db = await connectToDB();

  // ✅ routes
  app.use("/auth", makeAuthRouter(db));
  app.use("/movies", makeMoviesRouter(db)); // ✅ NEW
  app.use("/users", makeUsersRouter(db));


  // ✅ health check
  app.get("/health", (req, res) => res.json({ ok: true }));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
