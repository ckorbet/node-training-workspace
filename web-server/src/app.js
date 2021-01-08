const fs = require('fs');
const path = require('path');

const express = require('express');
const chalk = require('chalk');
const properties = require('./properties.json');

const publicPath = path.join(__dirname, '../public');

// this creates an express web-server application
const app = express();

// this set up the path/directory of the public/static content to be served
app.use(express.static(publicPath));

// app.get('', (request, response) => {
//     response.send('Hello express!!');
// });

// app.get(properties.internalUrl.help, (request, response) => {
//     response.send('Help page');
// });

// app.get(properties.internalUrl.about, (request, response) => {
//     response.send('About page');
// });

app.get(properties.internalUrl.weather, (request, response) => {
    let myJsonResponse = {
        'myWeather': {
            'forecast': 'This is my forecast',
            'location': 'This is my location'
        }
    };
    response.send(myJsonResponse);
});

app.get(properties.internalUrl.license, (request, response) => {
    response.send('<h1>License</h1>');
});

// this starts up the server at indicated port 
app.listen(3000, () => {
    console.log(chalk.yellow('Server up and runnig !!'));
    console.log(chalk.magenta('  Dirname: ') + __dirname);
    console.log(chalk.magenta('  Filename: ') + __filename);
    console.log(chalk.magenta('  Joined path: ') + publicPath);
}); 