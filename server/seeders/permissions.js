const { Permission } = require('../models/permissions');
const mongoose = require("mongoose");
const config = require('../config')

const start = async () => {
    try {
        await mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@localhost:${config.db.port}/${config.db.dbName}`);

        Permission.remove({}, function () {
            console.log('Permissions Database Cleared');
        });

        await Permission.create({
            name: 'Can See Posts',
            label: 'can_see_posts'
        });

        await Permission.create({
            name: 'Can See Categories',
            label: 'can_see_categories'
        });

        await Permission.create({
            name: 'Can Edit/Create Posts',
            label: 'can_admin_posts'
        });

        await Permission.create({
            name: 'Can Edit/Create Categories',
            label: 'can_admin_categories'
        });

        await mongoose.connection.close()
        
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();
