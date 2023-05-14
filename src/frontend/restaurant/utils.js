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
    console.log(htmlDiv)
    bootstrap.Tab.getInstance(htmlDiv).show()
  }
  newOrder.push({
    menuItemID: id,
    instanceID: getNumberOfItemsWithSameId(id, newOrder) + 1,
    menuItemName: itemName,
    comment: '',
  }) //push the iteminstance object
  //console.log(newOrder)
  return newOrder
}

function removeAllItemsWithId(id, newOrder) {
  newOrder = newOrder.filter((item) => item.menuItemID !== id)
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
  console.log('userID:', userID)
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
      return { waiterID: e._id, firstName: e.firstName, lastName: e.lastName}
    })
  return accounts
}

export {logJSONData, postData, putData, addItem, removeAllItemsWithId, removeItem, getNumberOfItemsWithSameId, addOrRemoveComment, getUserID, addItemnamesToOccupation, mapNamesToIDs}