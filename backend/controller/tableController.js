const Tables = require("../model/Tables")

// Show all tables
async function getAllTables(req, res) {
    try {
        const tables = await Tables.find()

        if (tables.length == 0) return res.status(404).json({ error: "There are no records in the database" })

        res.status(200).json(tables)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" + error })
    }
}

// Create a new table
async function addTable(req, res) {
    console.log("trying to add a table..")
    try {
        // Check for missing required fields
        if (!req.body.number || !req.body.number) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // Create a new table object
        let newTable = {
            number: req.body.number,
            seats: req.body.seats
        };

        // Find if the table is in the DB
        const table = await Tables.find(newTable)

        // If the table EXISTS in the DB
        if (table.length > 0) return res.status(409).json({ error: "The table is already in the database" })

        // If not create
        Tables.insertMany(new Tables(newTable))  // add to the db
        res.status(201).json(table) // return as a JSON object + HTTP-status code 201 (created).   

    } catch (error) {
        res.status(500).json({ error: "Server error" + error })
    }
}


// Update an table
async function updateTable(req, res) {
    try {
        const table = await Tables
            .findByIdAndUpdate(
                req.params.id,
                {
                    number: req.body.number,
                    seats: req.body.seats
                },
                { new: true });

        // !table == true when table is NULL bc table null == false
        if (!table) return res.status(404).json({ error: 'ID not found' });

        res.status(200).json(table)
    } catch (error) {
        res.status(500).json({ error: "Server error" + error })
    }
}

// Delete an album
async function deleteTable(req, res) {
    try {
        const table = await Tables.findByIdAndRemove(req.params.id);

        if (!table) return res.status(404).json({ error: 'ID not found' });

        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ error: "Server error" + error })
    }
}

module.exports = { getAllTables, addTable, updateTable, deleteTable };