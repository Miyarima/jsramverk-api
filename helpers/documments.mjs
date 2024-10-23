import database from "../db/database.mjs";
import { ObjectId } from "mongodb";

const collectionName = "docs";

const docs = {
  getDocs: async (creator) => {
    const db = await database.getDb("docs");
    const documents = await db.collection.find({ creator: creator }).toArray();
    await db.client.close();

    return documents;
  },
  getDoc: async (docId) => {
    const db = await database.getDb(collectionName);
    const filter = { _id: new ObjectId(docId) };
    const document = await db.collection.findOne(filter);

    await db.client.close();

    return document;
  },
  addDoc: async (title, content, creator) => {
    const db = await database.getDb("docs");

    await db.collection.insertOne({
      title: title,
      content: content,
      creator: creator,
      created_at: new Date(),
    });

    await db.client.close();

    return { title: title, content: content };
  },
  updateDoc: async (id, title, content) => {
    const db = await database.getDb("docs");

    await db.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title: title, content: content } }
    );

    await db.client.close();

    return { title: title, content: content };
  },
};

export default docs;
