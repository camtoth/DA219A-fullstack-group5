const Tables = require("../model/Tables")
const mongoose = require("mongoose");

// Show all tables
async function getAll(req, res) {
    try {
        const tables = await Tables.find()

        if (tables.length == 0) return res.status(404).json({ error: "There are no albums in the database" })

        res.status(200).json(tables)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" + error })
    }
}

// Create a new table
async function add(req, res) {
    try {
        // Create a new table object
        let newTable = new Tables({
            number: req.body.number,
            seats: req.body.seats
        });

        // Find if the table is in the DB
        const table = await Tables.find({
            number: req.body.number,
            seats: req.body.seats
        })

        // If the table EXISTS in the DB
        if (table.length > 0) return res.status(409).json({ error: "The table is already in the database" })

        // If not create
        Tables.insertMany(newTable)  // add to the db
        res.status(201).json(table) // return as a JSON object + HTTP-status code 201 (created).   

    } catch (error) {
        res.status(500).json({ error: "Server error" + error })
    }
}

module.exports = { getAll, add };