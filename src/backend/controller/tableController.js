const Tables = require("../model/Tables")

const { getAll, addRecord, deleteRecord, updateRecord, getRecord, pushRecord } = require('../controller/mainController')

//get all Tables
async function getAllTables(req, res) {
    const result = await getAll("tables")
    res.status(result[0]).json(result[1]);
}

//get table
async function getTable(req, res) {
    const result = await getRecord("tables", req);
    res.status(result[0]).json(result[1]);
}

//add a new table
async function addTable(req, res) {
    const result = await addRecord("tables", req);
    res.status(result[0]).json(result[1]);
}

//delete table
async function deleteTable(req, res) {
    const result = await deleteRecord("tables", req);
    res.status(result[0]).json(result[1]);
}

//update table
async function updateTable(req, res) {
    const result = await updateRecord("tables", req);
    res.status(result[0]).json(result[1]);
}

module.exports = { getAllTables, addTable, updateTable, deleteTable, getTable };