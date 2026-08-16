const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://Hectyboyy:R3474G3T23@cluster0.mlln4vz.mongodb.net/?appName=Cluster0";
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