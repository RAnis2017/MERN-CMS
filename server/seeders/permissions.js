const { Permission } = require('../models/permissions');
const mongoose = require("mongoose");
const config = require('../config')

const start = async () => {
    try {
        await mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@localhost:${config.db.port}/${config.db.dbName}`);

        // Permission.remove({}, function () {
        //     console.log('Permissions Database Cleared');
        // });

        await Permission.create({
            name: 'Can Edit/Create Users',
            label: 'can_admin_users'
        });

        await mongoose.connection.close()
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
