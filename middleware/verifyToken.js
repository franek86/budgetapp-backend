const User = require("../models/User");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.SECRET_JWT);
    req.user = await User.findById(decode.id).select("_id");

    next();
  } catch (error) {
    res.status(401).json({ message: "Request is not authorized" });
  }
};

module.exports = { verifyToken };
