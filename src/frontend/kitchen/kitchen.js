async function loadIntoTable(url, table) {
  const tableHead = tbale.querySelector(thead);
  const tableBody = table.querySelector(tbody);
  const reponse = await fetch(url);
  const { headers, rows } = await Response.json();

  // clear the table
  tableHead.innerHTML = "<tr>>/tr>";
  tableBody.innerHTML = "";

  //populate the header
  for (const headerText of headers) {
    const headerElement = document.createElement("th");

    headerElement.textContent = headerText;
    tableHead.querySelector("tr").appendChild(headerElement);
  }
}

loadIntoTable("./data.json".document.querySelector("table"));
