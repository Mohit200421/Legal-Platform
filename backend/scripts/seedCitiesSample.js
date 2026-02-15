const mongoose = require("mongoose");
const State = require("../backend/models/State");
const City = require("../backend/models/City");
require("dotenv").config();

const data = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"]
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const [stateName, cities] of Object.entries(data)) {
    const state = await State.findOne({ stateName });
    if (!state) {
      console.log("state not found:", stateName);
      continue;
    }
    for (const cname of cities) {
      await City.updateOne(
        { cityName: cname, state: state._id },
        { cityName: cname, state: state._id },
        { upsert: true }
      );
      console.log("Upserted", cname, "in", stateName);
    }
  }
  mongoose.disconnect();
}
run().catch(console.error);
