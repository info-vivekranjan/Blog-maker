const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const verifyToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res
      .status(403)
      .send({ message: "Auth token is required for authentication" });
  }
  try {
    const { user_id,user_type, exp } = await jwt.verify(token, "TodoToken123");

    req.user_type = user_type;

    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        error: "JWT token has expired, please login to obtain a new one",
      });
    }
  } catch (err) {
    return res.status(401).send({ message: "Invalid Token" });
  }
  return next();
};

module.exports = verifyToken;
