const MenuItems = require("../model/MenuItems")
const { getAll, addRecord, deleteRecord } = require('../controller/mainController')

//get all menu
async function getAllMenuItems(req, res) {
  const result = await getAll("menuItems")
  res.status(result[0]).json(result[1]);
}

//add a new menu
async function addMenuItem(req, res) {
  const result = await addRecord("menuItems", req);
  res.status(result[0]).json(result[1]);
}

// Delete a record
async function deleteMenuItem(req, res) {
  const result = await deleteRecord("menuItems", req);
  res.status(result[0]).json(result[1]);
}




// Update a record
async function updateMenuItem(req, res) {
  try {
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



module.exports = { getAllMenuItems, addMenuItem, updateMenuItem, deleteMenuItem };