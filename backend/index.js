



//add new table
/*
addTable.addEventListener('click', event => {
  console.log("ADD data")
  let nr = tableNumber.value;
  let seats = tableSeats.value;
  let checkData = true;

  //make json string
  let json_text = '{"number":' + nr + ',"seats":' + seats + '}';
  console.log(json_text);

  //post to database
  if (checkData) {
    const response = fetch('http://localhost:3000/api/tables', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json_text
    });
    document.getElementById("tableNumber").value = ""
    document.getElementById("tableSeats").value = ""
  }
  else {
    console.log("something went wrong")
  }
});


//add new menu Item
addItem.addEventListener('click', event => {
  console.log("ADD menuItem data")
  let name = itemName.value;
  let category = itemCategory.value;
  let price = itemPrice.value;
  let checkData = true;

  //make json string
  let json_text = '{"name":"' + name + '","category":"' + category + '","price":' + price + '}';
  console.log(json_text);

  //post to database
  if (checkData) {
    const response = fetch('http://localhost:3000/api/menuItems', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json_text
    });
    document.getElementById("itemName").value = ""
    document.getElementById("itemCategory").value = ""
    document.getElementById("itemPrice").value = ""
  }
  else {
    console.log("something went wrong")
  }
});
*/


function addItem(name, price, category) {
  console.log("ADD menuItem data")
  let checkData = true;

  //make json string
  let json_text = '{"name":"' + name + '","category":"' + category + '","price":' + price + '}';
  console.log(json_text);

  //post to database
  if (checkData) {
    const response = fetch('http://localhost:3000/api/menuItems', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json_text
    });
    document.getElementById("itemName").value = ""
    document.getElementById("itemCategory").value = ""
    document.getElementById("itemPrice").value = ""
  }
  else {
    console.log("something went wrong")
  }
}

function addTable(nr, seats) {
  console.log("ADD data")
  let checkData = true;

  //make json string
  let json_text = '{"number":' + nr + ',"seats":' + seats + '}';
  console.log(json_text);

  //post to database
  if (checkData) {
    const response = fetch('http://localhost:3000/api/tables', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: json_text
    });
    document.getElementById("tableNumber").value = ""
    document.getElementById("tableSeats").value = ""
    showTables();
  }
  else {
    console.log("something went wrong")
  }
}



async function showTables() {
  let collections = await (await (fetch("http://localhost:3000/api/tables"))).json();

  let html = `
  <table>
    <tr>
      <th> Table Nr</th>
      <th> Seat Capacity</th>
      <th></th>
      <th></th>
    </tr>`

  for (let i = 0; i < collections.length; i++) {
    console.log(collections[i].number, collections[i].seats)
    html += `
    <tr>
    <td><input type="number" id="tnr_${collections[i]._id}" value = "${collections[i].number}"></input></td>
    <td><input type="number" id="tseat_${collections[i]._id}" value = "${collections[i].seats}"></input></td>
    <td><button type="button" id="tdelete_${collections[i]._id}">X</button></td>
    <td> <button type="button" id="tupdate_${collections[i]._id}">Update</button> </td>
    </tr>
    `
  }

  html += `    
  <tr>
      <td><input type="number" id="tableNumber"></input></td>
      <td><input type="number" id="tableSeats"></input></td>
      <td><button type="button" id="addTable">+</button></td>
      <td></td>
    </tr>
  </table>`

  document.getElementById("tableCollections").innerHTML = html;


  //add ADD button event
  document.getElementById("addTable").addEventListener('click', event => {
    addTable(tableNumber.value, tableSeats.value);
  });
}

async function showMenuItems() {
  let collections = await (await (fetch("http://localhost:3000/api/menuItems"))).json();

  let html = `
  <table>
    <tr>
      <th> Dish</th>
      <th> Price</th>
      <th>Category</th>
      <th></th>
      <th></th>
    </tr>`

  for (let i = 0; i < collections.length; i++) {
    console.log(collections[i].number, collections[i].seats)
    html += `
    <tr>
    <td><input type="text" id="iname_${collections[i]._id}" value = "${collections[i].name}"></input></td>
    <td><input type="number" id="iprice_${collections[i]._id}" value = "${collections[i].price}"></input></td>
    <td><input type="text" id="icat_${collections[i]._id}" value = "${collections[i].category}"></input></td>
    <td><button type="button" id="idelete_${collections[i]._id}">X</button></td>
    <td> <button type="button" id="iupdate_${collections[i]._id}">Update</button> </td>
    </tr>
    `
  }

  html += `    
  <tr>
      <td><input type="text" id="itemName"></input></td>
      <td><input type="number" id="itemPrice"></input></td>
      <td><input type="text" id="itemCategory"></input></td>
      <td><button type="button" id="addItem">+</button></td>
      <td></td>
    </tr>
  </table>`

  document.getElementById("menuCollections").innerHTML = html;

  //add ADD button event
  document.getElementById("addItem").addEventListener('click', event => {
    addItem(itemName.value, itemPrice.value, itemCategory.value);
  });
}

async function showAccounts() {

  let html = `
  <table>
    <tr>
      <th> First Name</th>
      <th> Last Name</th>
      <th>Username</th>
      <th>Password</th>
      <th>Role</th>
      <th></th>
      <th></th>
    </tr>`

  html += `    
  <tr>
      <td><input type="text" id="firstName"></input></td>
      <td><input type="text" id="lastName"></input></td>
      <td><input type="text" id="userName"></input></td>
      <td><input type="password" id="password"></input></td>
      <td><select id="role">
        <option value="" disabled selected hidden>Choose a role</option>
        <option value="admin">admin</option>
        <option value="waiter">waiter</option>
        <option value="cook">cook</option>
      </select></td>
      <td><button type="button" id="addAccount">+</button></td>
      <td></td>
    </tr>
  </table>`

  document.getElementById("accountCollections").innerHTML = html;
}



showTables();
showMenuItems();
showAccounts();
