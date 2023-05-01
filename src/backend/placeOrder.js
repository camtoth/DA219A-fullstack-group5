
let order = []


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
    let tableID = collections[i].tableID
    let tableNr = tableNrs[tableID]
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

//add new record
async function placeOrder() {
  //retrieve data
  let collections = await (await (fetch(`http://localhost:3000/api/menuItems`))).json();

  let orders = []
  console.log(`placing an order...`)
  for (let i = 0; i < collections.length; i++) {
    let portion = document.getElementById(`portion_${collections[i]._id}`).value
    let comment = document.getElementById(`comment_${collections[i]._id}`).value
    let price = collections[i].price

    if (portion > 0) {
      let order = {
        "itemID": collections[i]._id,
        "itemName": collections[i].name,
        "portions": portion,
        "comment": comment,
        "price": price,
        "completed": false
      }
      orders.push(order)
    }
  }
  console.log("tableID:", document.getElementById(`tableSelect`).value)
  console.log(orders)
}


document.getElementById("placeOrder").addEventListener('click', event => {
  placeOrder();

});

showTables();
showMenu();