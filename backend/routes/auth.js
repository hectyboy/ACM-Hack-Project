const express = require("express");
const crypto = require("crypto");
const { generateSalt, hashPassword } = require("../utils/crypto");

module.exports = (db) => {
  const router = express.Router();
  const users = db.collection("users");

  // REGISTER
  router.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const existing = await users.findOne({ username });
      if (existing) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const salt = generateSalt();
      const hashedPassword = hashPassword(password, salt);

      const user = {
        uuid: crypto.randomUUID(),
        username,
        salt,
        hashedPassword,
        ratings: [],
      };

      await users.insertOne(user);
      return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // LOGIN
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const user = await users.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      const attemptedHash = hashPassword(password, user.salt);
      if (attemptedHash !== user.hashedPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      return res.json({
        message: "Login successful",
        userId: user.uuid,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
