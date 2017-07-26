'use strict';

// server.js
// where your node app starts

// init project
// var express = require('express');
const express = require('express');
const logger = require('./utils/logger');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//var app = express();
const app = express();
app.use(cookieParser());
const exphbs = require('express-handlebars');
app.use(bodyParser.urlencoded({ extended: false, }));
app.use(express.static('public'));
app.use(fileUpload());
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
}));
app.set('view engine', '.hbs');

/**
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (request, response) {
  dreams.push(request.query.dream);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];
*/
const routes = require('./routes');
app.use('/', routes);

// listen for requests :)
const listener = app.listen(process.env.PORT || 4000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
