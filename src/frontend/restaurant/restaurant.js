import {renderTables, renderMenuCategories, renderPlacedOrder, renderNewOrder, renderCheckoutModal, renderUsername} from './render.js'
import {logJSONData, postData, putData, addItem, removeAllItemsWithId, removeItem, getNumberOfItemsWithSameId, addOrRemoveComment, getUserID, addItemnamesToOccupation, mapNamesToIDs, showTooltip, hideTooltip} from './utils.js'


//global variables
let tables = []
let current = []
let menu = []
let categories = []
let newOrder = []
let accounts = []
let selectedTableID
let selectedTableNumber
let userID

async function placeOrder() {
  let orderToPlace
  if (!current?.error && current.find(e => e.tableID == selectedTableID)) { // already existing occupation
    orderToPlace = JSON.stringify({ orders: newOrder }) //todo: get waiterID from auth
    putData(`api/occupations/placeOrder/${current.find(e => e.tableID == selectedTableID)._id}`, orderToPlace)
  } else { //new occupation
    orderToPlace = JSON.stringify({ tableID: selectedTableID, waiterID: userID, orders: newOrder }) //todo: get waiterID from auth
    postData('api/occupations', orderToPlace)
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
  putData(`api/occupations/${selectedTableID_id}`, JSON.stringify({ checkOutTime: checkoutTime }))
  htmlDiv.addEventListener('hidden.bs.modal', event => {
    showLoadingOverlay()
  })

  setTimeout(() => {
    location.reload()
  }, 2000)
}

// called when changing quantity of a selected menu item
function handleChangeMenu(inputValue, menuItemID, menuItemName) {
  const value = inputValue
  const currentItemCount = getNumberOfItemsWithSameId(menuItemID, newOrder)
  console.log(currentItemCount)
  let numberOfItemsToChange
  if (value > currentItemCount) {
    numberOfItemsToChange = value - currentItemCount
    for (let i = 0; i < numberOfItemsToChange; i++) {
      newOrder = addItem(menuItemID, menuItemName, newOrder)
    }
    renderNewOrder(newOrder, selectedTableID, selectedTableNumber)
    initCommentListeners()
  } else {
    numberOfItemsToChange = currentItemCount - value
    for (let i = 0; i < numberOfItemsToChange; i++) {
      newOrder = removeItem(menuItemID, null, newOrder)
      renderNewOrder(newOrder, selectedTableID, selectedTableNumber)
      initCommentListeners()

    }
  }
}

function flushNewOrder() {
  newOrder = []
  console.log(newOrder)
  console.log('changing table')
  document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false)
}

async function showCheckoutModal() {
  let orderToCheckout = current.find(e => e.tableID == selectedTableID)
  await putData(`api/occupations/updateTotalPrice/${orderToCheckout._id}`)
  orderToCheckout = (await logJSONData(`api/occupations/${orderToCheckout._id}`))
  orderToCheckout = (addItemnamesToOccupation(orderToCheckout, menu))[0]
  console.log(orderToCheckout)
  renderCheckoutModal(orderToCheckout)
}

function hideLoadingOverlay() {
  const htmlDiv = document.querySelector('.loading-overlay')
  //window.addEventListener('load', () => {
  //  htmlDiv.style.opacity = '0'
  setTimeout(() => {
    htmlDiv.style.opacity = '0'
    htmlDiv.style.display = 'none'
  }, 200)
  //})
}

function showLoadingOverlay() {
  const htmlDiv = document.querySelector('.loading-overlay')
  htmlDiv.style.opacity = '0.5'
  htmlDiv.style.display = 'flex'
}

function initButtonsListeners() {
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

function initMenuListeners() {
  const triggerTabList = document.querySelectorAll('#tabs-tab button')
  triggerTabList.forEach(triggerEl => {
    const tabTrigger = new bootstrap.Tab(triggerEl)
    triggerEl.addEventListener('click', event => {
      event.preventDefault()
      tabTrigger.show()
    })
  })
  const tablesHTML = document.querySelectorAll('.js-table-button')
  tablesHTML.forEach((table) => {
    //update the selected table each time a table button is clicked and re-render Current order tab
    table.addEventListener('click', (table) => {
      if (selectedTableID != table.currentTarget.id) {
        flushNewOrder()
      }
      selectedTableID = table.currentTarget.id
      selectedTableNumber = table.currentTarget.dataset.tablenumber
      document.getElementById('place-order-button').disabled = false
      hideTooltip('place-order-button')
      document.getElementById('tabs-current-order-tab').disabled = false
      document.querySelectorAll('.accordion-button').forEach(button => {
        button.disabled = false
      })
      renderNewOrder(newOrder, selectedTableID, selectedTableNumber)
      initCommentListeners()
      if (table.currentTarget.dataset.occupied == 'true') {
        renderPlacedOrder(current, selectedTableID, selectedTableNumber, userID, accounts)
        document.getElementById('checkout-modal-button').disabled = false
        hideTooltip('checkout-modal-button')
      } else {
        document.getElementById('checkout-modal-button').disabled = true
        showTooltip('checkout-modal-button')
        const htmlDiv = document.getElementById('js-placedorderscontainer')
        let htmlToRender = `
          <h6>Table ${selectedTableNumber}</h6>
          <h4>No orders have been placed yet.</h4>
          `
        htmlDiv.innerHTML = htmlToRender
      }
    })
  })
  const menuCheckboxes = document.querySelectorAll('input[type=checkbox]')
  menuCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', (checkbox) => {
      if (checkbox.currentTarget.checked) {
        newOrder = addItem(
          checkbox.currentTarget.dataset.id,
          checkbox.currentTarget.value,
          newOrder
        )
        renderNewOrder(newOrder, selectedTableID, selectedTableNumber)
        initCommentListeners()
      } else {
        newOrder = removeAllItemsWithId(checkbox.currentTarget.dataset.id, newOrder)
        renderNewOrder(newOrder, selectedTableID, selectedTableNumber)
        initCommentListeners()
      }
    })
  })
  const quantityInputs = document.querySelectorAll('input[type=number]')
  quantityInputs.forEach((quantity) => {
    quantity.addEventListener('change', (quantity) => {
      quantity.currentTarget.value == 0
        ? (document.getElementById(
          quantity.currentTarget.dataset.id + 'Checkbox'
        ).checked = false)
        : (document.getElementById(
          quantity.currentTarget.dataset.id + 'Checkbox'
        ).checked = true)
      handleChangeMenu(
        quantity.currentTarget.value,
        quantity.currentTarget.dataset.id,
        quantity.currentTarget.dataset.name
      )
    })
  })
}

function initCommentListeners() {
  //take comment textbox input
  const commentTextboxes = document.querySelectorAll('textarea')
  commentTextboxes.forEach(textbox => {
    textbox.addEventListener('change', textbox => {
      //console.log(textbox.currentTarget.dataset)
      addOrRemoveComment(textbox.currentTarget.dataset.itemid, textbox.currentTarget.dataset.instanceid, textbox.currentTarget.value, newOrder)
    })
  })
  const removeButtons = document.querySelectorAll('#removefromorder-button')
  removeButtons.forEach(button => {
    button.addEventListener('click', button => {
      let numberOfItemsLeft = document.getElementById(`${button.currentTarget.dataset.itemid}Amount`)
      if(numberOfItemsLeft.value == 1) {
        document.getElementById(`${button.currentTarget.dataset.itemid}Checkbox`).checked = false
      } else {
        numberOfItemsLeft.value -= 1
      }
      newOrder = removeItem(button.currentTarget.dataset.itemid, button.currentTarget.dataset.instanceid, newOrder)
      renderNewOrder(newOrder, selectedTableID, selectedTableNumber)
      initCommentListeners()
    })
  })
}

function initTooltips() {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

// init
async function init() {
  tables = await logJSONData('api/tables')
  current = await logJSONData('api/occupations/current')
  menu = await logJSONData('api/menuItems')
  accounts = await logJSONData('api/accounts')
  accounts = mapNamesToIDs(accounts)
  console.log(accounts)
  userID = getUserID()
  hideLoadingOverlay()
  renderUsername(accounts, userID)
  current = addItemnamesToOccupation(current, menu)
  console.log(current[0])
  renderTables(tables, current, selectedTableID, selectedTableNumber, userID)
  renderMenuCategories(categories, menu)
  initButtonsListeners()
  initMenuListeners()
  initTooltips()
}

init()
