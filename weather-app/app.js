const request = require('request');
const chalk = require('chalk');
const yargs = require('yargs');
const properties = require('./properties.json');

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
        handler: function (argv) {
            console.log(chalk.yellow('Forecasting weather:'));
            console.log(chalk.green('  City: ') + argv.city);
            console.log(chalk.magenta('  Requesting...'));
            const theUrl = properties.url.weatherstack + '&query=' + argv.city + '&units=m';
            request({ url: theUrl, json: true }, (error, response) => {
                if (error === null) {
                    if (response.statusCode === 200) {
                        console.log(chalk.magenta('  Request correctly done and json-parsed!!'));
                        console.log('  ' + argv.city + ' is ' + response.body.current.temperature + ' degrees and ' + response.body.current.weather_descriptions);
                    }
                } else {
                    console.log(chalk.red.bold(error));
                }
            });
        }
    })
    .demandCommand(1)
    ;

yargs.parse();
