//global variables
let tables = [];
let current = [];
let menu = [];
let categories = [];
let newOrder = [];
let selectedTableID;
let selectedTableNumber;

async function logJSONData(APIendpoint) {
  const response = await fetch(`http://127.0.0.1:3000/${APIendpoint}`);
  const jsonData = await response.json();
  //console.log(jsonData)
  return jsonData;
}

async function postData(APIendpoint, JSONdata) {
  const response = await fetch(`http://127.0.0.1:3000/${APIendpoint}`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSONdata, // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function putData(APIendpoint, JSONdata) {
  const response = await fetch(`http://127.0.0.1:3000/${APIendpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSONdata, // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function placeOrder() {
  let orderToPlace
    if(!current?.error && current.find(e => e.tableID == selectedTableID)) { // already existing occupation
        orderToPlace = JSON.stringify({orders: newOrder}) //todo: get waiterID from auth
        putData(`api/occupations/placeOrder/${current.find(e => e.tableID == selectedTableID)._id}`, orderToPlace)
    } else { //new occupation
        orderToPlace = JSON.stringify({tableID: selectedTableID, waiterID: "64569b00b931d3131de2403e", orders: newOrder}) //todo: get waiterID from auth
        postData(`api/occupations`, orderToPlace)
    }
    showLoadingOverlay()
    await new Promise(resolve => setTimeout(resolve, 2000)) //to wait for db to update before reloading
    location.reload()
}

async function checkout() {
  const htmlDiv = document.getElementById('checkout-modal')
  const selectedTableOrders = current.find(e => e.tableID == selectedTableID).orders
  const selectedTableID_id = current.find(e => e.tableID == selectedTableID)._id
  let checkoutTime = new Date()
  putData(`api/occupations/${selectedTableID_id}`, JSON.stringify({checkOutTime: checkoutTime}))
  htmlDiv.addEventListener('hidden.bs.modal', event => {
    showLoadingOverlay()
  })

  setTimeout(() => {
    location.reload()
  }, 2000)
}

function getCategories() {
  for (let i = 0; i < menu.length; i++) {
    if (!categories.includes(menu[i].category)) {
      categories.push(menu[i].category);
    }
  }
}

function addItem(id, itemName) {
  newOrder.push({
    menuItemID: id,
    instanceID: getNumberOfItemsWithSameId(id) + 1,
    menuItemName: itemName,
    comment: "",
  }); //push the iteminstance object
  console.log(newOrder);
  renderNewOrder();
}

function removeItem(id) {
  const itemToDelete = newOrder.find((item) => item.menuItemID == id);
  newOrder.pop(itemToDelete);
  console.log(newOrder);
  renderNewOrder();
}

function removeAllItemsWithId(id) {
  newOrder = newOrder.filter((item) => item.menuItemID !== id);
  console.log(newOrder);
  renderNewOrder();
}

//remove item from current order through "close button" in current orders tab
function removeItemButton(menuItemID, instanceID){
  const itemToDelete = newOrder.find((item) => item.menuItemID == menuItemID && item.instanceID == instanceID)
  newOrder.pop(itemToDelete)
  renderNewOrder()
}

function getNumberOfItemsWithSameId(menuItemID) {
  return newOrder.filter((item) => item.menuItemID === menuItemID).length;
}

function addOrRemoveComment(menuItemID, instanceID, commentValue) {
  const itemToComment = newOrder.find(
    (item) => item.menuItemID == menuItemID && item.instanceID == instanceID
  );
  itemToComment.comment = commentValue;
}

// called when changing quantity of menu item
function handleChangeMenu(inputValue, menuItemID, menuItemName) {
  const value = inputValue;
  const currentItemCount = getNumberOfItemsWithSameId(menuItemID);
  console.log(currentItemCount);
  let numberOfItemsToChange;
  if (value > currentItemCount) {
    numberOfItemsToChange = value - currentItemCount;
    for (let i = 0; i < numberOfItemsToChange; i++) {
      addItem(menuItemID, menuItemName);
    }
  } else {
    numberOfItemsToChange = currentItemCount - value;
    for (let i = 0; i < numberOfItemsToChange; i++) {
      removeItem(menuItemID);
    }
  }
}

function flushNewOrder() {
    newOrder = []
    console.log(newOrder)
    console.log("changing table")
    document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);
}

// render functions
function renderTables() {
  const htmlDiv = document.getElementById("js-tablescontainer");
  //let tablesToRender = []
  let htmlToRender = "";
  tables.forEach((table) => {
    if (
      !current?.error &&
      current.some((element) => element.tableID == table._id)
    ) {
      htmlToRender += `<div class="col mx-1 my-2">
                <div class="row justify-content-between">
                    <div class="d-flex col-8 mx-auto justify-content-center"><button type="button" id=${table._id} data-tablenumber= ${table.number} data-occupied="true" class="js-table-button btn btn-primary">Table ${table.number}</button>
                    </div>
            </div></div></div>`;
    } else {
      htmlToRender += `<div class="col mx-1 my-2">
                <div class="row justify-content-between">
                    <div class="d-flex col-8 mx-auto justify-content-center"><button type="button" id=${table._id} data-tablenumber= ${table.number} data-occupied="false" class="js-table-button btn btn-secondary">Table ${table.number}</button>
                    </div>
            </div></div></div>`;
    }
  });
  htmlDiv.innerHTML = htmlToRender;
  const tablesHTML = document.querySelectorAll(".js-table-button");
  tablesHTML.forEach((table) => {
    //update the selected table each time a table button is clicked and re-render Current order tab
    table.addEventListener("click", (table) => {
      if (selectedTableID != table.currentTarget.id) {
        flushNewOrder();
      }
      selectedTableID = table.currentTarget.id
      selectedTableNumber = table.currentTarget.dataset.tablenumber
      document.getElementById('tabs-current-order-tab').disabled = false
      document.querySelectorAll('.accordion-button').forEach(button => {
        button.disabled = false
      })
      renderNewOrder();
      if (table.currentTarget.dataset.occupied == "true") {
        renderPlacedOrder();
      }
    });
  });
}

function renderMenuCategories() {
  getCategories();
  const htmlCategoryTitleDiv = document.getElementById("js-menu-accordion");
  let htmlToRender = "";

  for (let i = 0; i < categories.length; i++) {
    //console.log(categories)
    htmlToRender +=
        `<div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${i}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${i}" disabled>
                ${categories[i]}
              </button>
            </h2>
          <div id="panelsStayOpen-collapse${i}" class="accordion-collapse collapse">
          <ul class="list-group rounded-0" id="js-menu${i}">
          `;

    htmlCategoryTitleDiv.innerHTML = htmlToRender;
    htmlToRender += renderMenuItems(`js-menu${i}`, categories[i]);

    htmlToRender += `</ul></div></div>`;
    htmlCategoryTitleDiv.innerHTML = htmlToRender;
  }

  const menuCheckboxes = document.querySelectorAll("input[type=checkbox]");
  menuCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (checkbox) => {
      if (checkbox.currentTarget.checked) {
        addItem(
          checkbox.currentTarget.dataset.id,
          checkbox.currentTarget.value
        );
      } else {
        removeAllItemsWithId(checkbox.currentTarget.dataset.id);
      }
    });
  });

  const quantityInputs = document.querySelectorAll("input[type=number]");
  quantityInputs.forEach((quantity) => {
    quantity.addEventListener("change", (quantity) => {
      quantity.currentTarget.value == 0
        ? (document.getElementById(
            quantity.currentTarget.dataset.id + "Checkbox"
          ).checked = false)
        : (document.getElementById(
            quantity.currentTarget.dataset.id + "Checkbox"
          ).checked = true);
      handleChangeMenu(
        quantity.currentTarget.value,
        quantity.currentTarget.dataset.id,
        quantity.currentTarget.dataset.name
      );
    });
  });
}

function renderMenuItems(htmlCategoryID, category) {
  const htmlMenuDiv = document.getElementById(htmlCategoryID);
  let htmlToRender = "";
  menu.forEach((item) => {
    if (item.category == category) {
      htmlToRender += `<li class="list-group-item">
                <form class="row align-items-center g-3 justify-content-between">
                    <div class="col-auto">
                        <div class="form-check" style="transform: rotate(0);">
                            <input class="form-check-input me-1" type="checkbox" data-id="${item._id}" value="${item.name}" id="${item._id}Checkbox">
                            <label class="form-check-label stretched-link" for="${item._id}Checkbox">${item.name}</label>
                        </div>
                    </div>
                    <div class="col-auto">
                        <label class="visually-hidden " for="${item._id}Amount">Amount</label>
                        <input class="form-control" style="width: 80px" type="number" min="0" data-name="${item.name}" data-id="${item._id}" id="${item._id}Amount" value="1" onkeydown="return false">
                    </div>
                </form>
            </li>`;
    }
  });
  return htmlToRender;
}

function renderPlacedOrder() {
  const selectedTableOrders = current.find(
    (e) => e.tableID == selectedTableID
  ).orders;
  selectedTableOrders.sort((a, b) =>
    a.menuItemID > b.menuItemID ? 1 : b.menuItemID > a.menuItemID ? -1 : 0
  );
  //console.log(selectedTableOrders)
  const htmlDiv = document.getElementById("js-placedorderscontainer");
  let htmlToRender = `<h6>Table ${selectedTableNumber}</h6>`;
  selectedTableOrders.forEach((item) => {
    htmlToRender += `<li class="list-group-item">
            <div class="row row-cols-auto align-items-center justify-content-between">
                <div class="col "><h6>${item.menuItemName}</h6>
                </div>
                <div class="col-md-6 align-items-center">
                    ${item.comment}
                </div>
            </div>
        </li>
        `;
  });
  htmlDiv.innerHTML = htmlToRender;
}

function renderNewOrder() {
  newOrder.sort((a, b) =>
    a.menuItemID > b.menuItemID ? 1 : b.menuItemID > a.menuItemID ? -1 : 0
  );
  console.log(newOrder);
  const htmlDiv = document.getElementById("js-newordercontainer");
  let htmlToRender = `<h6>Table ${selectedTableNumber}</h6>`;
  for (let i = 0; i < newOrder.length; i++) {
    //console.log(tables[i])
    htmlToRender += `<li class="list-group-item">
            <div class="row row-cols-auto align-items-center justify-content-between">
                <div class="col "><h6>${newOrder[i].menuItemName}</h6>
                </div>
                <div class="col-md-6">
                    <div class="form-floating">
                        <textarea class="form-control" placeholder="Leave a comment here" data-itemid="${newOrder[i].menuItemID}" data-instanceid="${newOrder[i].instanceID}" id="${newOrder[i].menuItemID}Comment">${newOrder[i].comment}</textarea>
                        <label for="${newOrder[i].menuItemID}Comment">Comment</label>
                    </div>
                </div>
            </div>
        </li>
        `
    }
    htmlDiv.innerHTML = htmlToRender
    //take comment textbox input
    const commentTextboxes = document.querySelectorAll('textarea')
    commentTextboxes.forEach(textbox => {
        textbox.addEventListener('change', textbox => {
            console.log(textbox.currentTarget.dataset)
            addOrRemoveComment(textbox.currentTarget.dataset.itemid, textbox.currentTarget.dataset.instanceid, textbox.currentTarget.value)
        })
    })
}

function showCheckoutModal() {
    const htmlDiv = document.getElementById('js-checkout-modal')
    let htmlToRender = ''
    if(current.find(e => e.tableID == selectedTableID)) {
        const selectedTableOrders = current.find(e => e.tableID == selectedTableID).orders
        selectedTableOrders.sort((a,b) => (a.menuItemID > b.menuItemID) ? 1 : ((b.menuItemID > a.menuItemID) ? -1 : 0))
        selectedTableOrders.forEach(item => {
            htmlToRender +=
            `<li class="list-group-item">
                <div class="row row-cols-auto align-items-center justify-content-between">
                    <div class="col "><h6>${item.menuItemName}</h6>
                    </div>
                    <div class="col-md-6 align-items-center">
                        ${item.comment}
                    </div>
                </div>
            </li>
            `
        })
    } else {
        htmlToRender += "No table selected"
    }
    htmlDiv.innerHTML = htmlToRender
}

function hideLoadingOverlay() {
  const htmlDiv = document.querySelector('.loading-overlay')
  window.addEventListener('load', () => {
    htmlDiv.style.opacity = '0'
    
    setTimeout(() => {
      htmlDiv.style.display = 'none'}, 200)
  })
}

function showLoadingOverlay() {
  const htmlDiv = document.querySelector('.loading-overlay')
    htmlDiv.style.opacity = '0.5'
    htmlDiv.style.display = 'flex'
}

// init events after everything has been loaded from db
function initEvents() {
    const placeOrderButton = document.querySelector('.js-place-order-button')
    placeOrderButton.addEventListener('click', placeOrderButton => {
        placeOrder()
    })
    const checkoutModalButton = document.querySelector('.js-checkout-modal-button')
    checkoutModalButton.addEventListener('click', checkoutModalButton => {
        showCheckoutModal()
    })
    const checkoutButton = document.querySelector('.js-checkout-button')
    checkoutButton.addEventListener('click', checkoutButton => {
      checkout()
    })
    
}

// init
async function init() {
  hideLoadingOverlay()
  tables = await logJSONData("api/tables");
  current = await logJSONData("api/occupations/current");
  menu = await logJSONData("api/menuItems/");
  if (!current?.error) {
    current.forEach((occupation) => {
      occupation.orders.forEach((item) => {
        const menuItemName = menu.find((e) => e._id == item.menuItemID).name;
        item.menuItemName = menuItemName;
      });
    });
  }
  console.log(tables);
  console.log(current);
  //logJSONData("api/occupations/")
  console.log(menu);
  renderTables();
  renderMenuCategories();

  initEvents();
}

init();
