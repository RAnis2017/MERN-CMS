const express = require('express')
const app = express()
const config = require('./config')
const bodyParser = require('body-parser')
const mongoose = require("mongoose");

app.use(bodyParser.json())

//Routes
app.use(require('./routes')); 

const start = async () => {
    try {
        await mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@localhost:${config.db.port}/${config.db.dbName}`);
        app.listen(config.port, () => console.log(`Server started on port ${config.port}`));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();