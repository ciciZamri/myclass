const mongoose = require('mongoose');

class MongoDB {
    static async connect() {
        const dbUrl = process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_DB_URL : process.env.LOCAL_DB_URL;
        mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        const mongodb = mongoose.connection;
        mongodb.on('error', console.error.bind(console, 'MongoDB connection error:'));
        mongodb.once('open', () => {
            console.log("connected to mongodb");
        });
    }
}

module.exports = MongoDB;