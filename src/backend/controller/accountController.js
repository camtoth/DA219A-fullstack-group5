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

//get account by name
async function getAccountByUsername(req, res) {
    try {
        const user = await Accounts.findOne({ username: req.params.username })

        // If id was not found
        if (user.length == 0) return res.status(404).json({ error: "Username not found" })

        res.status(200).json(user)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" + error })
    }
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


module.exports = { getAllAccounts, addAccount, updateAccount, deleteAccount, getAccount, getAccountByUsername};