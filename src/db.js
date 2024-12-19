import mongo from "mongodb";
const { MongoClient, ServerApiVersion } = mongo;
const url = process.env.MONGO_URL;

export const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectDb() {
  try {
    await client.connect();
    // confirm the connection
    await client.db("admin").command({ ping: 1 });
    console.log("👍🏼 Connected to the database successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    await client.close();
  }
}
