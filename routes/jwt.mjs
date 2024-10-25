import express from "express";
import jwt from "jsonwebtoken";
var router = express.Router();

router.post("/check", async (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      res.status(401).json({ msg: "Invalid or no token provided" });
    }
    console.log("check token, its valid");
    res.status(200).json({ msg: "Token is valid" });
  });
});

export default router;
