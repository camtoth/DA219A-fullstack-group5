const Occupation = require("../model/Occupation");
const Tables = require("../model/Tables");
const Accounts = require("../model/Accounts");
const mongoose = require("mongoose")

const { getAll, addRecord, deleteRecord, updateRecord, getRecord, pushRecord } = require('../controller/mainController')


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
  // You need also waiterID

  const query = { "tableID": tableID, "checkOutTime": null }
  // Check out time is null by default

  const checkOccupied = await getAll("occupation", query)
  console.log(checkOccupied);

  if (checkOccupied[0] === 404) {
    const result = await addRecord("occupation", req);
    res.status(result[0]).json(result[1]);
  } else {
    res.status(409).json({ error: "The table is already in the database" });
  }
}

//get all current occupations
async function getCurrentOccupations(req, res) {
  let query = { "checkOutTime": null }
  const result = await getAll("occupation", query)

  let jsonText = {}
  res.status(result[0]).json(result[1]);
}


function getDateString(timeString) {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  let dayString;
  if (timeString === null) {
    dayString = "busy"

  }
  else {
    let time = new Date(timeString);

    //time
    let minute = time.getMinutes()
    let hour = time.getHours()
    minute = (minute < 10) ? `0${minute}` : minute;
    hour = (hour < 10) ? `0${hour}` : hour;

    //day
    let dayName = dayNames[time.getDay()]
    let dayMonth = monthNames[time.getMonth()]
    let dayNr = time.getDate()

    dayString = `${hour}:${minute} (${dayName},${dayNr}/${dayMonth})`
  }

  return dayString
}


//get orders from occupation
async function getOccupationOrder(req, res) {
  //get orders
  let result = await getRecord("occupation", req);
  let orders = result[1][0].orders

  console.log("orders:", orders)
  //get menu items
  let menuItems = {};
  result = await getAll("menuItems");
  for (let i = 0; i < result[1].length; i++) {
    menuItems[result[1][i]._id] = result[1][i].name
  }

  //loop through orders
  let ordersByTime = {}
  for (let i = 0; i < orders.length; i++) {

    let purchaseTime = getDateString(orders[i].purchaseTime);
    let itemID = orders[i].menuItemID
    let itemName = menuItems[itemID]
    let order = {
      "menuItemID": itemID,
      "itemName": itemName,
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

//add new order to occupation
async function addOccupationOrder(req, res) {
  const result = await pushRecord("occupation", req);
  res.status(result[0]).json(result[1]);
}

//determine TotalPrice
async function updateTotalPrice(req, res) {
  try {
    //get orders
    let result = await getRecord("occupation", req);
    let orders = result[1][0].orders
    let totalPrice = 0;

    //get menu items
    let menuItems = {};
    result = await getAll("menuItems");
    for (let i = 0; i < result[1].length; i++) {
      menuItems[result[1][i]._id] = result[1][i].price
    }

    for (let i = 0; i < orders.length; i++) {
      let itemID = orders[i].menuItemID
      let itemPrice = menuItems[itemID]
      totalPrice += itemPrice
    }

    const occupation = await Occupation
      .findByIdAndUpdate(
        req.params.id,
        {
          totalPrice: totalPrice
        },
        { new: true });

    if (!occupation) return res.status(404).json({ error: 'ID not found' });

    res.status(200).json(occupation)
  } catch (error) {
    res.status(500).json({ error: "Server error" + error })
  }

}

//update table
async function updateOccupation(req, res) {
  const result = await updateRecord("occupation", req);
  res.status(result[0]).json(result[1]);
}


module.exports = { getAllOccupations, addOccupation, updateOccupation, deleteOccupation, getCurrentOccupations, getOccupation, getOccupationOrder, addOccupationOrder, updateTotalPrice };