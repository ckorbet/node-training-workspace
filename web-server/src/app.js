const path = require('path');
const { yellow, magenta } = require('chalk');
const express = require('express');
const exphbs = require('express-handlebars');
const utils = require('./utils/utilities');
const request = require('request');

const properties = require('./properties.json');
const log = require('./utils/winston');
const { workers } = require('cluster');
const { query } = require('express');

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
    // defaultView  : 'index',
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

app.get(properties.url.internal.help, (request, response) => {
    response.render('help', {
        tittle: 'This is the dynamic help tittle',
        footer: 'This is the dynamic help footer'
    });
});

app.get(properties.url.internal.about, (request, response) => {
    response.render('about', {
        tittle: 'This is the dynamic about tittle',
        footer: 'This is the dynamic about footer'
    });
});

app.get('', (request, response) => {
    // name of the item to render must match exactly the name of the file in 'view' directory
    response.render('index', {
        name: 'Carlos Torres',
        tittle: 'This is the dynamic index tittle',
        footer: 'This is the dynamic index footer'
    }); 
});

app.get(properties.url.internal.license, (request, response) => {
    response.send('<h1>License</h1>');
});

app.get(properties.url.internal.weather, (req, res) => {
    const theAddress = req.query.address;
    if(theAddress) {
        log.info(`Received ${properties.url.internal.weather}?address=${theAddress}`);
        // TODO
        utils.geolocation(theAddress, utils.myGeoCallback(res, theAddress));
    } else {        
        log.warn(`Received ${properties.url.internal.weather} - address query param required`);
        res.send({ error: 'address query param required'});
    }
});

// Be aware of not returning two responses when actually only one can be sent
app.get(properties.url.internal.product, (request, response) => {
    if(!request.query.param1) { // This is the way we can retrieve query params
        response.send({ error: 'param1 required'});
    } else {
        log.info(request.query);
        response.send({        
        });    
    }
});

app.get(properties.url.internal.help + '/*', (request, response) => {
    response.render('error', {
        errorText: 'Content under construction',
        imgSrc: './img/underConstruction'
    });
});

// '*' means anything all URLs that doesnt already been match
// This needs to be mandatorily the last one as per express workers.
// Express see for URLs matches from top-to-bottom
app.get('*', (request, response) => {
    response.render('error', {
        errorText: 'Page not found',
        imgSrc: './img/404error.png'
    });
});

// this starts up the server at indicated port 
app.listen(defaultPort, () => {
    log.info(yellow('Server up and runnig in port ' + defaultPort + ' !!'));
    log.info(magenta('  Dirname: ') + __dirname);
    log.info(magenta('  Filename: ') + __filename);
    log.info(magenta('  Public static content path: ') + publicStaticContentPath);
    log.info(magenta('  Default layouts content path: ') + layoutsDefaultContentPath);
    log.info(magenta('  Default partials content path: ') + partialsDefaultContentPath);    
}); 

