const Category = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .select("name");

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  getCategories,
  createCategory
};
