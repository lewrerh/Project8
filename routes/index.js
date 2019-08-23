var express = require('express');
var router = express.Router();

const Book = require('../models/books');

router.get('/', function(request, response, next) {
    response.redirect('/books');
});

module.exports = router;

