// functions that render essential html elements
function renderTables(tables, current, selectedTableID, selectedTableNumber, userID) {
  const htmlDiv = document.getElementById('js-tablescontainer')
  let htmlToRender = ''
  tables.forEach((table) => {
    if (
      !current?.error &&
        current.some((e) => e.tableID == table._id)
    ) {
      const currentWaiterID = current.find((e) => e.tableID == table._id).waiterID
      if (currentWaiterID == userID) {
        htmlToRender += `<div class="col mx-1 g-2 g-lg-3">
                  <div class="row justify-content-between">
                      <div class="d-flex col-8 mx-auto justify-content-center">
                        <button type="button" id=${table._id} data-tablenumber= ${table.number} data-occupied="true" data-waiterID=${currentWaiterID} class="js-table-button btn btn-success">Table ${table.number}</button>
                      </div>
              </div></div></div>`
      } else {
        htmlToRender += `<div class="col mx-1 g-2 g-lg-3">
                  <div class="row justify-content-between">
                      <div class="d-flex col-8 mx-auto justify-content-center">
                        <button type="button" id=${table._id} data-tablenumber= ${table.number} data-occupied="true" data-waiterID=${currentWaiterID} class="js-table-button btn btn-primary">Table ${table.number}</button>
                      </div>
              </div></div></div>`
      }
      
    } else {
      htmlToRender += `<div class="col mx-1 g-2 g-lg-3">
                  <div class="row justify-content-between">
                      <div class="d-flex col-8 mx-auto justify-content-center"><button type="button" id=${table._id} data-waiterID="NONE" data-tablenumber= ${table.number} data-occupied="false" class="js-table-button btn btn-secondary">Table ${table.number}</button>
                      </div>
              </div></div></div>`
    }
  })
  htmlDiv.innerHTML = htmlToRender
}
  
function getCategories(categories, menu) {
  for (let i = 0; i < menu.length; i++) {
    if (!categories.includes(menu[i].category)) {
      categories.push(menu[i].category)
    }
  }
}
  
function renderMenuCategories(categories, menu) {
  getCategories(categories, menu)
  const htmlCategoryTitleDiv = document.getElementById('js-menu-accordion')
  let htmlToRender = ''
  
  for (let i = 0; i < categories.length; i++) {
    htmlToRender +=
        `<div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${i}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${i}" disabled>
                  ${categories[i]}
                </button>
              </h2>
            <div id="panelsStayOpen-collapse${i}" class="accordion-collapse collapse">
            <ul class="list-group rounded-0" id="js-menu${i}">
            `
  
    htmlCategoryTitleDiv.innerHTML = htmlToRender
    htmlToRender += renderMenuItems(`js-menu${i}`, categories[i], menu)
  
    htmlToRender += '</ul></div></div>'
    htmlCategoryTitleDiv.innerHTML = htmlToRender
  }
}
  
function renderMenuItems(htmlCategoryID, category, menu) {
  const htmlMenuDiv = document.getElementById(htmlCategoryID)
  let htmlToRender = ''
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
                          <input class="form-control" style="width: 60px" type="number" min="0" data-name="${item.name}" data-id="${item._id}" id="${item._id}Amount" value="1" onkeydown="return false">
                      </div>
                  </form>
              </li>`
    }
  })
  return htmlToRender
}
  
function renderPlacedOrder(current, selectedTableID, selectedTableNumber, userID, waiters) {
  const selectedTable = current.find((e) => e.tableID == selectedTableID)
  const selectedTableOrders = selectedTable.orders
  selectedTableOrders.sort((a, b) =>
    a.menuItemID > b.menuItemID ? 1 : b.menuItemID > a.menuItemID ? -1 : 0
  )
  const tableWaiter = waiters.find(e => e.waiterID == selectedTable.waiterID)
  //console.log(selectedTableOrders)
  const htmlDiv = document.getElementById('js-placedorderscontainer')
  let htmlToRender = `<h6>Table ${selectedTableNumber}</h6>`
  htmlToRender += `<h6>Waiter: ${tableWaiter.firstName}</h6>`
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
          `
  })
  htmlDiv.innerHTML = htmlToRender
}
  
function renderNewOrder(newOrder, selectedTableID, selectedTableNumber) {
  newOrder.sort((a, b) =>
    a.menuItemID > b.menuItemID ? 1 : b.menuItemID > a.menuItemID ? -1 : 0
  )
  const htmlDiv = document.getElementById('js-newordercontainer')
  let htmlToRender = `<h6>Table ${selectedTableNumber}</h6>`
  newOrder.forEach(item => {
    htmlToRender += `<li class="list-group-item">
              <div class="row row-cols-auto align-items-center justify-content-between">
                <div class="col">
                  <button type="button" class="btn-close" id="removefromorder-button" aria-label="Close" data-itemid="${item.menuItemID}" data-instanceid="${item.instanceID}"></button>
                </div>
                <div class="col"><h6>${item.menuItemName}</h6>
                </div>
                <div class="col-md-6">
                    <div class="form-floating">
                        <textarea class="form-control" placeholder="Leave a comment here" data-itemid="${item.menuItemID}" data-instanceid="${item.instanceID}" id="${item.menuItemID}Comment">${item.comment}</textarea>
                        <label for="${item.menuItemID}Comment">Comment</label>
                    </div>
                  </div>
              </div>
          </li>
          `
  })
  htmlDiv.innerHTML = htmlToRender
}

export {renderTables, renderMenuCategories, renderPlacedOrder, renderNewOrder}