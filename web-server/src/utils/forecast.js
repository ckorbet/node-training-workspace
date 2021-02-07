const request = require('request')
const { red } = require('chalk');
const log = require('./winston');

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=e84129bc20b99e3b1452c36379b4e3ff&query=${latitude},${longitude}&units=f`;

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            log.error(red('Unable to connect to weather services!'));
            callback('Unable to connect to weather service!', undefined);
        } else if (response.body.error) {
            log.error(red('Unable to find location'));
            callback('Unable to find location', undefined);
        } else {
            callback(undefined, `${response.body.current.weather_descriptions[0]}. It is currently ${response.body.current.temperature} degress out.`);
        }
    })
}

module.exports = forecast