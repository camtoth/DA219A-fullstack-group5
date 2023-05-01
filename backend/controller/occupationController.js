const Occupation = require("../model/Occupation");
const Tables = require("../model/Tables");
const Accounts = require("../model/Accounts");
const mongoose = require("mongoose")

const { getAll, addRecord, deleteRecord, updateRecord, getRecord } = require('../controller/mainController')


//get all ocupations
async function getAllOccupations(req, res) {
  const result = await getAll("occupation")
  res.status(result[0]).json(result[1]);
}

//get occupation
async function getOccupation(req, res) {
  const result = await getRecord("occupation", req);
  res.status(result[0]).json(result[1]);
}

//delete occupation
async function deleteOccupation(req, res) {
  const result = await deleteRecord("occupation", req);
  res.status(result[0]).json(result[1]);
}

//update occupation
async function updateOccupation(req, res) {
  const result = await updateRecord("occupation", req);
  res.status(result[0]).json(result[1]);
}

//add occupation
async function addOccupation(req, res) {
  const tableID = req.body.tableID;
  const query = { "tableID": tableID, "checkOutTime": null }
  const checkOccupied = await getAll("occupation", query)

  if (checkOccupied.length > 0) {
    res.status(409).json({ error: "The table is already in the database" });
  } else {
    const result = await addRecord("occupation", req);
    res.status(result[0]).json(result[1]);
  }
}

//get all current occupations
async function getCurrentOccupations(req, res) {
  let query = { "checkOutTime": null }
  const result = await getAll("occupation", query)

  let jsonText = {}
  res.status(result[0]).json(result[1]);
}

//get orders from occupation
async function getOccupationOrder(req, res) {
  //get orders
  let result = await getRecord("occupation", req);
  let orders = result[1][0].orders

  //get menu items
  let menuItems = {};
  result = await getAll("menuItems");
  for (let i = 0; i < result[1].length; i++) {
    menuItems[result[1][i]._id] = result[1][i].name
  }

  //loop through orders
  let ordersByTime = {}
  for (let i = 0; i < orders.length; i++) {
    let purchaseTime = orders[i].purchaseTime;
    let itemID = orders[i].menuItemID
    let itemName = menuItems[itemID]
    let order = {
      "itemID": itemID,
      "itemName": itemName,
      "portions": orders[i].portions,
      "comment": orders[i].comment,
      "completed": orders[i].completed
    }

    if (!Object.keys(ordersByTime).includes(purchaseTime)) {
      ordersByTime[purchaseTime] = [order];
    } else {
      ordersByTime[purchaseTime].push(order);
    }
  }

  res.status(result[0]).json(ordersByTime);
}


/*
// Create a new record
async function addOccupation2(req, res) {
  console.log("trying to add a occupation..")
  try {

    // Checking for required fields
    if (!req.body.tableID || !req.body.waiterID) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Checking if the IDs are valid
    if (!mongoose.Types.ObjectId.isValid(req.body.tableID)) {
      return res.status(404).json({ error: 'tableID - Not a valid ID format.' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.waiterID)) {
      return res.status(404).json({ error: 'waiterID - Not a valid ID format.' });
    }

    // Check if ID exists
    const account = await Accounts.findById(req.body.waiterID);
    const table = await Tables.findById(req.body.tableID);

    if (!account) return res.status(404).json({ error: 'This account does not exist' });
    if (account.role != "waiter") return res.status(404).json({ error: 'This account is not of a waiter' });

    if (!table) return res.status(404).json({ error: 'Table does not exist' });

    // Create a new object
    let newOccupation = {
      tableID: req.body.tableID,
      waiterID: req.body.waiterID,
      checkOutTime: null
    };
    // All other fields are autogenerated

    // Find if it exsists is in the DB already
    const occupation = await Occupation.find(newOccupation)

    // If it EXISTS in the DB
    if (occupation.length > 0) return res.status(409).json({ error: "The record is already in the database" })

    // If not create
    Occupation.insertMany(new Occupation(newOccupation))  // add to the db
    res.status(201).json(occupation) // return as a JSON object + HTTP-status code 201 (created).   

  } catch (error) {
    res.status(500).json({ error: "Server error" + error })
  }
}
*/


// Update a record
async function updateOccupation(req, res) {
  try {

    const occupation = await Occupation
      .findByIdAndUpdate(
        req.params.id,
        {
          tableID: req.body.tableID,
          waiterID: req.body.waiterID,
          startTime: req.body.startTime,
          totalPrice: req.body.totalPrice,
          checkOutTime: req.body.checkOutTime
        },
        { new: true });

    // If not found - when var is null -> !var == true
    if (!occupation) return res.status(404).json({ error: 'ID not found' });

    res.status(200).json(occupation)
  } catch (error) {
    res.status(500).json({ error: "Server error" + error })
  }
}


module.exports = { getAllOccupations, addOccupation, updateOccupation, deleteOccupation, getCurrentOccupations, getOccupation, getOccupationOrder };