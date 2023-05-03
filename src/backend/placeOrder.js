
let table2occupation = {};

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


async function showTables() {
  let collections = await (await (fetch(`http://localhost:3000/api/occupations/current`))).json();
  let tableNrs = await getTableNrs();
  console.log(collections)

  html = `
  <table>
  <tr>
  <td>Table Nr</td>
  <td><select id="tableSelect">
  <option value="" selected disabled hidden>...</option>`

  for (let i = 0; i < collections.length; i++) {
    let occupationID = collections[i]._id
    let tableID = collections[i].tableID
    let tableNr = tableNrs[tableID]
    table2occupation[tableID] = occupationID
    html += `<option value="${tableID}">${tableNr}</option>`
  }
  html += `</select></td></tr></table>`

  document.getElementById("tableInfo").innerHTML = html;


}

async function showMenu() {
  //retrieve data
  let collections = await (await (fetch(`http://localhost:3000/api/menuItems`))).json();

  //title
  let html = `
  <table>
  <tr>
  <th>Dish</th>
  <th>Price</th>
  <th>Quantity</th>
  <th>Comment</th>
  </tr>`

  for (let i = 0; i < collections.length; i++) {
    html += `<tr>
    <td>${collections[i].name}</td>
    <td> ${collections[i].price}SEK</td>
    <td><input type="number" id="portion_${collections[i]._id}" value = "0"></input></td>
    <td><input type="text" id="comment_${collections[i]._id}" value = ""></input></td>
    </tr>`
  }

  html += `</table>`
  document.getElementById("orderInfo").innerHTML = html;
}

//add new record (could not get $push command to work so used a regular update - try to change later)
async function placeOrder() {

  let tableID = document.getElementById(`tableSelect`).value;
  let idnr = table2occupation[tableID]

  if (idnr === undefined) {
    console.log("specify id")
  } else {
    let jsonText = `{"orders":[`;
    //retrieve current order
    let occupation = await (await (fetch(`http://localhost:3000/api/occupations/${idnr}`))).json();
    let currentOrders = occupation[0].orders

    for (let i = 0; i < currentOrders.length; i++) {
      jsonText += `
      {"menuItemID": "${currentOrders[i].menuItemID}",
      "comment": "${currentOrders[i].comment}",
      "completed": ${currentOrders[i].completed},
      "purchaseTime":"${currentOrders[i].purchaseTime}"},`
    }

    //retrieve data
    let collections = await (await (fetch(`http://localhost:3000/api/menuItems`))).json();

    for (let i = 0; i < collections.length; i++) {
      let portion = document.getElementById(`portion_${collections[i]._id}`).value
      let comment = document.getElementById(`comment_${collections[i]._id}`).value

      if (portion > 0) {
        jsonText += `
      {"menuItemID": "${collections[i]._id}",
      "comment": "${comment}",
      "completed": false},`
      }
    }

    jsonText = jsonText.slice(0, jsonText.length - 1);
    jsonText += `]}`

    console.log(jsonText);

    const response = fetch(`http://localhost:3000/api/occupations/${idnr}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: jsonText
    });

  }

}



document.getElementById("placeOrder").addEventListener('click', event => {
  placeOrder();

});

showTables();
showMenu();