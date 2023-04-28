
//add new table
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
