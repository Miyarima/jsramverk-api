import express from "express";
import database from "../db/database.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

        const payload = { email: exist.email };
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

export default router;
