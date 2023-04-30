//global variables
let tables = []
let menu = [{name: "burger", item_id:"45", category:"1"}, {name: "hummus", item_id:"5", category:"1"}, {name: "pizza", item_id:"4", category:"1"},
{name: "ceasar salad",  item_id:"43", category:"3"}, {name: "seasonal salad", item_id:"22", category:"3"}, {name: "pea soup", item_id:"65", category:"2"},
{name: "prawn coctail", item_id:"12", category:"2"}, {name: "ice cream", item_id:"7", category:"4"}, {name: "chocolate cake", item_id:"99", category:"4"},
{name: "french fries", item_id:"11", category:"5"}, {name: "grilled vegetables", item_id:"112", category:"5"}
]
let categories = []
let newOrder = []

async function logJSONData(APIendpoint) {
    const response = await fetch(`http://127.0.0.1:3000/${APIendpoint}`)
    const jsonData = await response.json()
    //console.log(jsonData)
    return jsonData
  }

function getCategories() {
    for (let i = 0; i < menu.length; i++){
        if (!categories.includes(menu[i].category)){
            categories.push(menu[i].category)
        }
    }
}

function addItem(id, itemName) {
    newOrder.push({menuItemID: id, menuItemName: itemName, comment: "test"}) //push the iteminstance object
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
    for (let i = 0; i < tables.length; i++){
        //console.log(tables[i])
        htmlToRender +=
        `<div class="col-auto mx-1 my-2">
            <div class="row justify-content-between">
                <div class="d-flex col-8 mx-auto justify-content-center"><button type="button" class="btn btn-primary">Table ${tables[i].number}</button></div>
        </div></div></div>`
    }
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
                    <div class="col-10">
                        <div class="form-check" style="transform: rotate(0);">
                            <input class="form-check-input me-1" type="checkbox" data-id="${item._id}" value="${item.name}" id="${item._id}Checkbox">
                            <label class="form-check-label stretched-link" for="${item._id}Checkbox">${item.name}</label>
                        </div>
                    </div>

                    <div class="col-2">
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
    const htmlTablesDiv = document.getElementById('js-newordercontainer')
    //let tablesToRender = []
	let htmlToRender = ''
    for (let i = 0; i < newOrder.length; i++){
        //console.log(tables[i])
        htmlToRender +=
        `<li class="list-group-item">
            <div class="row justify-content-between">
                ${newOrder[i].menuItemName}
            </div>
        </li>
        `
    }
    htmlTablesDiv.innerHTML = htmlToRender
}

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
    //console.log(tables)
    logJSONData("api/occupations/")
    menu = await logJSONData("api/menuItems/")
    console.log(menu)
	renderTables()
    renderMenuCategories()
    initEvents()
}

init()