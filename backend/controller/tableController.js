const Tables = require("../model/Tables")

const { getAll, addRecord, deleteRecord } = require('../controller/mainController')

//get all Tables
async function getAllTables(req, res) {
    const result = await getAll("tables")
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





module.exports = { getAllTables, addTable, updateTable, deleteTable };