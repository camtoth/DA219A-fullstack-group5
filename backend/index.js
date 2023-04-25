
//add album with supplied details
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
    const response = fetch('http://localhost:3000/addTable', {
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
