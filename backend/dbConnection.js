const mongoose = require("mongoose")

function createDBConnection() {
    
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('connected to mongoDB...'))
    .catch(err => console.error('Could not connect to database', err));
}

module.exports = createDBConnection