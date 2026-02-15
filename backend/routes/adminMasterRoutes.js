const express = require("express");
const router = express.Router();
const State = require("../models/State");
const City = require("../models/City");
const Category = require("../models/Category");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");


// ADD STATE
router.post("/state", auth, role("admin"), async (req, res) => {
  try {
    const state = await State.create({ name: req.body.name });
    res.json(state);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// GET ALL STATES
router.get("/state", auth, role("admin"), async (req, res) => {
  const states = await State.find();
  res.json(states);
});


// ADD CITY
router.post("/city", async (req, res) => {
  try {
    const { cityName, stateId } = req.body;

    if (!cityName || !stateId) {
      return res.status(400).json({ msg: "cityName and stateId are required" });
    }

    const city = await City.create({
      cityName,
      stateId,
    });

    res.status(201).json(city);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});



// GET CITIES OF A STATE
router.get("/city/:stateId", auth, role("admin"), async (req, res) => {
  const cities = await City.find({ stateId: req.params.stateId });
  res.json(cities);
});


// ADD CATEGORY (Lawyer Types)
router.post("/category", auth, role("admin"), async (req, res) => {
  try {
    const category = await Category.create({ name: req.body.name });
    res.json(category);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// GET ALL CATEGORIES
router.get("/category", auth, role("admin"), async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// ================= BULK ADD CITIES =================
router.post("/city/bulk", async (req, res) => {
  try {
    const cities = req.body;

    if (!Array.isArray(cities)) {
      return res.status(400).json({ msg: "Array of cities required" });
    }

    const inserted = await City.insertMany(cities);

    res.status(201).json({
      msg: "Cities added successfully",
      count: inserted.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Bulk insert failed" });
  }
});


module.exports = router;
