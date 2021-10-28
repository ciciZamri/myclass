const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const dbCollections = ['users', 'posts', 'enrollments', 'courses', 'announcements'];

async function run() {
    const dbUrl = process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_DB_URL : process.env.LOCAL_DB_URL;
    const client = new mongoose.mongo.MongoClient(dbUrl);
    await client.connect();
    const db = client.db();

    const collections = await db.collections();
    const names = collections.map(e => e.collectionName);
    for (let i = 0; i < names.length; i++) await db.dropCollection(names[i]);

    for (let i = 0; i < dbCollections.length; i++) {
        const c = await db.createCollection(dbCollections[i]);
        // for (let j = 0; j < dbCollections[i].indexes.length; j++) {
        //     let index = dbCollections[i].indexes[j];
        //     if (index.type === "text") {
        //         let indexes = {};
        //         index.fields.forEach((e) => indexes[`${e}`] = 'text');
        //         c.createIndex(indexes);
        //     }
        // }
    }

    await client.close();

    console.log("Database migration success !!!");
}

run();