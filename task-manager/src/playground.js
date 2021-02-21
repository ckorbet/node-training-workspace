const doWorkCallaback = (callback) => {
    setTimeout(() => {
        // callback('This is my fucking callback error');
        callback(undefined, [3, 6, 9]);
    }, 2000);
};

const theCallback = (error, result) => {
    if(error) {
        return console.log(error);
    }
    console.log(result);
};

doWorkCallaback(theCallback);


const doWorkPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve([9, 6, 3]);
        // reject('This is my fucking promise error');
    }, 2000);
});

const thenCallback = (result) => {
    console.log(result);
};

const catchCallback = (error) => {
    console.log(error);
};

doWorkPromise.then(theCallback).catch(catchCallback);