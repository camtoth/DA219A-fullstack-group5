const Occupation = require("../model/Occupation")
const mongoose = require("mongoose");

// Show all tables
async function getAllOccupation(req, res) {
  try {
    const occupations = await Occupation.find()

    if (occupations.length == 0) return res.status(404).json({ error: "There are no records in the database" })

    res.status(200).json(tables)

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" + error })
  }
}

module.exports = { getAllOccupation };