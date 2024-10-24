import express from "express";
import database from "../db/database.mjs";
import { ObjectId } from "mongodb";
import { checkJWT } from "../middlerware/checkJWT.mjs";
var router = express.Router();

const handleError = (res, e) => {
  res.status(500).json({
    errors: {
      status: 500,
      source: "/",
      title: "Database error",
      detail: e.message,
    },
  });
};

// Returns all documents within the collection
router.get("/", checkJWT, async (req, res) => {
  let db;
  try {
    db = await database.getDb("docs");
    const documents = await db.collection.find().toArray();
    if (documents) {
      res.status(200).json({ data: documents });
    } else {
      res.status(404).json({ message: "No ducuments found" });
    }
  } catch (e) {
    handleError(res, e);
  } finally {
    await db.client.close();
  }
});

// Returns the document with the provided Id
router.get("/:id", checkJWT, async (req, res) => {
  let db;
  try {
    db = await database.getDb("docs");
    const filter = { _id: new ObjectId(req.params.id) };
    const keyObject = await db.collection.findOne(filter);

    if (keyObject) {
      res.status(200).json({ data: keyObject });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    handleError(res, e);
  } finally {
    await db.client.close();
  }
});

// Creates a document with the provided title and content
router.post("/create", checkJWT, async (req, res) => {
  let db;
  try {
    db = await database.getDb("docs");

    await db.collection.insertOne({
      title: req.body.title,
      content: req.body.content,
      created_at: new Date(),
    });

    res.status(201).json({
      data: {
        msg: "Got a POST request, sending back 201 Created",
      },
    });
  } catch (e) {
    handleError(res, e);
  } finally {
    await db.client.close();
  }
});

// Updates the document with the given Id
router.put("/update", checkJWT, async (req, res) => {
  let db;
  try {
    db = await database.getDb("docs");

    const result = await db.collection.updateOne(
      { _id: new ObjectId(req.body.id) },
      { $set: { title: req.body.title, content: req.body.content } }
    );

    res.status(204).send(result);
  } catch (e) {
    handleError(res, e);
  } finally {
    await db.client.close();
  }
});

// ==================================
// If delete is needed in the future
// ==================================

// router.delete("/", async (req, res) => {
//   try {
//     const { collection } = await database.getDb();

//     const result = await collection.deleteOne({ name: "John Doe" });

//     res.status(204).send(result);
//   } catch (e) {
//     handleError(res, e);
//   } finally {
//     if (db && db.client) {
//       await db.client.close();
//     }
//   }
// });

export default router;
