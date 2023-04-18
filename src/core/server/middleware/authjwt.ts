import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";


const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        error: "Unauthorized!"
      });
    }
    req.userId = decoded.username;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken
};

export default authJwt;
