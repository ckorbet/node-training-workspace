const path = require('path');
const chalk = require('chalk');
const express = require('express');
const exphbs = require('express-handlebars');

const properties = require('./properties.json');

const publicStaticContentPath = path.join(__dirname, '../public');
const layoutsDefaultContentPath = path.join(__dirname, '../views');
const partialsDefaultContentPath = path.join(__dirname, '../views/partials');
const defaultPort = 3000;

// this creates an express web-server application
const app = express();

/*
 * THIS SET UP THE SERVER CONFIG FOR TEMPLATING
 */
const handlebars = exphbs.create({ // express-handlebars engine config
    extname      : 'hbs',
    defaultView  : 'index',
    layoutsDir   : layoutsDefaultContentPath,
    defaultLayout: 'index',
    partialsDir  : partialsDefaultContentPath
});
app.engine('hbs', handlebars.engine); // this set up the templating engine
app.set('view engine', 'hbs'); // this set up the view engine
app.use(express.static(publicStaticContentPath)); // this set up the default public content directory
app.set('views', layoutsDefaultContentPath); // this se upt the default engine view directory

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
    response.render('index', {
        name: 'Carlos Torres'
    }); 
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
app.listen(defaultPort, () => {
    console.log(chalk.yellow('Server up and runnig in port ' + defaultPort + ' !!'));
    console.log(chalk.magenta('  Dirname: ') + __dirname);
    console.log(chalk.magenta('  Filename: ') + __filename);
    console.log(chalk.magenta('  Public static content path: ') + publicStaticContentPath);
    console.log(chalk.magenta('  Default layouts content path: ') + layoutsDefaultContentPath);
    console.log(chalk.magenta('  Default partials content path: ') + partialsDefaultContentPath);    
}); 