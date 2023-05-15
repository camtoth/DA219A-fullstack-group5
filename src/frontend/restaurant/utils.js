async function logJSONData(APIendpoint) {
  const response = await fetch(`http://127.0.0.1:3000/${APIendpoint}`)
  const jsonData = await response.json()
  //console.log(jsonData)
  return jsonData
}

async function postData(APIendpoint, JSONdata) {
  const response = await fetch(`http://127.0.0.1:3000/${APIendpoint}`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata, // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

async function putData(APIendpoint, JSONdata) {
  const response = await fetch(`http://127.0.0.1:3000/${APIendpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata, // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

function addItem(id, itemName, newOrder) {
  if (newOrder.length == 0) {
    let htmlDiv = document.querySelector('#tabs-tab button[data-bs-target="#tabs-current-order"]')
    //console.log(htmlDiv)
    bootstrap.Tab.getInstance(htmlDiv).show()
  }
  newOrder.push({
    menuItemID: id,
    instanceID: getNumberOfItemsWithSameId(id, newOrder) + 1,
    menuItemName: itemName,
    comment: '',
  }) //push the iteminstance object
  document.getElementById('place-order-button').disabled = false
  hideTooltip('place-order-button')
  return newOrder
}

function removeAllItemsWithId(id, newOrder) {
  newOrder = newOrder.filter((item) => item.menuItemID !== id)
  if(newOrder.length == 0) {
    document.getElementById('place-order-button').disabled = true
    showTooltip('place-order-button')
  }
  return newOrder
}

//remove item from current order through "close button" in current orders tab
function removeItem(menuItemID, instanceID, newOrder){
  let itemToDelete
  if(instanceID) {
    itemToDelete = newOrder.find((item) => item.menuItemID == menuItemID && item.instanceID == instanceID)
  } else {
    itemToDelete = newOrder.find((item) => item.menuItemID == menuItemID)
  }
  newOrder.splice(newOrder.indexOf(itemToDelete), 1)
  if(newOrder.length == 0) {
    document.getElementById('place-order-button').disabled = true
    showTooltip('place-order-button')
  }
  return newOrder
}

function getNumberOfItemsWithSameId(menuItemID, newOrder) {
  return newOrder.filter((item) => item.menuItemID === menuItemID).length
}

function addOrRemoveComment(menuItemID, instanceID, commentValue, newOrder) {
  const itemToComment = newOrder.find(
    (item) => item.menuItemID == menuItemID && item.instanceID == instanceID
  )
  itemToComment.comment = commentValue
}

function getUserID(){
  let url = window.location.href
  let userID = url.split('/').at(-1)
  //console.log('userID:', userID)
  return userID
}

//occupations don't contain menu item names, only ID's
function addItemnamesToOccupation(current, menu){
  if (!current?.error) {
    current.forEach((occupation) => {
      occupation.orders.forEach((item) => {
        const menuItemName = menu.find((e) => e._id == item.menuItemID).name
        item.menuItemName = menuItemName
      })
    })
  }
  return current
}

function mapNamesToIDs(accounts){
  accounts = accounts
    //.filter(e => e.role == 'waiter')
    .map(e => {
      return {waiterID: e._id, firstName: e.firstName, lastName: e.lastName, role: e.role}
    })
  return accounts
}

function showTooltip(elementHtmlID) {
  const tooltip = bootstrap.Tooltip.getOrCreateInstance(document.getElementById(elementHtmlID).parentNode)
  tooltip.enable() 
}

function hideTooltip(elementHtmlID) {
  const tooltip = bootstrap.Tooltip.getOrCreateInstance(document.getElementById(elementHtmlID).parentNode)
  tooltip.disable() 
}

function changeTooltip(elementHtmlID, newText) {
  const tooltip = bootstrap.Tooltip.getOrCreateInstance(document.getElementById(elementHtmlID).parentNode)
  tooltip.setContent({'.tooltip-inner': newText})
}

export {logJSONData, postData, putData, addItem, removeAllItemsWithId, removeItem, getNumberOfItemsWithSameId, addOrRemoveComment, getUserID, addItemnamesToOccupation, mapNamesToIDs, showTooltip, hideTooltip, changeTooltip  }