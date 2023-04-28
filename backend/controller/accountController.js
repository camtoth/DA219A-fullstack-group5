const Accounts = require("../model/Accounts")

// Get all records
async function getAllAccounts(req, res) {
    try {
        const accounts = await Accounts.find()

        if (accounts.length == 0) return res.status(404).json({ error: "There are no records in the database" })

        res.status(200).json(accounts)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" + error })
    }
}

// Create a new record
async function addAccount(req, res) {
    console.log("trying to add a account..")
    try {

        validateFields(req)

        // Create a new object
        let newAccount = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            role: req.body.role,
        };

        // Find if it exsists is in the DB already
        const account = await Accounts.find(newAccount)

        // If it EXISTS in the DB
        if (account.length > 0) return res.status(409).json({ error: "The record is already in the database" })

        // If not create
        Accounts.insertMany(new Accounts(newAccount))  // add to the db
        res.status(201).json(account) // return as a JSON object + HTTP-status code 201 (created).   

    } catch (error) {
        res.status(500).json({ error: "Server error" + error })
    }
}

// Update a record
async function updateAccount(req, res) {        
    try {
        validateFields(req)
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

// Delete a record
async function deleteAccount(req, res) {
    try {
        const account = await Accounts.findByIdAndRemove(req.params.id);

        if (!account) return res.status(404).json({ error: 'ID not found' });

        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ error: "Server error" + error })
    }
}

function validateFields(req) {

    // Check for missing required fields
    if (!req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password || !req.body.role) {
        // return res.status(400).json({ error: "Missing required fields." });
        throw new Error("Missing required fields.");
    }

    // Check for valid role values
    if (req.body.role && !['admin', 'waiter', 'cook'].includes(req.body.role)) {
        //return res.status(400).json({ error: "Invalid role value." });
        throw new Error("Invalid role value.");
    }
}

module.exports = { getAllAccounts, addAccount, updateAccount, deleteAccount };