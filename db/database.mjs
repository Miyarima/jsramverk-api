import { MongoClient } from "mongodb";
import "dotenv/config";

const databaseName = "jsramverk";
// const collectionName = "docs";

const database = {
  getDb: async function getDb(collectionName) {
    let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.nd6p6.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=jsramverk`;

    if (process.env.NODE_ENV === "test") {
      dsn = "mongodb://localhost:27017/test";
    }

    const client = await MongoClient.connect(dsn, {});

    const db = await client.db();
    const collection = await db.collection(collectionName);

    return {
      db: db,
      collection: collection,
      client: client,
    };
  },
};

export default database;
