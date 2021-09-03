const fs = require("fs");
const mongoose = require("mongoose");
require('dotenv').config();
let csc = require('country-state-city');
var languageList = require('language-list')();


// Load env vars
const mongoURL = process.env.MONGODB_URI;

// Load models
const Country = require("../models/country.model");
const State = require("../models/state.model");
const City = require("../models/city.model");
const Language = require("../models/language.model");


// Connect to DB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Get Counter State City

//var countries = csc.Country.getAllCountries()
//var states = csc.State.getAllStates()
var cities = csc.City.getAllCities()
var language_list = languageList.getData()

// Import into DB
const importData = async () => {
  try {
//    await Country.create(countries);
  //  console.log(' **** Country ****')
    //await State.create(states);
    //console.log(' **** State ****')
      await City.create(cities);
    console.log(' **** City ****')
    await Language.create(language_list)
    console.log(' **** Language ****')
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
    await Language.deleteMany();
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
