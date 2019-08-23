var methodOverride = require('method-override')    //Lets you use HTTP verbs, used prior to other modules

var sqlite3 = require('sqlite3');
const sequelize = require ('./models').sequelize;
const nodemon = require("nodemon")
var path = require('path');
const express = require('express');
const app = express();
var routes = require('./routes/index');
var books = require('./routes/books');   
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

app.use(methodOverride('method'));

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public/'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use('/', routes);
app.use('/books', books);

app.use(function (request, response, next) {              // Set an error handling middleware for the project   

    const err = new Error('Server error: Your requested page does not exist');
    err.status = 404;
    next(err);
});

//Handle errors
app.use(function (err, request, response, next) {
    response.locals.error = err;
    response.render('error', { error: err });
    console.log("Server error: Your requested page does not exist");
});

//Start server listening on port 3000
app.listen('3000', () => {
    console.log('Server started on port 3000');
});




