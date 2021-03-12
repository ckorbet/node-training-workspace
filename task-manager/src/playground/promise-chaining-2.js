require('../db/mongoose');
const log = require('../utils/winston');

const Task = require('../models/Task');
const { Logform } = require('winston');

Task.findByIdAndRemove('603b84fec977f62ef1e7bcdb').then((result) => {
    if(result) {
        log.info(`Task removed: ${JSON.stringify(result, null, 2)}`);
    } else {
        log.warn('No task removed by Id');
    }    
    return Task.countDocuments({completed: false})
}).then((resultCount) => {
    log.info(`Total number of incompleted tasks: ${resultCount}`);
}).catch((error) => {
    log.error(`Something went wrong. Review the deletion`);
});