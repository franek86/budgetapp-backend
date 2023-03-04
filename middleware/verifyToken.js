const User = require("../models/User");
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  /*  const { authorization } = req.headers;
  

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(401).json({ message: "Authorization token required" });
  } 

  const token = authorization.split(" ")[1];
  */
  const checkToken = req.cookies.token;
  if (!checkToken) return res.status(401).json({ message: "You are not authenticated" });
  try {
    const decode = jwt.verify(checkToken, process.env.TOKEN_SECRET);
    req.user = await User.findById(decode.id).select("_id");

    next();
  } catch (error) {
    res.status(401).json({ message: "Request is not authorized" });
  }
};

module.exports = { verifyToken };
