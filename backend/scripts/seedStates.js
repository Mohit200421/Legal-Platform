const mongoose = require("mongoose");
const State = require("../models/State");
require("dotenv").config({ path: __dirname + "/../.env" });


const states = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
  "Puducherry","Andaman & Nicobar Islands","Chandigarh"
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const name of states) {
    await State.updateOne(
      { stateName: name },
      { stateName: name },
      { upsert: true }
    );
    console.log("Added:", name);
  }

  mongoose.disconnect();
}

run().catch(console.error);
