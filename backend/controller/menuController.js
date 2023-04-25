const MenuItems = require("../model/MenuItems")
const mongoose = require("mongoose");

// Show all tables
async function getAllMenuItems(req, res) {
  try {
    const menuItems = await MenuItems.find()

    if (menuItems.length == 0) return res.status(404).json({ error: "There are no records in the database" })

    res.status(200).json(menuItems)

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" + error })
  }
}

module.exports = { getAllMenuItems };