import jwt from "jsonwebtoken";

export const checkJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      res.status(401).json({ msg: "Invalid or no token provided" });
    }
    console.log("Tokens is corret!");
    next();
  });
};

export const checkJWTGraphql = (context) => {
  const token = context.req.headers["x-access-token"];

  if (!token) {
    res.status(401).json({ msg: "Invalid or no token provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401).json({ msg: "Invalid or no token provided" });
  }
};
