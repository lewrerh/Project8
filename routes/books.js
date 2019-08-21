var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');

const Book = require('../models').Book;

var router = express.Router();    //Router using express
router.use(bodyParser.urlencoded({ extended: false }));



//Get the books listing, show books in decending order
router.get('/', function (request, response, next) {
    Book.findAll({order: [["createdAt", "DESC"]]}).then(function(books){
      response.render("all_book", {books: books});
    }).catch(function(err) {
        response.send(500);
    });
});

//Post create book
router.post('books/new', function(request, response, next) {
    response.render("new_books");
});
// router.post('/', function(request, response, next) {
//     book.create(req.body).then(function(book) {
//         response.redirect("/books/" + book.id);
//     }).catch(function(err) {
//         if(err.name === "SequelizeValidationError") {
//             response.render("new_book", {
//                 book: Book.build(req.body), 
//                 title: [],
//                 errors: err.errors
//             });            
//         } else {
//             throw err;
//         }
//     }).catch(function(err) {
//         response.send(500);
//     });
// });
   /* var book = Object.assign({}, req.body, {
        id: books.length + 1, 
        publishedAt: publishedAt,    //These two lines add instance to book, display published time & description
        shortDescription: shortDescription
    });
    books.push(book);*/



//Create a new book form
router.get('/new', function (request, response, next) {
    response.render("books/new", {book: Book.build(), title: "New book"});
});
//Update book form
router.get("/:id", function (request, response, next) {
    Book.findById(req.params.id).then(function(book){
        if(book) {
        response.render("books/edit", {book: book, title: "Edit book"});
        } else {
            response.send(404);
        }
    }).catch(function(err) {
        response.send(500);
    });
});

//Delete individual book 
router.get("/:id/delete", function (request, response, next) {
    Book.findById(req.params.id).then(function(book){
        if (book){
        response.render("books/edit", {book: book, title: "Edit book"});
    } else {
        response.send(404);
    }
    }).catch(function(err) {
    response.send(500);
    });
});

//Get individual book
router.get("/:id", function (request, response, next) {
    Book.findById(req.params.id).then(function(book){
        if(book) {
        response.render("books/show", {book: book, title: book.title});
        } else {
            response.send(404);
        }
    }).catch(function(err) {
        response.send(500);
    });
});

//Put update individual book
router.put("/:id", function (request, response, next) {
    Book.findById(req.params.id).then(function(book){
        if(book) {
        return book.update(req.body);
        } else {
            response.send(404);
        }
    }).then(function(book) {
        response.redirect("/books/" + article.id);
    }).catch(function(err) {
            if(err.name === "SequelizeValidationError") {
                var article = Book.build(req.body);
                article.id = req.params.id;

                res.render("books/edit", {
                    book: book,
                    title: "Edit Book",
                    errors: err.errors
                });
            } else {
                throw err;
            }
    response.send(500);
    });
});

//Delete individual book 
router.delete("/:id/delete", function (request, response, next) {
    Book.findById(req.params.id).then(function(book){
        if(book) {
        return book.destroy();
    } else {
        res.send(404);
    }
    }).then(function() {
        response.redirect("/books/");
    }).catch(function(err) {
    response.send(500);
    });
});

module.exports = router;