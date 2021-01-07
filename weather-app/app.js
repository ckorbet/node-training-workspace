const request = require('request');
const chalk = require('chalk');
const yargs = require('yargs');
const properties = require('./properties.json');

const forecastRequestCallback = (error, response) => {
    if (error === null) {
        if (response.statusCode === 200) {
            console.log(chalk.magenta('  Request correctly done and json-parsed!!'));
            console.log('  Weather is ' + response.body.current.temperature + ' degrees and ' + response.body.current.weather_descriptions);
        }
    } else {
        console.log(chalk.red.bold(error));
    }
};

const geolocationRequestCallback = (error, response) => {
    if (error === null) {
        if (response.statusCode === 200) {
            console.log(chalk.magenta('  Coordinates request correctly done and json-parsed!!'));
            console.log('  Location is ' + response.body.features[0].center[1] + ',' + response.body.features[0].center[0]);
            console.log(chalk.magenta('  Requesting weather forecast...'));
            const weatherStackUrl = properties.url.weatherstack + '&query=' + response.body.features[0].center[1] + ',' + response.body.features[0].center[0] + '&units=m';
            request({ url: weatherStackUrl, json: true }, forecastRequestCallback);
        }
    } else {
        console.log(chalk.red.bold(error));
    }
};

const forecastHandler = (argv) => {
    console.log(chalk.yellow('Forecasting weather:'));
    console.log(chalk.green('  City: ') + argv.city);
    console.log(chalk.magenta('  Requesting forecast...'));
    request({ url: properties.url.weatherstack + '&query=' + argv.city + '&units=m', json: true }, forecastRequestCallback);
};

const geolocationHandler = (argv) => {
    console.log(chalk.yellow('Geolocating city:'));
    console.log(chalk.green('  City: ') + argv.city);
    console.log(chalk.magenta('  Requesting coordinates...'));
    request({ url: properties.url.mapbox.replace('{location}', argv.city), json: true }, geolocationRequestCallback);
}

yargs
    .command({
        command: 'forecast',
        describe: 'Show weather forecast of the given city',
        builder: {
            city: {
                describe: 'Name of the city whose weather you want to forecast',
                demandOption: true,
                type: 'string'
            }
        },
        handler: forecastHandler
    })
    .command({
        command: 'geolocation',
        describe: 'Show weather forecast of the given city, based on its coordinates',
        builder: {
            city: {
                describe: 'Name of the city whose weather you want to forecast',
                demandOption: true,
                type: 'string'
            }
        },
        handler: geolocationHandler
    })
    .demandCommand(1)
    ;

yargs.parse();
