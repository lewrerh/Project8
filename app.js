//var Sequelize = require('sequelize');
//var Sequelize = require ('sequelize');
//var sequelize = new Sequelize();
var express = require('express');
var port = 3000;
var app = express();
var router = express.Router();
var Book = require("./models/books").Book;   //This lets us use the Books model & all associated ORM methods
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var connect = require('connect')
// var methodOverride = require('method-override')
 


app.set('view engine', 'pug');
//Get the books listing
router.get('/', function (request, response, next) {
    Book.findAll({order: [["createdAt", "DESC"]]}).then(function(books){
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



module.exports = router;


