const express = require('express');
const chalk = require('chalk');
const properties = require('./properties.json');
const fs = require('fs');

// this creates an express web-server application
const app = express(); 

app.get('', (request, response) => {
    response.send('Hello express!!');
});

app.get(properties.internalUrl.help, (request, response) => {
    response.send('Help page');
});

app.get(properties.internalUrl.about, (request, response) => {
    response.send('About page');
});

app.get(properties.internalUrl.weather, (request, response) => {
    response.send('Weather page');
});

app.get(properties.internalUrl.license, (request, response) => {
    response.send('<h1>License</h1>');
});

// this starts up the server at indicated port 
app.listen(3000, () => {
    console.log(chalk.yellow('Server up and runnig !!'));
}); 