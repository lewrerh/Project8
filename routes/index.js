var express = require('express');
var router = express.Router();

const Book = require('../models/books');

router.get('/', function(request, response, next) {
    response.redirect('/books');
});

/*router.get('/books', function (request, response, next) {
    console.log("In books");
    response.render("all_books");
    
    /*Book.findAll({order: [["createdAt", "DESC"]]}).then(function(books){
      response.render("all_books", {books: books});
    }).catch(function(err) {
        response.send(500);
    });
});*/

module.exports = router;

