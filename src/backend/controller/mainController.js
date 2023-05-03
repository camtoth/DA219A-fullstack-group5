const Tables = require("../model/Tables")
const MenuItems = require("../model/MenuItems")
const Accounts = require("../model/Accounts")
const Occupation = require("../model/Occupation");

const dbInfo = {
  "tables": { "model": Tables, "validate": ["number"] },
  "menuItems": { "model": MenuItems, "validate": ["name"] },
  "accounts": { "model": Accounts, "validate": ["firstName", "lastName", "username"] },
  "occupation": { "model": Occupation, "validate": ["tableID", "checkOutTime"] }
}

//retrieve all records from table
async function getAll(modelName, query = null) {
  let data;
  let statuscode;
  try {
    data = await dbInfo[modelName].model.find(query);
    if (data.length == 0) {
      data = { error: "There are no records in the database" }
      statuscode = 404;
    } else {
      statuscode = 200;

    }
  } catch (error) {
    console.log(error);
    statuscode = 500;
    data = { error: "Server error" + error }
  }

  return [statuscode, data]
}

//update record
async function updateRecord(modelName, req) {
  console.log("trying to update record..");
  let statuscode;
  let data = req.body;
  const filter = { "_id": req.params.id };

  try {
    await dbInfo[modelName].model.updateOne(filter, data);
    statuscode = 200;
    console.log("data updated!");
  } catch (err) {
    statuscode = 404;
    console.log(err)
    data = { error: "data could not be updated" };
  };

  return [statuscode, data];
}

async function pushRecord(modelName, req) {
  console.log("trying to push data")
  let statuscode;
  let data = req.body
  console.log(data)
  statuscode = 200;

  /*
  const filter = { "_id": req.params.id };

  try {

    dbInfo[modelName].model.updateOne(filter, { $push: data });

    statuscode = 200;
    console.log("data updated!");
  } catch (err) {
    statuscode = 404;
    console.log(err)
    data = { error: "data could not be updated" };
  };
*/
  return [statuscode, data];
}

//get record data
async function getRecord(modelName, req) {
  let statuscode;
  let data;

  try {
    data = await dbInfo[modelName].model.find({ "_id": req.params.id });
    statuscode = 200;
  } catch (err) {
    console.log(err);
    statuscode = 404;
    data = { error: "data could not be found" };
  };

  return [statuscode, data];
}

//create new data record
async function addRecord(modelName, req) {
  console.log("trying to add a new record..");
  let statuscode;
  let data;

  //create new record
  const newRecord = new dbInfo[modelName].model(req.body);

  //validate data
  try {
    await newRecord.validate();

    //check if key already exists
    searchFor = {}
    for (let i of dbInfo[modelName].validate) {
      searchFor[i] = newRecord[i];
    }
    const searchResult = await Tables.find(searchFor);

    if (searchResult.length > 0) {
      statuscode = 409;
      data = { error: "The table is already in the database" };
      console.log("record with key value is already present");
    } else {
      dbInfo[modelName].model.insertMany(newRecord);
      statuscode = 201;
      data = newRecord;
      console.log("data added!");
    }

  } catch (err) {
    statuscode = 400;
    data = { error: "Validation error, missing required fields." };
    console.log("data had invalid format.");
  }

  return [statuscode, data]
}

async function deleteRecord(modelName, req) {
  console.log("trying to delete record..");
  let statuscode;
  let data;

  const record = await dbInfo[modelName].model.findByIdAndRemove(req.params.id);

  if (!record) {
    statuscode = 404;
    data = { error: 'ID not found' };
  } else {
    statuscode = 200;
  }

  return [statuscode, data];
}


module.exports = { getAll, addRecord, deleteRecord, updateRecord, getRecord, pushRecord };


