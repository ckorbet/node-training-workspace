const request = require('request');
const { red, magenta, yellow, green } = require('chalk');
const properties = require('../properties.json');
const log = require('./winston');

const forecastRequestCallback = (error, {statusCode, body: { current: {temperature} },  body: { current: {weather_descriptions}}} = {}) => {
    if(error) {
        log.error(red('Unable to connect to location services!'));
    } else if(statusCode !== 200) {
        log.error(red('Unexpected error - HTTP status <> 200'));
    } else {
        log.info(magenta('  Request correctly done and json-parsed!!'));
        log.info('  Weather is ' + temperature + ' degrees and ' + weather_descriptions);
    }
};

const geolocationRequestCallback = (error, {statusCode, body} = {}) => {
    if(error) {
        log.error(red('Unable to connect to location services!'));
    } else if(statusCode !== 200) {
        log.error(red('Unexpected error - HTTP status <> 200'));
    } else {
        log.info(magenta('  Coordinates request correctly done and json-parsed!!'));
        log.info('  Location is ' + body.features[0].center[1] + ',' + body.features[0].center[0]);
        const fullWeatherUrl = `${properties.url.external.weatherstack.url}&${properties.url.external.weatherstack.accessParam}=${properties.url.external.weatherstack.apiKey}&query=${body.features[0].center[1]},${body.features[0].center[0]}`;
        log.info(magenta(`  Requesting weather forecast ${fullWeatherUrl}`));        
        request({ url: fullWeatherUrl, json: true }, forecastRequestCallback);
    }
};

const forecastRequest = (argv) => {
    log.info(yellow('Forecasting weather:'));
    log.info(green('  City: ') + argv.city);
    log.info(magenta('  Requesting forecast...'));
    const fullWeatherUrl = `${properties.url.external.weatherstack.url}&${properties.url.external.weatherstack.accessParam}=${properties.url.external.weatherstack.apiKey}&query=${argv.city}`;
    request({ url: fullWeatherUrl , json: true }, forecastRequestCallback);
};

const geolocationRequest = (address) => {
    log.info(yellow('Geolocating city:'));
    log.info(green(`  City: ${address}`));
    const uri = properties.url.external.mapbox.url.replace('{location}', address);
    const fullGeoUrl = `${uri}?${properties.url.external.mapbox.accessParam}=${properties.url.external.mapbox.apiKey}`;
    log.info(magenta(`  Requesting coordinates ${fullGeoUrl}`));
    request({ url: fullGeoUrl, json: true }, geolocationRequestCallback);
}

const forecast = (latitude, longitude, callback) => {
    log.info(yellow('Forecasting weather:'));
    log.info(green('  City: ') + argv.city);
    log.info(magenta('  Requesting forecast...'));
    const fullWeatherUrl = `${properties.url.external.weatherstack.url}&${properties.url.external.weatherstack.accessParam}=${properties.url.external.weatherstack.apiKey}&query=${argv.city}`;
    request({ url: fullWeatherUrl , json: true }, callback);
};

const geolocation = (address, callback) => {
    log.info(yellow('Geolocating city:'));
    log.info(green(`  City: ${address}`));
    const uri = properties.url.external.mapbox.url.replace('{location}', address);
    const fullGeoUrl = `${uri}?${properties.url.external.mapbox.accessParam}=${properties.url.external.mapbox.apiKey}`;
    log.info(magenta(`  Requesting coordinates ${fullGeoUrl}`));
    request({ url: fullGeoUrl, json: true }, callback);
}

const myGeoCallback = (res, theAddress) => {
    return (error, { statusCode, body } = {}) => {

        if (error) {
            log.error(red('Unable to connect to location services!'));
        } else if (statusCode !== 200) {
            log.error(red('Unexpected error - HTTP status <> 200'));
        } else {
            log.info(magenta('  Coordinates request correctly done and json-parsed!!'));
            const geolocation = `${body.features[0].center[1]},${body.features[0].center[0]}`;
            log.info(`  Location is ${geolocation}`);
            const fullWeatherUrl = `${properties.url.external.weatherstack.url}&${properties.url.external.weatherstack.accessParam}=${properties.url.external.weatherstack.apiKey}&query=${body.features[0].center[1]},${body.features[0].center[0]}`;
            log.info(magenta(`  Requesting weather forecast ${fullWeatherUrl}`));

            request({ url: fullWeatherUrl, json: true }, myForecasCallback(res, theAddress, geolocation));
        }
    };
};

const myForecasCallback = (res, theAddress, geolocation) => {
    return (error, { statusCode, body: { current: { temperature, weather_descriptions }, location: {name, country, region, timezone_id} } } = {}) => {
        if (error) {
            log.error(red('Unable to connect to location services!'));
        } else if (statusCode !== 200) {
            log.error(red('Unexpected error - HTTP status <> 200'));
        } else {
            log.info(magenta('  Request correctly done and json-parsed!!'));
            const forecast = `Weather is ${temperature} degrees and ${weather_descriptions}`;
            log.info(`  ${forecast}`);
            res.send({
                address: theAddress,
                geolocation: {
                    coordinates: geolocation,
                    name,
                    country,
                    region,
                    timezone: timezone_id
                },
                forecast: forecast
            });
        }
    };
};

module.exports = {myGeoCallback, forecast, forecastRequest, geolocation, geolocationRequest, geolocationRequestCallback, forecastRequestCallback};