//global variables
let tables = []
let current = []
let menu = []
let categories = []
let newOrder = []

async function logJSONData(APIendpoint) {
    const response = await fetch(`http://127.0.0.1:3000/${APIendpoint}`)
    const jsonData = await response.json()
    //console.log(jsonData)
    return jsonData
}

async function postData(APIendpoint, data) {
  const response = await fetch(`http://127.0.0.1:3000/${APIendpoint}`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function putData(APIendpoint, data) {
    const response = await fetch(`http://127.0.0.1:3000/${APIendpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function getCategories() {
    for (let i = 0; i < menu.length; i++){
        if (!categories.includes(menu[i].category)){
            categories.push(menu[i].category)
        }
    }
}

function addItem(id, itemName) {
    newOrder.push({menuItemID: id, instanceID: getNumberOfItemsWithSameId(id) + 1, menuItemName: itemName, comment: "test"}) //push the iteminstance object
    console.log(newOrder)
    renderNewOrder()
}

function removeItem(id) {
    const itemToDelete = newOrder.find(item => item.menuItemID == id)
    newOrder.pop(itemToDelete)
    console.log(newOrder)
    renderNewOrder()
}

function removeAllItemsWithId(id) {
    newOrder = newOrder.filter(item => item.menuItemID !== id)
    console.log(newOrder)
    renderNewOrder()
}

function getNumberOfItemsWithSameId(menuItemID) {
    return newOrder.filter((item) => item.menuItemID === menuItemID).length
}

function addOrRemoveComment(menuItemID, instanceID, commentValue){
    const itemToComment = newOrder.find(item => item.menuItemID == menuItemID && item.instanceID == instanceID)
    itemToComment.comment = commentValue
}

// called when changing quantity of menu item
function handleChangeMenu (inputValue, menuItemID, menuItemName) {
    const value = inputValue
    const currentItemCount = getNumberOfItemsWithSameId(menuItemID)
    console.log(currentItemCount)
    let numberOfItemsToChange
    if(value > currentItemCount) {
        numberOfItemsToChange = value - currentItemCount
        for(let i = 0; i < numberOfItemsToChange; i++) {
            addItem(menuItemID, menuItemName)
        }
    } else {
        numberOfItemsToChange = currentItemCount - value
        for(let i = 0; i < numberOfItemsToChange; i++) {
            removeItem(menuItemID)
        }
    }
};

// render functions
function renderTables(){
    const htmlTablesDiv = document.getElementById('js-tablescontainer')
    //let tablesToRender = []
	let htmlToRender = ''
    tables.forEach(table => {
        if (current.some(element => element.tableID == table._id)){
            htmlToRender +=
            `<div class="col mx-1 my-2">
                <div class="row justify-content-between">
                    <div class="d-flex col-8 mx-auto justify-content-center"><button type="button" id=${table._id} class="btn btn-primary">Table ${table.number}</button>
                    </div>
            </div></div></div>`
        }
        else{
            htmlToRender +=
            `<div class="col mx-1 my-2">
                <div class="row justify-content-between">
                    <div class="d-flex col-8 mx-auto justify-content-center"><button type="button" id=${table._id} class="btn btn-secondary">Table ${table.number}</button>
                    </div>
            </div></div></div>`
        }
    })
    htmlTablesDiv.innerHTML = htmlToRender
}

function renderMenuCategories(){
    getCategories()
    const htmlCategoryTitleDiv = document.getElementById('js-menu-accordion')
    let htmlToRender = ''

    for (let i = 0; i < categories.length; i++) {
        //console.log(categories)
        htmlToRender +=
        `<div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${i}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${i}">
            ${categories[i]}
          </button>
        </h2>
        <div id="panelsStayOpen-collapse${i}" class="accordion-collapse collapse">
        <ul class="list-group rounded-0" id="js-menu${i}">
        `

        htmlCategoryTitleDiv.innerHTML = htmlToRender
        htmlToRender += renderMenuItems(`js-menu${i}`,categories[i])

        htmlToRender += `</ul></div></div>`
        htmlCategoryTitleDiv.innerHTML = htmlToRender
    }   
}

function renderMenuItems(htmlCategoryID, category){
    const htmlMenuDiv = document.getElementById(htmlCategoryID)
    let htmlToRender = ''
    menu.forEach(item => {
        if (item.category == category){
            htmlToRender +=
            `<li class="list-group-item">
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
            </li>`
        }
    })
    return htmlToRender
}

function renderNewOrder(){
    newOrder.sort((a,b) => (a.menuItemID > b.menuItemID) ? 1 : ((b.menuItemID > a.menuItemID) ? -1 : 0))
    console.log(newOrder)
    const htmlTablesDiv = document.getElementById('js-newordercontainer')
	let htmlToRender = ''
    for (let i = 0; i < newOrder.length; i++){
        //console.log(tables[i])
        htmlToRender +=
        `<li class="list-group-item">
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
    htmlTablesDiv.innerHTML = htmlToRender
    //take comment textbox input
    const commentTextboxes = document.querySelectorAll('textarea')
    commentTextboxes.forEach(textbox => {
        textbox.addEventListener('change', textbox => {
            console.log(textbox.currentTarget.dataset)
            addOrRemoveComment(textbox.currentTarget.dataset.itemid, textbox.currentTarget.dataset.instanceid, textbox.currentTarget.value)
        })
    })
}

// init events after everything has been loaded from db
function initEvents() {
    const menuCheckboxes = document.querySelectorAll('input[type=checkbox]')
	menuCheckboxes.forEach(checkbox => {
		checkbox.addEventListener('change', checkbox => {
			if (checkbox.currentTarget.checked){
				addItem(checkbox.currentTarget.dataset.id, checkbox.currentTarget.value)
			} else {
				removeAllItemsWithId(checkbox.currentTarget.dataset.id)
			}
		})
	})
    const quantityInputs = document.querySelectorAll('input[type=number]')
	quantityInputs.forEach(quantity => {
		quantity.addEventListener('change', quantity => {
            quantity.currentTarget.value == 0 ? document.getElementById(quantity.currentTarget.dataset.id + "Checkbox").checked = false : document.getElementById(quantity.currentTarget.dataset.id + "Checkbox").checked = true
			handleChangeMenu(quantity.currentTarget.value, quantity.currentTarget.dataset.id, quantity.currentTarget.dataset.name)
		})
	})
}

// init
async function init() {
    tables = await logJSONData("api/tables")
    current = await logJSONData("api/occupations/current")
    console.log(tables)
    console.log(current)
    logJSONData("api/occupations/")
    menu = await logJSONData("api/menuItems/")
    //console.log(menu)
	renderTables()
    renderMenuCategories()
    initEvents()
}

init()