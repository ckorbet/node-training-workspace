const mongoose = require('mongoose');

const properties = require('../../resources/properties.json');
const log = require('../utils/winston');

// const connectionUrl = `mongodb://${properties.mongo.user}:${properties.mongo.password}@${properties.mongo.host}:${properties.mongo.port}/${properties.mongo.tmaDbName}`;
const connectionUrl = `mongodb://${properties.mongo.host}:${properties.mongo.port}`;

log.info(`Connecting to ${connectionUrl} with mongoose...`);
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useCreateIndex: true, //to automatically create indexes,
    useUnifiedTopology: true,
    dbName: properties.mongo.tmaDbName,
    /*
     * After several tries, connection is only established if dbName is setup here like above line
     * Additionally, user & pass connection can be setup like the following line
     */
    user: properties.mongo.user,
    pass: properties.mongo.password,
    // auth: {
    //     authdb: admin
    // }
    useFindAndModify: false
}).then(() => {
    log.info(`Mongoose connection established: ${connectionUrl}`);
}).catch((error) => {
    log.error(`Mongoose connection failed: ${JSON.stringify(error)}`);
});