const Accounts = require("../model/Accounts")
const { getAll, addRecord, deleteRecord, updateRecord, getRecord } = require('../controller/mainController')

//get all accounts
async function getAllAccounts(req, res) {
    const result = await getAll("accounts")
    res.status(result[0]).json(result[1]);
}

//get account
async function getAccount(req, res) {
    const result = await getRecord("accounts", req);
    res.status(result[0]).json(result[1]);
}

//add a new account
async function addAccount(req, res) {
    const result = await addRecord("accounts", req);
    res.status(result[0]).json(result[1]);
}

// Delete account
async function deleteAccount(req, res) {
    const result = await deleteRecord("accounts", req);
    res.status(result[0]).json(result[1]);
}

//update account
async function updateAccount(req, res) {
    const result = await updateRecord("accounts", req);
    res.status(result[0]).json(result[1]);
}


module.exports = { getAllAccounts, addAccount, updateAccount, deleteAccount, getAccount };