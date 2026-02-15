const express = require("express");
const router = express.Router();
const State = require("../models/State");
const City = require("../models/City");

// GET all states
router.get("/state", async (req, res) => {
  try {
    const states = await State.find().sort({ stateName: 1 });
    res.json(states);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET cities for a state (stateId param)

router.get("/city/:stateId", async (req, res) => {
  try {
    const cities = await City.find({ stateId: req.params.stateId });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch cities" });
  }
});


module.exports = router;
