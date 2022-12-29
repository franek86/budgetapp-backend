const { json } = require("express");
const Category = require("../models/Category");

// @desc    Create category
// @route   POST /api/category
// @access  Public
const createCategory = async (req, res, next) => {
  const { slug } = req.body;
  const newCategory = new Category(req.body);

  try {
    const categoryExist = await Category.findOne({ slug });
    if (categoryExist) return res.status(409).send({ message: "Category already exists" });

    const saveCat = await newCategory.save();
    res.status(200).json({
      data: saveCat,
      message: `Category "${slug}" successfully created.`,
    });
  } catch (error) {
    res.status(500).json({ error: "Bad request" });
    next(error);
  }
};

// @desc    Get all categories
// @route   GET /api/category
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      categories,
      message: "Successfully fetch all categories",
    });
  } catch (error) {
    res.status(500).json({ error: "Bad request" });
    next(error);
  }
};

// @desc    Update acategory
// @route   GET /api/category/:id
// @access  Public
const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cat = await Category.findById(id);

    if (!cat) {
      res.status(400);
      throw new Error("Category id not found");
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ data: updatedCategory, message: `Category by ${id} successfully updated.` });
  } catch (error) {
    res.status(500).json({ error: "Bad request" });
    next(error);
  }
};

// @desc    Delete acategory
// @route   DELETE /api/category/:id
// @access  Public
const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const catId = await Category.findById(id);
    if (!catId) {
      res.status(400);
      throw new Error("Category id not found");
    }

    await catId.remove();
    res.status(200).json({ id, message: `Category ${id} successfully deleted` });
  } catch (error) {
    res.status(500).json({ error: "Bad request" });
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};
