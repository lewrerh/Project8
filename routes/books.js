var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

var sqlite3 = require('sqlite3');

const Book = require("../models").Book;

//Get the books listing, show books in decending order
router.get('/', function (request, response, next) {
    Book.findAll({order: [["createdAt", "DESC"]]}).then(function(books){
      response.render("all_books", {title: "Books", books: books});
    }).catch(function (err) {
        console.log(err);
        response.sendStatus(500);
    });
});

// Get create a new book
router.get("/new", function (request, response, next) {
    response.render("new_book", { title: "New Book", book: Book.build() });
});

router.post('/new', function (request, response, next) {
    Book.create(request.body).then(function(book) {
         response.redirect("/");
     }).catch(function(err) {
         if(err.name === "SequelizeValidationError") {
             response.render("new_book", {
                 book: Book.build(request.body), 
                 title: "New Book",
                 errors: err.errors
             });            
         } else {
             throw err;
         }
     }).catch(function(err) {
         response.sendStatus(500);
     });
});

//Get individual book
router.get("/:id", function (request, response, next) {
    Book.findByPk(request.params.id).then(function (book) {
        if (book) {
            response.render("book_detail", { title: book.title, book: book});
        } else {
            response.render("page_not_found", { title: "Page Not Found" });
            response.sendStatus(404);
        }
    }).catch(function (err) {
        response.sendStatus(500);
    });
});

router.post("/:id", function (request, response, next) {
    Book.findByPk(request.params.id).then(function (book) {
        if (book) {
            return book.update(request.body);
        } else {
            response.sendStatus(404);
        }
    }).catch(function (err) {
        if (err.name === "SequelizeValidationError") {
            var book = Book.build(request.body);
            book.id = request.params.id;

            response.render("book_detail", {
                book: book,
                title: "Edit Book",
                errors: err.errors
            });
        } else {
            throw err;
        }
    }).then(function (book) {
        response.redirect("/");
    }).catch(function (err) {
        response.sendStatus(500);
    });
});

//Delete individual book 
router.post("/:id/delete", function (request, response, next) {
    Book.findByPk(request.params.id).then(function(book){
        if(book) {
          return book.destroy();
        } else {
          response.sendStatus(404);
        }
    }).then(function() {
        response.redirect("/");
    }).catch(function(err) {
    response.send(500);
    });
});

module.exports = router;
