const path = require('path');
const express = require('express');
const chalk = require('chalk');
const exphbs = require('express-handlebars');

const properties = require('./properties.json');

const publicStaticContentPath = path.join(__dirname, '../public');
const publicDinamicContentPath = path.join(__dirname, '../view');

// this creates an express web-server application
const app = express();

// this set up the view engine for dinamic content/templates
app.engine('hbs', exphbs.create().engine);
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs'); // hbs == handlebars
// this set up the directory of the dinami  c views for handlebars
app.set('views', publicDinamicContentPath);

// this set up the path/directory of the public/static content to be served
app.use(express.static(publicStaticContentPath));

// app.get('', (request, response) => {
//     response.send('Hello express!!');
// });

// app.get(properties.internalUrl.help, (request, response) => {
//     response.send('Help page');
// });

// app.get(properties.internalUrl.about, (request, response) => {
//     response.send('About page');
// });

app.get('', (request, response) => {
    // name of the item to render must match exactly the name of the file in 'view' directory
    response.render('index'); 
});

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
    console.log(chalk.yellow('Server up and runnig in port 3000 !!'));
    console.log(chalk.magenta('  Dirname: ') + __dirname);
    console.log(chalk.magenta('  Filename: ') + __filename);
    console.log(chalk.magenta('  Public static content path: ') + publicStaticContentPath);
    console.log(chalk.magenta('  Public dinamic content path: ') + publicDinamicContentPath);
    
}); 