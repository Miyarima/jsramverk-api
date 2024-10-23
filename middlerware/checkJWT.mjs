import jwt from "jsonwebtoken";

const checkJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      res.status(401).json({ msg: "Invalid or no token provided" });
    }

    next();
  });
};

export default checkJWT;
