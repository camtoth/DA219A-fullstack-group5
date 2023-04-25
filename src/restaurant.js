//global variables
const tables = 25
const menu = [{name: "burger", item_id:"45", category:"1"}, {name: "hummus", item_id:"5", category:"1"}, {name: "pizza", item_id:"4", category:"1"},
{name: "ceasar salad",  item_id:"43", category:"3"}, {name: "seasonal salad", item_id:"22", category:"3"}, {name: "pea soup", item_id:"65", category:"2"},
{name: "prawn coctail", item_id:"12", category:"2"}, {name: "ice cream", item_id:"7", category:"4"}, {name: "chocolate cake", item_id:"99", category:"4"},
{name: "french fries", item_id:"11", category:"5"}, {name: "grilled vegetables", item_id:"112", category:"5"}
]
let categories = {1: "main", 2: "starter", 3: "salad", 4: "dessert", 5: "side"}

// render functions
function renderTables(){
    const htmlTablesDiv = document.getElementById('js-tablescontainer')
    //let tablesToRender = []
	let htmlToRender = ''
    for (let i = 0; i < tables; i++){
        htmlToRender +=
        `<div class="col-auto mx-1 my-2">
            <div class="row justify-content-between">
                <div class="d-flex col-8 mx-auto justify-content-center"><button type="button" class="btn btn-primary">Table ${i+1}</button></div>
        </div></div></div>`
    }
    htmlTablesDiv.innerHTML = htmlToRender
}

function renderMenuCategories(){
    const htmlCategoryTitleDiv = document.getElementById('js-menu-accordion')
    let htmlToRender = ''
    let i = 1
    for (let category in categories) {
        console.log(category)
        htmlToRender +=
        `<div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${i}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${i}">
            ${categories[category]}
          </button>
        </h2>
        <div id="panelsStayOpen-collapse${i}" class="accordion-collapse collapse">
        <ul class="list-group rounded-0" id="js-menu${i}">
        `

        htmlCategoryTitleDiv.innerHTML = htmlToRender
        htmlToRender += renderMenuItems(`js-menu${i}`,category)

        htmlToRender += `</ul></div></div>`
        htmlCategoryTitleDiv.innerHTML = htmlToRender
        i++
    }   
}

function renderMenuItems(htmlCategoryID, category){
    const htmlMenuDiv = document.getElementById(htmlCategoryID)
    let htmlToRender = ''
    menu.forEach(item => {
        if (item.category == category){
            htmlToRender +=
            `<li class="list-group-item">
                <input class="form-check-input me-1" type="checkbox" value="" id="${item.item_id}CheckboxStretched">
                <label class="form-check-label stretched-link" for="${item.item_id}CheckboxStretched">${item.name}</label>
            </li>`
        }
    })

    return htmlToRender
}

// init
function init() {
	renderTables()
    renderMenuCategories()
}

init()