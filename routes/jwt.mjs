import express from "express";
import { checkJWT } from "../middlerware/checkJWT.mjs";
var router = express.Router();

// const handleError = (res, e) => {
//   res.status(500).json({
//     errors: {
//       status: 500,
//       source: "/",
//       title: "Database error",
//       detail: e.message,
//     },
//   });
// };

router.post("/check", checkJWT, async (req, res) => {
  res.status(200).json({ msg: "Token is valid" });
});

export default router;
