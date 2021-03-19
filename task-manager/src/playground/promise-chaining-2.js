require('../db/mongoose');
const log = require('../utils/winston');

const Task = require('../models/Task');

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

const deleteTaskAndCount = async (taskIdToDelete) => {
    log.info(`About to remove task ${taskIdToDelete}...`);
    const removedTask = await Task.findByIdAndRemove(taskIdToDelete);
    if(removedTask) {
        log.info('Task removed !!');
    } else {
        log.warn('Something went wrong. Review the removal');
    }
    log.info(`About to count incompleted tasks...`);
    const resultCount = await Task.countDocuments({completed: false});
    if(resultCount) {
        log.info(`Incompleted tasks counted`);
    } else {
        log.warn('Somenthing went wrong. Review the counting');
    }
    return resultCount;
};

deleteTaskAndCount('60547cdc512a3e6b10735fd7').then(resultCount => {
    log.info(`deleteTaskAndCount invoked with resultCount: ${resultCount}`);
}).catch(error => {
    log.error('Somenthing went wrong. Review the invocation.', error);
});
