const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: "All fileds are required." });
    }

    const duplicateUsername = await User.findOne({ username });
    const duplicateEmail = await User.findOne({ email });

    if (duplicateUsername || duplicateEmail) {
      return res.status(409).json({ message: "Duplicate username or email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);
    const userObject = { username, email, password: hashPassword };
    const user = await User.create(userObject);

    if (user) {
      res.status(201).json({ message: `New user ${username} created` });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Bad request" });
  }
};

const loginUser = async (req, res) => {
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

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_JWT, { expiresIn: "2 days" });

    res.status(200).json({ username, token, message: `Username ${username} successfully login.` });
  } catch (error) {
    res.status(500).json({ error: "Bad request" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
