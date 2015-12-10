var bodyParser = require('body-parser');
var express = require('express');
var morgan = require('morgan');
var path = require('path');

// Server routers:
var index = require(path.join(__dirname, 'routes/index'));
var dest = require(path.join(__dirname, 'routes/dest'));


var app = express();

// Log requests:
app.use(morgan('dev'));

// Client Route:
app.use(express.static(path.join(__dirname, '../client')));

app.use(bodyParser.json());
// parse application/x-www-form-urlencoded:
app.use(bodyParser.urlencoded({ extended: false }));

// Server routing:
app.use('/api', index);
app.use('/api/dest', dest);


module.exports = app;