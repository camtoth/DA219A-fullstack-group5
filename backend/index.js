
//available roles
const roles = ["admin", "waiter", "cook"]

// [varname in model, description on html, variable type,key value]
const dbVariables = {
  "tables": [["number", "Table number", "number", true],
  ["seats", "Max. seat capacity", "number", false]],
  "menuItems": [["name", "Dish", "text", true],
  ["price", "Price", "number", false],
  ["category", "Category", "text", false]],
  "accounts": [["firstName", "First Name", "text", true],
  ["lastName", "Last Name", "text", true],
  ["username", "Username", "text", true],
  ["password", "Password", "password", false],
  ["role", "Role", roles, false]]
}
//edit on or off
editBool = false;

async function showRecords(modelName) {
  //retrieve data
  let collections = await (await (fetch(`http://localhost:3000/api/${modelName}`))).json();
  let dbVar = dbVariables[modelName]

  //create table and headings
  let html = `<table><tr>`
  for (let i = 0; i < dbVar.length; i++) {
    html += `<th>${dbVar[i][1]}</th>`
  } //headers
  html += `<th></th><th></th></tr>`

  //loop through all records
  for (let i = 0; i < collections.length; i++) {
    let collection = collections[i]
    html += `<tr>`

    for (let j = 0; j < dbVar.length; j++) {
      //check if variable has a list selection
      if (typeof (dbVar[j][2]) === 'object') {
        //list type
        let currentSelection = collection[dbVar[j][0]];
        console.log(collection[dbVar[j][0]])
        html += `<td><select ${(dbVar[j][3] || !editBool) ? "disabled" : ""} id="${modelName}_${dbVar[j][0]}_${collection._id}">`

        for (let option of dbVar[j][2]) {

          if (option == currentSelection) {
            html += `<option value="${option}" selected="selected">${option}</option>`
          } else {
            html += `<option value="${option}">${option}</option>`
          }

        }
        html += `</select></td>`
      } else {
        //normal type
        html += `<td><input ${(dbVar[j][3] || !editBool) ? "disabled" : ""}  type="${dbVar[j][2]}" 
      id="${modelName}_${dbVar[j][0]}_${collection._id}" 
      value = "${collection[dbVar[j][0]]}"></input></td>`

      }
    }


    //add delete button
    if (editBool) {
      html += `<td><button type="button" id="update_${modelName}_${collection._id}">Update</button></td>`
    } else {
      html += `<td><button type="button" id="delete_${modelName}_${collection._id}">X</button></td>`
    }
    html += `</tr>`
  }

  //create fields for new record
  if (!editBool) {
    html += `<tr>`
    for (let j = 0; j < dbVar.length; j++) {

      //check if variable has a list selection
      if (typeof (dbVar[j][2]) === 'object') {
        //list type
        html += `
      <td>
      <select id="new_${modelName}_${dbVar[j][0]}">
      <option value="" selected disabled hidden>...</option>`

        for (let option of dbVar[j][2]) {
          html += `<option value="${option}">${option}</option>`
        }
        html += `</select></td>`
      } else {
        //normal type
        html += `<td><input type="${dbVar[j][2]}" id="new_${modelName}_${dbVar[j][0]}"></input></td>`
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
    jsonText += `"${dbVar[i][0]}":"${document.getElementById(`${modelName}_${dbVar[i][0]}_${idnr}`).value}",`
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
    jsonText += `"${dbVar[i][0]}":"${document.getElementById(`new_${modelName}_${dbVar[i][0]}`).value}",`
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
    document.getElementById(`new_${modelName}_${dbVar[i][0]}`).value = ""
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


function start() {
  showRecords("tables");
  showRecords("menuItems");
  showRecords("accounts");
}

start();


