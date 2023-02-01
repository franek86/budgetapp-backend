const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/user
// @access  Public
const getAllUser = async (req, res, next) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    query.$or = [{ username: { $regex: search, $options: "(?i)a(?-i)" } }, { email: { $regex: search, $options: "(?i)a(?-i)" } }];
  }

  try {
    const users = await User.find(query).sort({ createdAt: 1 });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: "Bad request" });
    next(error);
  }
};

// @desc    Get user
// @route   GET /api/user/me
// @access  Private
const getUserMe = async (req, res, next) => {
  const user_id = req.user._id;

  try {
    const userMe = await User.findById(user_id);
    if (!userMe) {
      res.status(400);
      throw new Error("User not found");
    }
    //TODO: hide password
    res.status(200).json(userMe);
  } catch (error) {
    res.status(500).json({ error: "Bad request" });
    next(error);
  }
};

// @desc    Create user budget
// @route   PATCH /api/user/budget/:id
// @access  Private
const createBudget = async (req, res, next) => {
  const { budget } = req.body;

  const { id } = req.params;

  try {
    const userExist = await User.findById(id);
    const currentBudget = userExist.budget;
    const additionBudget = parseInt(currentBudget, 10) + parseInt(budget, 10);

    if (!userExist) {
      res.status(400);
      throw new Error("User not found");
    }
    const saveUserBudget = await User.findByIdAndUpdate(id, { budget: additionBudget }, { new: true });
    const { password, isAdmin, username, email, ...data } = saveUserBudget._doc;

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "Bad request" });
    next(error);
  }
};

// @desc    Update single user
// @route   PATCH /api/user/:id
// @params  id
// @access  Public
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userExist = await User.findById(id);

    if (!userExist) {
      res.status(400);
      throw new Error("User not found");
    }

    const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ date: updateUser, message: `User ${id} successfully updated.` });
  } catch (error) {
    res.status(500).json({ error: "Bad request" });
    next(error);
  }
};

// @desc    Delete single user
// @route   DELET /api/user/:id
// @params  id
// @access  Public
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const { username } = req.body;
  try {
    const userExist = await User.findById(id);
    if (!userExist) {
      res.status(400);
      throw new Error("User not found");
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: `User ${username} successfully deleted` });
  } catch (error) {
    res.status(500).json({ error: "Bad request" });
    next(error);
  }
};

module.exports = {
  getAllUser,
  getUserMe,
  updateUser,
  deleteUser,
  createBudget,
};
