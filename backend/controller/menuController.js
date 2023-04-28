const MenuItems = require("../model/MenuItems")

// Get all records
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

// Create a new record
async function addMenuItem(req, res) {
  console.log("trying to add a menu item..")
  try {

    validateFields(req)

    // Create a new object
    let newMenuItem = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };

    // Find if it exsists is in the DB already
    const menuItem = await MenuItems.find(newMenuItem)

    // If it EXISTS in the DB
    if (menuItem.length > 0) return res.status(409).json({ error: "The record is already in the database" })

    // If not create
    MenuItems.insertMany(new MenuItems(newMenuItem))  // add to the db
    res.status(201).json(menuItem) // return as a JSON object + HTTP-status code 201 (created).   
    console.log("data added!")

  } catch (error) {
    res.status(500).json({ error: "Server error" + error })
  }
}

// Update a record
async function updateMenuItem(req, res) {
  try {
    validateFields(req)
    
    const menuItem = await MenuItems
      .findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          price: req.body.price,
          category: req.body.category
        },
        { new: true });

    // If not found - when var is null -> !var == true
    if (!menuItem) return res.status(404).json({ error: 'ID not found' });

    res.status(200).json(menuItem)
  } catch (error) {
    res.status(500).json({ error: "Server error" + error })
  }
}

// Delete a record
async function deleteMenuItem(req, res) {
  try {
    const menuItem = await MenuItems.findByIdAndRemove(req.params.id);

    if (!menuItem) return res.status(404).json({ error: 'ID not found' });

    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: "Server error" + error })
  }
}


function validateFields(req) {
  // Check for missing required fields
  if (!req.body.name || !req.body.price || !req.body.category) {
    throw new Error("Missing required fields.");
  }
}

module.exports = { getAllMenuItems, addMenuItem, updateMenuItem, deleteMenuItem };