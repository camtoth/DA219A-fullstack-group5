const MenuItems = require("../model/MenuItems")
const { getAll, addRecord, deleteRecord, updateRecord, getRecord } = require('../controller/mainController')

//get all menu
async function getAllMenuItems(req, res) {
  const result = await getAll("menuItems")
  res.status(result[0]).json(result[1]);
}

//get menu item
async function getMenuItem(req, res) {
  const result = await getRecord("menuItems", req);
  res.status(result[0]).json(result[1]);
}

//add a new menu
async function addMenuItem(req, res) {
  const result = await addRecord("menuItems", req);
  res.status(result[0]).json(result[1]);
}

// Delete menu item
async function deleteMenuItem(req, res) {
  const result = await deleteRecord("menuItems", req);
  res.status(result[0]).json(result[1]);
}

//update menuitem
async function updateMenuItem(req, res) {
  const result = await updateRecord("menuItems", req);
  res.status(result[0]).json(result[1]);
}


module.exports = { getAllMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, getMenuItem };