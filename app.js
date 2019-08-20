//const Sequelize = require('sequelize');
//const Sequelize = require ('sequelize');
//const sequelize = new Sequelize();
var express = require('express');
var router = express.Router();
var Book = require("../models").Book; //This lets us use the Books model & all associated ORM methods

var dateFormat = require('dateformat');

/*function publishedAt() {
    return dateFormat(this.createdAt, "dddd,mmm dS, yyyy, h:MM TT");
}

function shortDescription() {
    return this.body.length > 30 ? this.body.substr(0.30) + "..." : this.body;
}

var books = [
    {
    id: 1,
    title: "My First Book",
    author: "Andrew Chalkey",
    body: "This is my book model file"
    }
];
    

function find(id) {
    var matchedBooks = books.filter(function(book) {return book.id == id; });
    return matchedBooks[0];
}*/
//Get the books listing
router.get('/', function (request, response, next) {
    Book.finAll({order: [["createdAt", "DESC"]]}).then(function(books){
      response.render("books/index", {books: books, title: "My Blog"});
    }).catch(function(err) {
        response.send(500);
    });
});

//Post create book
router.post('/', function(request, response, next) {
    book.create(req.body).then(function(book) {
        response.redirect("/books/" + book.id);
    }).catch(function(err) {
        if(err.name === "SequelizeValidationError") {
            response.render("books/new", {
                book: Book.build(req.body), 
                title: "New book",
                errors: err.errors
            });            
        } else {
            throw err;
        }
    }).catch(function(err) {
        response.send(500);
    });
});
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
router.get("/:edit", function (request, response, next) {
    Book.findById(req.params.id).then(function(book){
        if(article) {
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


