
//available roles
const roles = { "admin": "admin", "waiter": "waiter", "cook": "cook" }
let tableNrs = {};
let waiters = {};

// [varname in model, description on html, variable type,key value]
let dbVariables = {
  "tables": [["number", "Table number", "number", true],
  ["seats", "Max. seat capacity", "number", false]],
  "menuItems": [["name", "Dish", "text", true],
  ["price", "Price", "number", false],
  ["category", "Category", "text", false]],
  "accounts": [["firstName", "First Name", "text", true],
  ["lastName", "Last Name", "text", true],
  ["username", "Username", "text", true],
  ["password", "Password", "password", false],
  ["role", "Role", roles, false]],
  "occupations": [["tableID", "Table number", tableNrs, true],
  ["waiterID", "Waiter username", waiters, true],
  ["startTime", "Start time", "DATE", true],
  ["checkOutTime", "Checkout time", "DATE", true],
  ["totalPrice", "Total price", "number", true]]
}
//edit on or off
editBool = false;

//get all tablenrs in database
async function getTableNrs() {
  let tableNrs = {}
  let tables = await (await (fetch(`http://localhost:3000/api/tables`))).json();

  for (let i = 0; i < tables.length; i++) {
    tableNr = tables[i].number
    tableid = tables[i]._id
    tableNrs[tableid] = tableNr
  }

  return tableNrs
}

//get all waiters in database
async function getWaiters() {
  let waiters = {}
  let accounts = await (await (fetch(`http://localhost:3000/api/accounts`))).json();

  for (let i = 0; i < accounts.length; i++) {
    role = accounts[i].role
    username = accounts[i].username
    userid = accounts[i]._id

    if (role === "waiter") {
      waiters[userid] = username
    }
  }

  return waiters
}

async function updateVariables() {
  dbVariables["occupations"][0][2] = await getTableNrs();
  dbVariables["occupations"][1][2] = await getWaiters();
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


async function showRecords(modelName) {
  await updateVariables();
  //retrieve data
  let collections = await (await (fetch(`http://localhost:3000/api/${modelName}`))).json();
  let dbVar = dbVariables[modelName]

  //create table and headings
  let html = `<table><tr>`
  for (let i = 0; i < dbVar.length; i++) {
    html += `<th>${dbVar[i][1]}</th>`
  } //headers
  html += `<th>${(modelName === 'occupations') ? "Orders" : ""}</th><th></th></tr>`

  //loop through all records
  for (let i = 0; i < collections.length; i++) {
    let collection = collections[i]
    html += `<tr>`

    for (let j = 0; j < dbVar.length; j++) {
      let value = collection[dbVar[j][0]]
      let varType = dbVar[j][2];

      if (varType === "DATE") {
        value = getDateString(value);
        varType = "text";
      }
      //check if variable has a list selection
      if (typeof (varType) === 'object') {
        //list type
        html += `<td><select ${(dbVar[j][3] || !editBool) ? "disabled" : ""} id="${modelName}_${dbVar[j][0]}_${collection._id}">`
        for (let option in varType) {
          if (option == value) {
            html += `<option value="${option}" selected="selected">${varType[option]}</option>`
          } else {
            html += `<option value="${option}">${varType[option]}</option>`
          }
        }
        html += `</select></td>`
      } else {
        //normal type
        html += `<td><input ${(dbVar[j][3] || !editBool) ? "disabled" : ""}  type="${varType}" 
      id="${modelName}_${dbVar[j][0]}_${collection._id}" 
      value = "${value}"></input></td>`

      }
    }

    //add delete button
    if (editBool) {
      html += `<td><button type="button" id="update_${modelName}_${collection._id}">Update</button></td>`
    } else {
      //show orders button
      if (modelName === 'occupations') {
        html += `<td><a href="http://localhost:3000/api/${modelName}/orders/${collection._id}">orders</a></td>`
        //html += `<td><button type="button" id="orders_${collection._id}">View orders</button></td>`
      }
      html += `<td><button type="button" id="delete_${modelName}_${collection._id}">X</button></td>`

    }
    html += `<td><a href="http://localhost:3000/api/${modelName}/${collection._id}">json</a></td>`
    html += `</tr>`
  }

  //create fields for new record
  if (!editBool) {
    html += `<tr>`
    for (let j = 0; j < dbVar.length; j++) {
      let varType = dbVar[j][2];

      if (varType === "DATE") {
        html += `<td></td>`
      } else {
        //check if variable has a list selection
        if (typeof (varType) === 'object') {
          //list type
          html += `
      <td>
      <select id="new_${modelName}_${dbVar[j][0]}">
      <option value="" selected disabled hidden>...</option>`

          for (let option in varType) {
            html += `<option value="${option}">${varType[option]}</option>`
          }
          html += `</select></td>`
        } else {
          //normal type
          html += `<td><input type="${varType}" id="new_${modelName}_${dbVar[j][0]}"></input></td>`
        }
      }


    }

    html += `
  <td><button type="button" id="add_${modelName}">+</button></td>
  <td></td>
  </tr>
  </table>`
  }


  document.getElementById(`${modelName}Collections`).innerHTML = html;

  //add button events
  if (editBool) {
    for (let i = 0; i < collections.length; i++) {
      //add update button event
      document.getElementById(`update_${modelName}_${collections[i]._id}`).addEventListener('click', event => {
        updateRecord(modelName, collections[i]._id);
      });

    }
  } else {
    document.getElementById(`add_${modelName}`).addEventListener('click', event => {
      addNewRecord(modelName);
    });

    for (let i = 0; i < collections.length; i++) {
      //add delete button event
      document.getElementById(`delete_${modelName}_${collections[i]._id}`).addEventListener('click', event => {
        deleteRecord(modelName, collections[i]._id);
      });
    }
  }
}


//delete record
function deleteRecord(modelName, idnr) {
  console.log(modelName, idnr)

  let jsonText = `{"_id":"${idnr}"}`

  const response = fetch(`http://localhost:3000/api/${modelName}/${idnr}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: jsonText
  });
}

//update record
function updateRecord(modelName, idnr) {
  console.log(`edit record in ${modelName} table`)
  console.log(modelName, idnr)

  //create json
  let dbVar = dbVariables[modelName]
  let jsonText = `{`;

  for (let i = 0; i < dbVar.length; i++) {
    let varType = dbVar[i][2]
    if (varType !== "DATE") {

      let value = document.getElementById(`${modelName}_${dbVar[i][0]}_${idnr}`).value;
      jsonText += `"${dbVar[i][0]}":"${value}",`
    }
  }
  jsonText = jsonText.slice(0, jsonText.length - 1);
  jsonText += `}`

  console.log(jsonText);

  const response = fetch(`http://localhost:3000/api/${modelName}/${idnr}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: jsonText
  });
}

//add new record
function addNewRecord(modelName) {
  console.log(`add new record to ${modelName} table`)

  //create json
  let dbVar = dbVariables[modelName]
  let jsonText = `{`;

  for (let i = 0; i < dbVar.length; i++) {
    let varType = dbVar[i][2]

    if (varType !== "DATE") {
      let value = document.getElementById(`new_${modelName}_${dbVar[i][0]}`).value
      jsonText += `"${dbVar[i][0]}":"${value}",`
    }
  }
  jsonText = jsonText.slice(0, jsonText.length - 1);
  jsonText += `}`

  console.log(jsonText);

  //post to database
  const response = fetch(`http://localhost:3000/api/${modelName}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: jsonText
  });

  //reset fields
  for (let i = 0; i < dbVar.length; i++) {
    let varType = dbVar[i][2]

    if (varType !== "DATE") {
      document.getElementById(`new_${modelName}_${dbVar[i][0]}`).value = ""
    }

  }
}

document.getElementById("editMode").addEventListener('click', event => {
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


