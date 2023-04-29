const Accounts = require("../model/Accounts")
const { getAll, addRecord, deleteRecord } = require('../controller/mainController')

//get all menu
async function getAllAccounts(req, res) {
    const result = await getAll("accounts")
    res.status(result[0]).json(result[1]);
}

//add a new menu
async function addAccount(req, res) {
    const result = await addRecord("accounts", req);
    res.status(result[0]).json(result[1]);
}

// Delete a record
async function deleteAccount(req, res) {
    const result = await deleteRecord("accounts", req);
    res.status(result[0]).json(result[1]);
}


// Update a record
async function updateAccount(req, res) {
    try {
        if (req.body.role) {
            validateRole(req.body.role)
        }

        const account = await Accounts
            .findByIdAndUpdate(
                req.params.id,
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    password: req.body.password,
                    role: req.body.role,
                },
                { new: true });

        // If not found - when var is null -> !var == true
        if (!account) return res.status(404).json({ error: 'ID not found' });

        res.status(200).json(account)
    } catch (error) {
        res.status(500).json({ error: "Server error" + error })
    }
}


module.exports = { getAllAccounts, addAccount, updateAccount, deleteAccount };