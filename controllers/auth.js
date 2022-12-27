const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    res.status(201).json({ newUser, message: "New user has been created." });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Please provide username and password" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const checkPassword = await bcrypt.compare(req.body.password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_JWT, { expiresIn: "2d" });

    res.status(200).json({ username, token, message: `Username ${username} successfully login.` });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res) => {
  res.cookie("access_token", "", { maxAge: 1 });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
