import express from "express";
import database from "../db/database.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { checkJWT } from "../middlerware/checkJWT.mjs";
var router = express.Router();

const handleError = (res, e) => {
  console.log(e);
  res.status(500).json({
    errors: {
      status: 500,
      source: "/",
      title: "Database error",
      detail: e.message,
    },
  });
};

router.post("/register", async (req, res) => {
  let db;
  try {
    db = await database.getDb("users");

    await db.collection.insertOne({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
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

router.post("/login", async (req, res) => {
  let db;
  try {
    db = await database.getDb("users");
    const filter = { username: req.body.username };
    const exist = await db.collection.findOne(filter);

    if (!exist) {
      return res.status(404).send({ message: "Wrong email or password" });
    }

    bcrypt.compare(
      req.body.password,
      exist.password,
      function (err, passwordMatch) {
        if (err || !passwordMatch) {
          return res.status(404).json({ message: "Wrong email or password" });
        }

        const payload = { username: exist.username };
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });
        return res.status(200).json({ token: token });
      }
    );
  } catch (e) {
    handleError(res, e);
  } finally {
    await db.client.close();
  }
});

router.post("/collaboration", async (req, res) => {
  let db;
  try {
    db = await database.getDb("docs");

    const result = await db.collection.updateOne(
      { _id: new ObjectId(req.body.id) },
      { $addToSet: { collaborators: req.body.username } }
    );

    db = await database.getDb("users");

    await db.collection.insertOne({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    });

    res.status(204).send(result);
  } catch (e) {
    handleError(res, e);
  } finally {
    await db.client.close();
  }
});

router.post("/collaboration/login", async (req, res) => {
  let db;
  try {
    db = await database.getDb("users");
    const filter = { username: req.body.username };
    const exist = await db.collection.findOne(filter);

    if (!exist) {
      return res.status(404).send({ message: "Wrong email or password" });
    }

    db = await database.getDb("docs");

    await db.collection.updateOne(
      { _id: new ObjectId(req.body.id) },
      { $addToSet: { collaborators: req.body.username } }
    );

    bcrypt.compare(
      req.body.password,
      exist.password,
      function (err, passwordMatch) {
        if (err || !passwordMatch) {
          return res.status(404).json({ message: "Wrong email or password" });
        }

        const payload = { username: exist.username };
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, { expiresIn: "1h" });
        return res.status(200).json({ token: token });
      }
    );
  } catch (e) {
    handleError(res, e);
  } finally {
    await db.client.close();
  }
});

router.post("/codemode", checkJWT, async (req, res) => {
  const encoded = {
    code: btoa(req.body.code),
  };

  const response = await fetch("https://execjs.emilfolino.se/code", {
    body: JSON.stringify(encoded),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });

  const resJson = await response.json();
  const decoded = atob(resJson.data);

  res.status(200).json({ res: decoded });
});

router.get("/codemode/:id", checkJWT, async (req, res) => {
  let db;
  try {
    db = await database.getDb("docs");
    const filter = { _id: new ObjectId(req.params.id) };
    const keyObject = await db.collection.findOne(filter);

    if (keyObject) {
      res.status(200).json({ data: keyObject });
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  } catch (e) {
    handleError(res, e);
  } finally {
    await db.client.close();
  }
});

router.post("/codemode/:id", checkJWT, async (req, res) => {
  let db;
  try {
    db = await database.getDb("docs");

    const result = await db.collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { content: req.body.code } }
    );

    res.status(204).send(result);
  } catch (e) {
    handleError(res, e);
  } finally {
    await db.client.close();
  }
});

export default router;
