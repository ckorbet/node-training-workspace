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
}).then(() => {
    log.info(`Mongoose connection established: ${connectionUrl}`);
}).catch((error) => {
    log.error(`Mongoose connection failed: ${JSON.stringify(error)}`);
});

// // Following lines instantiate a User
// const theUser = new User({
//     name: '    Carlitos   ',
//     lastName: 'Way',
//     age: 38,
//     email: 'Carlitos@email.com',
//     password: 'abcDefg_183305'
// });
// log.info(`Mongoose "User" model instantiated: ${JSON.stringify(theUser)}`);

// theUser.save().then(() => {
//     log.info(`User correctly saved: ${JSON.stringify(theUser)}`)
// }).catch((error) => {
//     log.error(`Something went wrong. Review the saving: ${error}`)
// });

// const theTask = new Task({
//     title: 'Mongoose task',
//     description: 'Task to mess aroung mongoose models',
//     completed: true
// });
// log.info(`Mongoose "Task" model instantiated: ${JSON.stringify(theTask)}`);

// theTask.save().then(() => {
//     log.info(`Task correctly saved: ${JSON.stringify(theTask)}`)
// }).catch((error) => {
//     log.error(`Something went wrong. Review the saving: ${error}`)
// });
