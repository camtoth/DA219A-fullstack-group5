function getData() {
  fetch("/api/data")
    .then((response) => response.json())
    .then((data) => {
      // Create a table element
      const table = document.createElement("table");

      // Add table headers
      const thead = table.createTHead();
      const row = thead.insertRow();
      const headers = ["ID", "costumer"];
      for (const header of headers) {
        const th = document.createElement("th");
        const text = document.createTextNode(header);
        th.appendChild(text);
        row.appendChild(th);
      }

      // Add table rows
      const tbody = table.createTBody();
      for (const item of data) {
        const row = tbody.insertRow();
        const idCell = row.insertCell();
        const nameCell = row.insertCell();
        const emailCell = row.insertCell();
        const editCell = row.insertCell();
        const deleteCell = row.insertCell();

        idCell.textContent = item.id;
        nameCell.textContent = item.name;
        emailCell.textContent = item.email;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => edit(item.id));
        editCell.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => delete item.id);
        deleteCell.appendChild(deleteButton);
      }

      const container = document.getElementById("table-container");
      container.innerHTML = "";
      container.appendChild(table);
    })
    .catch((error) => console.error(error));
}

function edit(id) {
  // Retrieve the data of the record with the given ID from the database
  const record = retrieveRecord(id);

  // Populate the fields of a form with the record data
  document.getElementById("id").value = record.id;
  document.getElementById("customer").value = record.name;

  // Show the form
  document.getElementById("form").style.display = "block";
}

function Delete(id) {
  // Send a request to the server to delete the record with the given ID
  sendDeleteRequest(id);

  // Remove the row from the table
  const row = document.getElementById("row-" + id);
  row.parentNode.removeChild(row);
}
