const request = require('request');
const chalk = require('chalk');

const theUrl = 'http://api.weatherstack.com/current?access_key=e26270d2de1e16f08706c45e8bfa3666&query=Madrid&units=m';

request({url: theUrl}, (error, response) => {
    if(error === null) {
        if(response.statusCode === 200) {
            console.log(chalk.magenta('Request correctly done!!'));
            console.log(JSON.parse(response.body));
        }
    } else {
        console.log(chalk.red.bold(error));
    } 
});

// Notice the json option. No need of parsing
request({
        url: theUrl,
        json: true
    },
    (error, response) => {
        if (error === null) {
            if (response.statusCode === 200) {
                console.log(chalk.magenta('Request correctly done and json-parsed!!'));
                console.log(response.body);
            }
        } else {
            console.log(chalk.red.bold(error));
        }
    });