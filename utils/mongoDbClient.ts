// utils/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Please add your MongoDB URI to .env");

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so the client is cached across module reloads
  // @ts-ignore
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    // @ts-ignore
    global._mongoClientPromise = client.connect();
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for every call
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise; 