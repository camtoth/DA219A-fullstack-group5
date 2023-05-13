
//available roles
const roles = { admin: "admin", waiter: "waiter", cook: "cook" };

//available categories
const categories = { "main": "main", "side": "side", "starter": "starter", "snack": "snack", "soup": "soup", "dessert": "dessert" }

let tableNrs = {};
let waiters = {};

// [varname in model, description on html, variable type,key value]
let dbVariables = {
  tables: [
    ["number", "Table number", "number", true],
    ["seats", "Max. seat capacity", "number", false],
  ],

  menuItems: [
    ["name", "Dish", "text", true],
    ["price", "Price", "number", false],
    ["category", "Category", categories, false],
  ],
  accounts: [
    ["firstName", "First Name", "text", true],
    ["lastName", "Last Name", "text", true],
    ["username", "Username", "text", true],
    ["password", "Password", "password", false],
    ["role", "Role", roles, false],
  ],
  occupations: [
    ["tableID", "Table number", tableNrs, true],
    ["waiterID", "Waiter username", waiters, true],
    ["startTime", "Start time", "DATE", true],
    ["checkOutTime", "Checkout time", "DATE", true],
    ["totalPrice", "Total price", "number", true],
  ],
};
//edit on or off
editBool = false;

//get all tablenrs in database
async function getTableNrs() {
  let tableNrs = {};
  let tables = await (await fetch(`../api/tables`)).json();

  for (let i = 0; i < tables.length; i++) {
    tableNr = tables[i].number;
    tableid = tables[i]._id;
    tableNrs[tableid] = tableNr;
  }

  return tableNrs;
}

//get all waiters in database
async function getWaiters() {
  let waiters = {};
  let accounts = await (await fetch(`../api/accounts`)).json();

  for (let i = 0; i < accounts.length; i++) {
    role = accounts[i].role;
    username = accounts[i].username;
    userid = accounts[i]._id;

    if (role === "waiter") {
      waiters[userid] = username;
    }
  }

  return waiters;
}

async function updateVariables() {
  dbVariables["occupations"][0][2] = await getTableNrs();
  dbVariables["occupations"][1][2] = await getWaiters();
}

function getDateString(timeString) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let dayString;
  if (timeString === null) {
    dayString = "busy";
  } else {
    let time = new Date(timeString);

    //time
    let minute = time.getMinutes();
    let hour = time.getHours();
    minute = minute < 10 ? `0${minute}` : minute;
    hour = hour < 10 ? `0${hour}` : hour;

    //day
    let dayName = dayNames[time.getDay()];
    let dayMonth = monthNames[time.getMonth()];
    let dayNr = time.getDate();

    dayString = `${hour}:${minute} (${dayName},${dayNr}/${dayMonth})`;
  }

  return dayString;
}

async function showRecords(modelName) {
  await updateVariables();
  //retrieve data

  let collections = await (await fetch(`../api/${modelName}`)).json();

  let dbVar = dbVariables[modelName];

  //create table and headings
  let html = `<table class="table table-bordered"><tr>`;
  for (let i = 0; i < dbVar.length; i++) {
    html += `<th>${dbVar[i][1]}</th>`;
  } //headers
  html += `<th>${modelName === "occupations" ? "Orders" : ""
    }</th><th></th></tr>`;

  //loop through all records
  for (let i = 0; i < collections.length; i++) {
    let collection = collections[i];
    html += `<tr>`;

    for (let j = 0; j < dbVar.length; j++) {
      let value = collection[dbVar[j][0]];
      let varType = dbVar[j][2];

      if (varType === "DATE") {
        value = getDateString(value);
        varType = "text";
      }
      //check if variable has a list selection
      if (typeof varType === "object") {
        //list type
        html += `<td><select ${dbVar[j][3] || !editBool ? "disabled" : ""
          } id="${modelName}_${dbVar[j][0]}_${collection._id}">`;
        for (let option in varType) {
          if (option == value) {
            html += `<option value="${option}" selected="selected">${varType[option]}</option>`;
          } else {
            html += `<option value="${option}">${varType[option]}</option>`;
          }
        }
        html += `</select></td>`;
      } else {
        //normal type
        html += `<td><input ${dbVar[j][3] || !editBool ? "disabled" : ""
          }  type="${varType}" 
      id="${modelName}_${dbVar[j][0]}_${collection._id}" 
      value = "${value}"></input></td>`;
      }
    }

    //add delete button
    if (editBool) {
      html += `<td><button type="button" id="update_${modelName}_${collection._id}">Update</button></td>`;
    } else {
      //show orders button
      if (modelName === "occupations") {
        html += `<td><a href="../api/${modelName}/orders/${collection._id}">orders</a></td>`;
        if (collection.checkOutTime == null) {
          html += `<td><button type="button" id="checkout_${collection._id}">Checkout</button></td>`;
        }
        else html += `<td><button type="button" id="checkout_${collection._id}" disabled>Checked out</button></td>`;

      }
      html += `<td><button type="button" id="delete_${modelName}_${collection._id}">X</button></td>`;
    }

    if (modelName === "accounts") {
      html += `<td><a href="../api/${modelName}/${collection.username}">json</a></td>`;
    } else {
      html += `<td><a href="../api/${modelName}/${collection._id}">json</a></td>`;
    }

    html += `</tr>`;
  }

  //create fields for new record
  if (!editBool) {
    html += `<tr>`;
    for (let j = 0; j < dbVar.length; j++) {
      let varType = dbVar[j][2];

      if (varType === "DATE") {
        html += `<td></td>`;
      } else {
        //check if variable has a list selection
        if (typeof varType === "object") {
          //list type
          html += `
      <td>
      <select id="new_${modelName}_${dbVar[j][0]}">
      <option value="" selected disabled hidden>...</option>`;

          for (let option in varType) {
            html += `<option value="${option}">${varType[option]}</option>`;
          }
          html += `</select></td>`;
        } else {
          //normal type
          html += `<td><input type="${varType}" id="new_${modelName}_${dbVar[j][0]}"></input></td>`;
        }
      }
    }

    html += `
  <td><button type="button" id="add_${modelName}">+</button></td>
  <td></td>
  </tr>
  </table>`;
  }

  document.getElementById(`${modelName}Collections`).innerHTML = html;

  //add button events
  if (editBool) {
    for (let i = 0; i < collections.length; i++) {
      //add update button event
      document
        .getElementById(`update_${modelName}_${collections[i]._id}`)
        .addEventListener("click", (event) => {
          updateRecord(modelName, collections[i]._id);
        });
    }
  } else {
    document
      .getElementById(`add_${modelName}`)
      .addEventListener("click", (event) => {
        addNewRecord(modelName);
      });

    for (let i = 0; i < collections.length; i++) {
      //add delete button event
      document
        .getElementById(`delete_${modelName}_${collections[i]._id}`)
        .addEventListener("click", (event) => {
          deleteRecord(modelName, collections[i]._id);
        });

      //add checkout button event
      if (modelName === "occupations") {
        document
          .getElementById(`checkout_${collections[i]._id}`)
          .addEventListener("click", (event) => {
            checkoutOccupation(collections[i]._id);
          });
      }
    }
  }
}

//checkout occupation
function checkoutOccupation(idnr) {
  console.log("checkout occupation id:", idnr);
  let checkoutTime = new Date();
  let jsonText = `{"checkOutTime":"${checkoutTime}"}`;

  //post to database
  sendRequest(`../api/occupations/${idnr}`, "PUT", jsonText);
}

//delete record
function deleteRecord(modelName, idnr) {
  let jsonText = `{"_id":"${idnr}"}`;

  //post to database
  sendRequest(`../api/${modelName}/${idnr}`, "DELETE", jsonText);
}

//update record
function updateRecord(modelName, idnr) {
  console.log(`edit record in ${modelName} table`);
  console.log(modelName, idnr);

  //create json
  let dbVar = dbVariables[modelName];
  let jsonText = `{`;

  for (let i = 0; i < dbVar.length; i++) {
    let varType = dbVar[i][2];
    if (varType !== "DATE") {
      let value = document.getElementById(
        `${modelName}_${dbVar[i][0]}_${idnr}`
      ).value;
      jsonText += `"${dbVar[i][0]}":"${value}",`;
    }
  }
  jsonText = jsonText.slice(0, jsonText.length - 1);
  jsonText += `}`;

  //post to database
  sendRequest(`../api/${modelName}/${idnr}`, "PUT", jsonText);
}

//send http request
async function sendRequest(htmlString, httpMethod, jsonText) {

  const response = await fetch(htmlString, {
    method: httpMethod,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: jsonText,
  });

  if (response.status === 200) {
    console.log("succes")
    start();
  } else {
    console.log("something went wrong")
  }
}

//add new record
function addNewRecord(modelName) {
  console.log(`add new record to ${modelName} table`);

  //create json
  let dbVar = dbVariables[modelName];
  let jsonText = `{`;

  for (let i = 0; i < dbVar.length; i++) {
    let varType = dbVar[i][2];

    if (varType !== "DATE") {
      let value = document.getElementById(
        `new_${modelName}_${dbVar[i][0]}`
      ).value;
      jsonText += `"${dbVar[i][0]}":"${value}",`;
    }
  }
  jsonText = jsonText.slice(0, jsonText.length - 1);
  jsonText += `}`;

  console.log(jsonText);

  //post to database
  sendRequest(`../api/${modelName}`, "POST", jsonText);
}

document.getElementById("editMode").addEventListener("click", (event) => {
  if (editBool) {
    editBool = false;
  } else {
    editBool = true;
  }
  start();
});

async function start() {
  showRecords("tables");
  showRecords("menuItems");
  showRecords("accounts");
  showRecords("occupations");
}

start();

/* Chart */

async function getTop3Dishes() {
  // Get all occupations
  let occupations = await (await fetch(`../api/occupations`)).json();

  // Filter out the objects that do not have a checkoutTime
  const checkedOutOccupations = occupations.filter(obj => obj.checkOutTime != null);

  // Get all orders
  const orders = checkedOutOccupations.flatMap(obj => obj.orders);

  let menuItems = [];
  let allMenuItems = await (await fetch(`../api/menuItems`)).json();

  orders.forEach(element => {
    // Find mathcing item
    const menuItem = menuItems.find(obj => obj.menuItemID === element.menuItemID);

    if (menuItem != null) {
      // If the id in the array - increase count
      menuItem.count = menuItem.count + 1

    } else {
      // add to arry with count 1
      menuItems.push({
        menuItemID: element.menuItemID,
        name: allMenuItems.find(obj => obj._id === element.menuItemID).name,
        count: 1
      })
    }

  });

  // Sort out
  const sortedArr = menuItems.sort((a, b) => b.count - a.count);

  // Get the first 5 objects
  let firstFiveTopOrderedDishes = sortedArr.slice(0, 5);

  return firstFiveTopOrderedDishes;
}

async function drawStatistics() {
  let data = await getTop3Dishes();

  let dishNames = data.flatMap(obj => obj.name);
  let dishOrderCounts = data.flatMap(obj => obj.count);

  var canvasElement = document.getElementById('statChart')
  var config = {
    type: 'bar',
    data: {
      labels: dishNames,
      datasets: [
        {
          lable: '# of orders ',
          data: dishOrderCounts
        }]
    }
  }

  var statChart = new Chart(canvasElement, config)

}

drawStatistics()



