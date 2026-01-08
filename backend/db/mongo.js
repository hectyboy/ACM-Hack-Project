const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectToDB() {
  if (!db) {
    await client.connect();
    db = client.db("movie-app");
    console.log("Connected to MongoDB");
  }
  return db;
}

module.exports = { connectToDB };