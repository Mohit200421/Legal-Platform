const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

// ✅ User can view all published articles
router.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find()
      .populate("authorId", "name role")
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
