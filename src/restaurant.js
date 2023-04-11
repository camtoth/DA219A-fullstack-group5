//global variables
const tables = 23
const menu1 = [{name: "burger"}, {name: "hummus"}, {name: "pizza"}, {name: "salad"}]


// render functions
function renderTables(){
    const htmlTablesDiv = document.getElementById('js-tablescontainer')
    //let tablesToRender = []
	let htmlToRender = ''
    for (let i = 0; i < tables; i++){
        htmlToRender +=
        `<div class="col-2 p-2 justify-content-center">
            <div class="row">
                <div class="d-grid gap-2 col-8 mx-auto"><button type="button" class="btn btn-primary">Table ${i+1}</button></div>
        </div></div></div>`
    }
    htmlTablesDiv.innerHTML = htmlToRender
}

function renderMenu(){
    const htmlMenuDiv = document.getElementById('js-menu1')
    let htmlToRender = ''
    menu1.forEach(item => {
        htmlToRender +=
        `<li class="list-group-item">
        <input class="form-check-input me-1" type="checkbox" value="" id="${item.name}CheckboxStretched">
        <label class="form-check-label stretched-link" for="${item.name}CheckboxStretched">${item.name}</label>
        </li>`
    })
    htmlMenuDiv.innerHTML = htmlToRender
}

// init
function init() {
    //API calls to get data
	renderTables()
    renderMenu()
}

init()