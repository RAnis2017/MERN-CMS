const mongoose = require("mongoose");
const config = require('./config')

const start = async () => {
    try {
        await mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@localhost:${config.db.port}/${config.db.dbName}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
require('./models/permissions')
require('./models/users')
require('./models/categories')
require('./models/posts')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require("cors")

app.use(cors())
app.use(bodyParser.json())
// use uploads folder for static files
app.use(express.static('uploads'))

//Routes
app.use(require('./routes')); 

app.listen(config.port, () => console.log(`Server started on port ${config.port}`));


