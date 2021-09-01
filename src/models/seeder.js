const fs = require("fs");
const mongoose = require("mongoose");
require('dotenv').config();
let csc = require('country-state-city');

// Load env vars
const mongoURL = process.env.MONGODB_URI;

// Load models
const Country = require("./country.model");
const State = require("./state.model");
const City = require("./city.model");


// Connect to DB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Get Counter State City

var countries = csc.Country.getAllCountries()
var states = csc.State.getAllStates()
var cities = csc.City.getAllCities()

// Import into DB
const importData = async () => {
  try {
    await Country.create(countries);
    console.log(' **** 1 ****')
    await State.create(states);
    console.log(' **** 2 ****')
    await City.create(cities);
    console.log(' **** 3 ****')

    console.log("Data Imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Country.deleteMany();
    await State.deleteMany();
    await City.deleteMany();
    console.log("Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
